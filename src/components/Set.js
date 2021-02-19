import React, { useState, useEffect, useRef } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { FiTrash } from 'react-icons/fi'
import { useParams, useHistory } from 'react-router-dom';
import APIEndpoints from '../api';
import axios from 'axios';
import uniqid from 'uniqid';
import Sidebar from '../components/Sidebar';
import '../styles/Set.scss';


export default function Set (props) {
    const [activeUser, setActiveUser] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [vocabArray, setVocabArray] = useState([]);
    const [newWord, setNewWord] = useState('');
    const [explanation, setExplanation] = useState('');
    const firstTimeRender = useRef(true);

    const { profile, set } = useParams();
    const history = useHistory();
    
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
        firstTimeRender.current = false 
        const currentActiveUser = allUsers.data.find(element => element.data.username === props.user);
        setActiveUser(currentActiveUser);   
        setUniqueId(currentActiveUser.uniqueId);
        setVocabArray(currentActiveUser.data.vocab[set]);
    };

    const redirectToVocabInfo = (e) => {
        let vocabInfoURL = e.target.dataset.index;
        history.push(`/${profile}/vocab/${set}/${vocabInfoURL}`)
    }

    const redirectToSetQuiz = () => {
        history.push(`/${profile}/vocab/${set}/quiz`)
    }

    const deleteItem = (e) => {
        e.stopPropagation();
        let updatedArray = vocabArray.filter(element => element.word !== e.target.dataset.index)
        if(window.confirm('Really Delete Word?')){
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.vocab[set] = updatedArray;
                return newState;
            });
            setVocabArray(updatedArray)
        }
    }

    async function submitNewWordAndExplanation (e) {
        e.preventDefault();
        let APIData = await wordAPICall();
        let definitionArray = [];
        
        for(let i = 0; i <= APIData.data.results.length-1; i++){
            console.log(APIData.data.results[i])
            definitionArray.push(APIData.data.results[i].definition)
        }

        let newWordObject = {word: newWord, 
            explanation: explanation, 
            pronunciation: APIData.data.pronunciation.all,
            definitions: definitionArray
        }

        let updatedArray = vocabArray.concat(newWordObject);
        setActiveUser((prevState) => {
            const newState = Object.assign({}, prevState);
            newState.data.vocab[set] = updatedArray;
            return newState;
        });
        setVocabArray(updatedArray);
        setNewWord('');
        setExplanation('');
    };

    
    async function wordAPICall () {
        try {
            const result = await axios.get(`https://wordsapiv1.p.rapidapi.com/words/${newWord}`,
                {headers: {
                    'x-rapidapi-key': 'f74c925871msh70f9c315d6fed91p101f0cjsn861ef3bc1f60',
                    'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
                }})
                return result            
            } catch (error) {
            console.log(error)
        }
    }
    

    useEffect(() => {
        if (!firstTimeRender.current) {
            props.updateUser(uniqueId, activeUser);
        }
    }, [activeUser])

    if(!activeUser){
        return(
            <div className='set-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='set-main-container'>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='set-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='set-main-container'>
                    <h1 className='set-title'>Your words in the {set} set</h1>
                    <div className='word-add'>
                        <h2>Add Word to {set}</h2>
                        <input type='text'
                            placeholder='word' 
                            className='word-add-input' 
                            value={newWord} 
                            onChange={e => {setNewWord(e.target.value)}}/>
                        <input type='text'
                            placeholder='explanation' 
                            className='word-add-input' 
                            value={explanation} 
                            onChange={e => {setExplanation(e.target.value)}}/>
                        <BiPlusCircle className='bi-plus-circle' 
                            onClick={e => submitNewWordAndExplanation(e)}>
                        </BiPlusCircle>
                        <button onClick={redirectToSetQuiz}>Quiz</button>
                    </div>
                    <div className='vocabulary-item-container'>
                    {vocabArray.map((item) => (
                        <div className='vocabulary-item'
                        key={uniqid}>
                            <div className='vocab-front-word'>
                                <h2>{item.word}</h2>
                            </div>
                            <div className='vocab-back-explanation'
                            data-index={item.word}
                            onClick={e => redirectToVocabInfo(e)}>
                                <h2 data-index={item.word}>{item.explanation}</h2>
                                <FiTrash data-index={item.word} onClick={e => deleteItem(e)}/>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        )
    }
}
