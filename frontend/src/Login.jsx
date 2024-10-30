import { useContext } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import AuthContext from "./context/AuthContext";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    email.length > 0 && loginUser(username, email, password);

    console.log(username);
    console.log(email);
    console.log(password);
  };
  return (
    <div className="back" id="login">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          className="username"
          type="username"
          name="username"
          placeholder="Username"
        />
        <br />
        <input
          className="email"
          type="email"
          name="email"
          placeholder="Enter your Email"
        />
        <br />
        <input
          className="password"
          type="password"
          name="password"
          placeholder="Enter Password"
        />
        <br />
        <button className="loginbutton" type="submit">
          Login
        </button>
        <p>
          <Link to="/signup">Don't have an account?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
