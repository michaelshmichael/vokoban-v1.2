import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import APIEndpoints from '../api';
import joiningSVG from '../svg/joining.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Registration.scss';

toast.configure()

export default function Registration() {
    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('English');
    const [learningLanguage, setLearningLanguage] = useState(['English']);
    const [email, setEmail] = useState('');
    const vocab = {}

    const handleChanges = (formItemBeingUpdated, e) => {
        switch (formItemBeingUpdated) {
        case 'firstName':
            setFirstName(e.target.value);
            break;
        case 'lastName':
            setLastName(e.target.value);
            break;
        case 'username':
            setUsername(e.target.value);
            break;
        case 'password':
            setPassword(e.target.value);
            break;
        case 'email':
            setEmail(e.target.value);
            break;
        default:
        // do nothing
        }
    };

    const redirectToLoginPageAfterRegistering = () => {
        history.push('./login');
    };

    const registerToast = () => {
        toast.success(`${username} successfully registered!`)
    }

    const failedRegisterToast = () => {
        toast.error('Could not register. Try again.')
    }

    async function registerUser(e) {
        e.preventDefault();
        const userData = {
            firstName,
            lastName,
            username,
            password,
            email,
            nativeLanguage,
            learningLanguage,
            vocab
        };
        try {
            await axios.post(APIEndpoints.authenticationEndpoint, userData, { withCredentials: true });
            await axios.post(APIEndpoints.userDataEndpoint,
                userData, 
                { withCredentials: true },
                { headers: {'Content-Type': 'application/json'}}
            );
            redirectToLoginPageAfterRegistering();
            registerToast();
        } catch (error) {
            failedRegisterToast();
            console.error(error);
        }
    }

    return (
        <div className='registration-page-container'>
        <div className='registration-form-container'>
            <form method='post' action='#' autoComplete='off' className='registration-form'>
                <div className="form-group">
                    <label htmlFor="firstNameInput">First Name </label>
                    <input type="text"
                        className="form-control"
                        id="firstNameInput"
                        value={firstName}
                        onChange={e => handleChanges('firstName', e)}
                    ></input>
                </div>
                <div className="form-group">
                    <label htmlFor="lastNameInput">Last Name </label>
                    <input type="text"
                        className="form-control"
                        id="lastNameInput"
                        value={lastName}
                        onChange={e => handleChanges('lastName', e)}
                    ></input>
                </div>
                <div className="form-group">
                    <label htmlFor="lastNameInput">Username </label>
                    <input type="text"
                        className="form-control"
                        id="usernameInput"
                        value={username}
                        onChange={e => handleChanges('username', e)}
                    ></input>
                </div>
                <div className="form-group">
                    <label htmlFor="passwordInput">Password </label>
                    <input type="password"
                        className="form-control"
                        id="passwordInput"
                        value={password}
                        onChange={e => handleChanges('password', e)}
                    ></input>
                </div>
                <div className="form-group">
                    <label htmlFor="nativeLanguage">Native Language </label>
                    <select onChange={e => setNativeLanguage(e.currentTarget.value)}
                    value={nativeLanguage} 
                    id="nativeLanguage" 
                    name="nativeLanguage">
                        <option value="English">English</option>
                        <option value="Russian">Russian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="Italian">Italian</option>
                        <option value="German">German</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="learningLanguage">Language you are learning </label>
                    <select onChange={e => setLearningLanguage([e.currentTarget.value])}
                    value={learningLanguage} 
                    id="learningLanguage" 
                    name="learningLanguage">
                        <option value="English">English</option>
                        <option value="Russian">Russian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="emailInput">Email </label>
                    <input type="email"
                        className="form-control"
                        id="emailInput"
                        value={email}
                        onChange={e => handleChanges('email', e)}
                    ></input>
                </div>
                <button className='btn btn-primary registration-button' onClick={registerUser}>Register</button>
            </form>
        </div>
        <img className='joiningSVG' src={joiningSVG} alt='join-us!'></img>
        </div>
    );
}
