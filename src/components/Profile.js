import React, { useEffect, useState } from 'react';
import { formatDistance} from 'date-fns';
import { useParams } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import parseISO from 'date-fns/parseISO';
import axios from 'axios';
import unitedKingdom from '../svg/unitedKingdom.svg';
import russia from '../svg/russia.svg';
import portugal from '../svg/portugal.svg';
import italy from '../svg/italy.svg';
import france from '../svg/france.svg';
import germany from '../svg/germany.svg';
import spain from '../svg/spain.svg';
import APIEndpoints from '../api';
import Sidebar from './Sidebar';
import '../styles/Profile.scss';

export default function Profile (props) {
    const [activeUser, setActiveUser] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [nativeLanguageFlag, setNativeLanguageFlag] = useState();
    const [newLearningLanguage, setNewLearningLanguage] = useState('English');
    const [userCreatedDate, setUserCreatedDate] = useState();
    const { profile } = useParams();

    useEffect(() => {
        async function getUserData () {
            try {
                const allUsers = await axios.get(APIEndpoints.userDataEndpoint, {withCredentials: true});
                getActiveUser(allUsers);
            } catch (error) {
                console.error(error);
            }
        }
        getUserData();
    },[]);

    const displayFlag = (userData) => {
        if(userData.nativeLanguage === 'Portuguese') {
            setNativeLanguageFlag(portugal)
        } else if (userData.nativeLanguage === 'French') {
            setNativeLanguageFlag(france)
        } else if (userData.nativeLanguage === 'Italian') {
            setNativeLanguageFlag(italy) 
        } else if (userData.nativeLanguage === 'German') {
            setNativeLanguageFlag(germany)
        } else if (userData.nativeLanguage === 'Russian') {
            setNativeLanguageFlag(russia)
        } else if (userData.nativeLanguage === 'Spanish') {
            setNativeLanguageFlag(spain)
        } else if (userData.nativeLanguage === 'English') {
            setNativeLanguageFlag(unitedKingdom)
        }
    };

    const getActiveUser = (allUsers) => {
        const currentActiveUser = allUsers.data.find(element => element.data.username === profile);
        let dateCreated = currentActiveUser.createdAt.slice(0,10);
        setUserCreatedDate(dateCreated);
        displayFlag(currentActiveUser.data);
        setActiveUser(currentActiveUser);
        console.log(currentActiveUser)
        setUniqueId(currentActiveUser.uniqueId);
    }

    const addLanguage = () => {
        if(activeUser.data.nativeLanguage === newLearningLanguage){
            alert('You know this already')
        } else if(!activeUser.data.learningLanguage.includes(newLearningLanguage)){
            let updatedLanguages = [...activeUser.data.learningLanguage, newLearningLanguage]
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.learningLanguage = updatedLanguages;
                return newState;
            });
        } else {
            alert('Already Learning')
        }
    };

    const deleteLanguage = (languageToDelete) => {
        let updatedLanguages = activeUser.data.learningLanguage.filter(element => element !== languageToDelete)
        if(window.confirm('Really Delete Language?')){
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.learningLanguage = updatedLanguages;
                return newState;
            });
        };
    }

    useEffect(() => {
        props.updateUser(uniqueId, activeUser);
    }, [activeUser])

    if(!activeUser) {
        return(
            <div className='profile-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='profile-data-container'>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='profile-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='profile-data-container'>
                    <div className='username-and-flag-container'>
                        <h1 className='profile-name'>{activeUser.data.username}</h1>
                        <img className='native-language-flag' src={nativeLanguageFlag} alt='flag-showing-native-language'></img>
                        <p className='member-for'> Member for {formatDistance(parseISO(userCreatedDate), new Date())}</p>
                    </div>
                    <div className='learning-languages-container'>
                        <h1>Languages Being Studied</h1>
                        {activeUser.data.learningLanguage.map((language) => (
                            <div className='learning-languages-individual'>
                            <h2>{language}</h2>
                            <FaTrashAlt className='learning-languages-individual-button'
                            onClick={e => deleteLanguage(language)}
                            >Delete</FaTrashAlt>
                            </div>
                        ))}
                    </div>
                    <div className='another-language-div'>
                        <h3>Another Language?</h3>
                        <div className='another-language-select'>
                            <select onChange={e => setNewLearningLanguage(e.currentTarget.value)} 
                            id="learningLanguage" 
                            name="learningLanguage"
                            placeholder="Another Language?">
                                <option value="English">English</option>
                                <option value="Russian">Russian</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Spanish">Spanish</option>
                            </select>
                            <button onClick={addLanguage} className='uibutton'>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

