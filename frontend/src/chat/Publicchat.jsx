import publicphoto from "../assets/default.jpeg";

function Public_chat({ name, photo }) {
  const displayphoto = photo ? photo : publicphoto;
  return (
    <div className="publicchat">
      <img
        className="publicchat-image"
        src={displayphoto}
        alt={name}
        width="35"
        height="35"
      />
      <h2 className="publicchat-name">{name}</h2>
      <p className="publicchat-lastmessage"></p>
    </div>
  );
}

export default Public_chat;
