import json
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User, AnonymousUser
from .models import ZajelMessage, ZajelGroup
from channels.db import database_sync_to_async
import jwt


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # extract token
        query_string = self.scope["query_string"].decode("utf-8")
        print(f"Query String: {type(query_string)}")  # Debugging line

        self.token = self.scope["query_string"].decode(
            "utf-8").split("token=")[-1]
        self.user = await self.get_user_from_token(self.token)
        self.scope["user"] = self.user

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Log the connection
        print(f"New connection to room: {self.room_name}")
        print(self.user)

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        print(f"Handshake successful for room: {self.room_name}")

    async def disconnect(self, close_code):
        # Leave the room group
        print(
            f"Disconnected from room: {
                self.room_name} with code {close_code}"
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def get_user_from_token(self, token):
        if token:
            try:
                # decode token
                payload = jwt.decode(
                    token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload["user_id"]
                user = await database_sync_to_async(User.objects.get)(id=user_id)
                return user
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                return AnonymousUser()
            except jwt.DecodeError as e:
                print(f"Token decoding error: {e}")
                return AnonymousUser()
            except User.DoesNotExist:
                print(f"User with id {user_id} does not exist")
                return AnonymousUser()
        print("No token provided")
        return AnonymousUser()

        # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")

        # Log user authentication status
        print("message recieved", message)
        print(f"User authenticated: {self.scope['user'].is_authenticated}")
        print(f"Username: {self.scope['user']}")

        # Get the current user from the WebSocket scope
        user = self.scope["user"]

        # Save the message to the database
        await self.save_message(user, message)

        # Send the message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "author": user.id if user.is_authenticated else "Anonymous",
            },
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        author = event["author"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "author": author}))

    @database_sync_to_async
    def save_message(self, user, message):
        group = ZajelGroup.objects.get(group_name=self.room_name)
        ZajelMessage.objects.create(
            group_name=group,
            author=user if user.is_authenticated else None,
            body=message,
        )
