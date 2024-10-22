from django.apps import AppConfig
from a_chat.signals import *


class AChatConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "a_chat"

    def ready(self):
        import a_chat.signals
        return super().ready()
