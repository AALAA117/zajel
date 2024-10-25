import Header from "./Header.jsx";
import ContentTable from "./Content.jsx";
import Chat from "./Chat.jsx";
import Bob from './assets/bob.jpeg';
function App() {
  const handleLogout = () => {
    alert("Logging out...");
  };
  const newcontact = {
    name: "Bob",
    lastMessage: "hi, are you okay",
    photo: Bob
  };
  return (
    <>
      <Header onlogout={handleLogout} />
      <div className="app-container">
        <ContentTable />
        <Chat contact={newcontact} />
      </div>
    </>
  );
}

export default App;
