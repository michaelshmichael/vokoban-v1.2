import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FiTrash} from 'react-icons/fi';
import { BiPlusCircle } from 'react-icons/bi';
import { toast } from 'react-toastify'; 
import axios from 'axios';
import uniqid from 'uniqid';
import APIEndpoints from '../api';
import Sidebar from '../components/Sidebar';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Vocab.scss';

toast.configure();

export default function Vocab (props) {
    const [activeUser, setActiveUser] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [vocabSetsArray, setVocabSetsArray] = useState([]);
    const [newSetName, setNewSetName] = useState('');
    const history = useHistory();
    const { profile } = useParams();
    
    // These two functions are repeated from the profile page. Could be refactored I'm sure.
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

    const getActiveUser = (allUsers) => {
        const currentActiveUser = allUsers.data.find(element => element.data.username === props.user);
        setUniqueId(currentActiveUser.uniqueId);
        setActiveUser(currentActiveUser);
        let vocabSetsArray = Object.keys(currentActiveUser.data.vocab)
        setVocabSetsArray(vocabSetsArray)
    };

    const redirectToSet = (e) => {
        let vocabSetURL = e.target.dataset.index;
        history.push(`/${profile}/vocab/${vocabSetURL}`);
    }

    const deleteSet = (event) => {
        event.stopPropagation();
        let vocabSetName = event.target.dataset.index
        let updatedVocabSets = vocabSetsArray.filter(element => element !== vocabSetName);
        if(window.confirm('Really Delete Set?')){
            delete activeUser.data.vocab[vocabSetName]
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                return newState;
            });
            setVocabSetsArray(updatedVocabSets)
            toast.info(`${vocabSetName} deleted`, { autoClose: 1000 })
        } else {
            return;
        }
    };

    const addSet = () => {
        if(newSetName === ''){
            return;
        } else {
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.vocab[newSetName] = [];
                return newState;
            });
            setVocabSetsArray(vocabSetsArray.concat(newSetName))
            setNewSetName('');
        }
    };

    useEffect(() => {
        if(uniqueId){
            props.updateUser(uniqueId, activeUser);
        }
    }, [activeUser])

    if(!activeUser) {
        return(
            <div className='sets-page-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='sets-main-container'>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='sets-page-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='sets-main-container'>
                    <h1 className='sets-main-title'>Your Sets</h1>
                    <div className='sets-add-container'>
                        <h2 className='sets-add'>Add Set</h2>
                        <input type='text' 
                            value={newSetName} 
                            className= 'new-set-input-box'
                            onChange={e => setNewSetName(e.target.value)}/>
                        <BiPlusCircle className='bi-plus-circle' onClick={addSet}/>
                    </div>
                    <div className='sets-box-container'>
                        {vocabSetsArray.map((set) => (
                            <div
                            data-index={set}
                            key={uniqid}
                            className='set-box'
                            onClick={e => redirectToSet(e)}>
                                <h1 data-index={set}
                                >{set}</h1>
                                    <div className='delete-set'>
                                    <FiTrash data-index={set}  
                                    onClick={e => deleteSet(e)}
                                    />
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}