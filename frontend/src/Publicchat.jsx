import publicphoto from './assets/publicchat.jpg';

function Public_chat(){
    return(
        <div className="publicchat">
            <img
                className="publicchat-image"
                src={publicphoto}
                alt="public"
                width="35" 
                height="35" 
                />
            <h2 className="publicchat-name">Public Chat</h2>
            <p className="publicchat-lastmessage">hi, are you okay</p>
        </div>
    );
}

export default Public_chat