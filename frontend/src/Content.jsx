import Public_chat from "./Publicchat";
import Content_Chat from "./Contact_chat";
import Footer from "./Footer";

function ContentTable(){
    return(
        <div className="contenttable">
            <Public_chat />
            <Content_Chat />
            <Content_Chat />
            <Content_Chat />
            <Footer />
        </div>
    );
}

export default ContentTable