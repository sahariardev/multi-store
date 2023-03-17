import './Login.css'
import {useState} from 'react';
import {postRequest} from "./Util";
import Url from "./Url";
import Cookies from 'js-cookie';

const LoginView = () => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [message, setMessage] = useState();

    const submitForm = async () => {
        const data = await postRequest(Url.login, {username, password}, {message : setMessage});
        if (data && data.token) {
            Cookies.set('token', data.token);
            window.location.reload();
        }
    }

    return (
        <div className="login-page">
            <div className="form">
                <form className="login-form">
                    {message && (<div className="form-error-message">{message}</div>)}
                    <input type="text" placeholder="username" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <button type="button" onClick={() => submitForm()}>login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginView;