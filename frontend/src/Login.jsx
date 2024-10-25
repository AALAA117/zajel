import { useState , useContext} from 'react';
import { Link } from 'react-router-dom'
import "./Login.css"
import AuthContext from './context/AuthContext'

function Login(){
    const {loginUser} = useContext(AuthContext)
  const handleSubmit = e => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    email.length > 0 && loginUser(email, password)

    console.log(email)
    console.log(password)
   
  }
    return (
        <div className='back' id="login">
            <form className='form' onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input className="email" type="email" placeholder="Enter your Email" />
                <br />
                <input className="password" type="password" name="password" placeholder="Enter Password" />
                <br />
                <button className="loginbutton" type="submit">Login</button>
                <p><Link to="/signup">Don't have an account?</Link></p>
            </form>
        </div>
    );
}

export default Login