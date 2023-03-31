import {useState} from "react";
import {postRequest} from "../Util";
import Url from "../Url";
import Cookies from "js-cookie";

const PasswordResetView = () => {
    const [oldPassword, setOldPassword] = useState();
    const [oldPasswordError, setOldPasswordError] = useState();

    const [newPassword, setNewPassword] = useState();
    const [newPasswordError, setNewPasswordError] = useState();

    const [repeatNewPassword, setRepeatNewPassword] = useState();
    const [repeatNewPasswordError, setRepeatNewPasswordError] = useState();

    const submitForm = async () => {
        const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            repeatPassword: repeatNewPassword,
        };

        const errorSetters = {
            oldPassword: setOldPasswordError,
            newPassword: setNewPasswordError,
            repeatPassword: setRepeatNewPasswordError,
        }

        const token = await postRequest(Url.changePassword, data, errorSetters);
        if (token) {
            Cookies.set('token', token);
            window.location.reload();
        }
    }

    return (<div>
        <div className="login-page">
            <div className="form">
                <form className="login-form">
                    <input type="password" placeholder="Old Password" value={oldPassword}
                           onChange={(e) => setOldPassword(e.target.value)}/>
                    {oldPasswordError && (<div className="form-error-message">{oldPasswordError}</div>)}

                    <input type="password" placeholder="New Password" value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}/>

                    {newPasswordError && (<div className="form-error-message">{newPasswordError}</div>)}
                    <input type="password" placeholder="Repeat New Password" value={repeatNewPassword}
                           onChange={(e) => setRepeatNewPassword(e.target.value)}/>

                    {repeatNewPasswordError && (<div className="form-error-message">{repeatNewPasswordError}</div>)}
                    <button type="button" onClick={() => submitForm()}>Reset</button>
                </form>
            </div>
        </div>
    </div>);
}

export default PasswordResetView;