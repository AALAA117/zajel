function Content_Chat({ image, name, lastMessage, onClick }){
    return(
        <div className="contentchat" onClick={onClick}>
            <img
                className="contentchat-image"
                src= {image}
                alt= {name}
                width="35" 
                height="35" 
                />
            <h2 className="contentchat-name">{name}</h2>
            <p className="contentchat-lastmessage">{lastMessage}</p>
        </div>
    )
}

export default Content_Chat