import LOGOUT from './assets/logout.webp'

function Header({onlogout}){
    return(
        <header className="upperpart">
            <h1 className="title">zajel</h1>
            <button className="logout" onClick={onlogout}>
                <img
                    src={LOGOUT}
                    alt="Logout"
                    width="35" 
                    height="35" 
                />
            </button>
        </header>
    );
}

export default Header