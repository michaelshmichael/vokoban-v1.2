import React, { useRef, useState, useEffect } from 'react';
import APIEndpoints from '../api';
import { BiMessageSquareAdd } from 'react-icons/bi';
import axios from 'axios';
import Sidebar from './Sidebar.js';
import unitedKingdom from '../svg/unitedKingdom.svg';
import russia from '../svg/russia.svg';
import portugal from '../svg/portugal.svg';
import italy from '../svg/italy.svg';
import france from '../svg/france.svg';
import germany from '../svg/germany.svg';
import spain from '../svg/spain.svg';
import '../styles/Search.scss';

export default function Search(props) {
    const [searchWord, setSearchWord] = useState('');
    const [associationArray, setAssociationArray] = useState([]);
    const [activeUser, setActiveUser] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const inputRef = useRef();
    const searchButton = useRef();
    
    // Rename this
    let searchHeader;
    if (props.language === 'en') {
        searchHeader = 'Search in English';
    } else if (props.language === 'ru') {
        searchHeader = 'Search in Russian';
    } else if (props.language === 'pt') {
        searchHeader = 'Search in Portuguese'
    } else if (props.language === 'de') {
        searchHeader = 'Search in German';
    } else if (props.language === 'fr') {
        searchHeader = 'Search in French';
    } else if (props.language === 'it') {
        searchHeader = 'Search in Italian';
    } else if (props.language === 'es') {
        searchHeader = 'Search in Spanish';
    }

    // These two functions are repeated from the profile page. Could be refactored I'm sure.
    useEffect(() => {
        async function getUserData () {
            try {
                const allUsers = await axios.get(APIEndpoints.userDataEndpoint, {withCredentials: true});
                getActiveUser(allUsers);
                console.log('ALL USERS')
                console.log(allUsers)
            } catch (error) {
                console.error(error);
            }
        }
        getUserData();
    },[]);

    const getActiveUser = (allUsers) => {
        const currentActiveUser = allUsers.data.find(element => element.data.username === props.user);
        setActiveUser(currentActiveUser);
        setUniqueId(currentActiveUser.uniqueId);
    };

    const createNewSearchFromResult = (e) =>  {
        setSearchWord(e);
        inputRef.current.value = e;
        searchButton.current.focus();
    };

    class association {
        constructor(meaning, partOfSpeech, weight){
            this.meaning = meaning
            this.partOfSpeech = partOfSpeech;
            this.weight = weight;
        }
    };
    
    async function _getAssociations () {
        try {
            let data = await fetch(`https://api.wordassociations.net/associations/v1.0/json/search?apikey=5b4acb51-a76e-4d05-9349-8044794dea94&text=${searchWord}&lang=${props.language}&limit=10`, 
            {mode: 'no-cors'},
            {'Access-Control-Allow-Origin': '*'})
            let words = await data.json()
            console.log(words)
            return words
        } catch {
            console.log('Error')
        }
    };

    const _makeAssociationData = (data, i) => {
        let defaultAssociation = new association();
        defaultAssociation.meaning = data.response[0].items[i].item
        defaultAssociation.partOfSpeech = data.response[0].items[i].pos
        defaultAssociation.weight = data.response[0].items[i].weight
        return defaultAssociation
    }
    
    async function setAssociations () {
        let words = await _getAssociations()
        if(words.response[0].items.length !== 0) {
            let placeholderArray = []
            for(let i=0; i < 10; i++) {
                let association =_makeAssociationData(words, i)
                placeholderArray.push(association)
            }
            setAssociationArray(placeholderArray)
        } else {
            alert('Try new word')
        }  
    };

    const addWordToActiveUserVocab = (newAssociatedWord) => {
        let updatedVocab
        if(activeUser.data.vocab.miscellaneous){
            updatedVocab = [...activeUser.data.vocab.miscellaneous, newAssociatedWord]
        } else {
            updatedVocab = [newAssociatedWord]
        }
        setActiveUser((prevState) => {
            const newState = Object.assign({}, prevState);
            newState.data.vocab.miscellaneous = updatedVocab;
            return newState;
        });
        console.log(activeUser.data.vocab.miscellaneous)
    };

    useEffect(() => {
        if(uniqueId){
            async function updateUserAssociatedWords() {
                console.log('Associated Words')
                console.log(activeUser)
                try {
                    const updatedUser = await axios.put(`https://app.yawe.dev/api/1/ce/non-auth-endpoint?key=b0188b53ea77419ba1d6dcda06e4bea9&uniqueId=${uniqueId}`, 
                    activeUser.data,
                    { withCredentials: true },
                    { headers: {'Content-Type': 'application/json'}}
                    )
                    console.log('UPDATED USER')
                    console.log(updatedUser.data)
                } catch (error) {
                    console.log(error)
                }
            }
            updateUserAssociatedWords();
        };
    }, [activeUser])

    return (
        <div className='search-page-container'>
            <Sidebar className='sidebar'></Sidebar>
            <div className='search-and-results-container'>
                <div className='language-flags-container'>
                    <img className='language-flags' src={unitedKingdom} alt='united-kingdom' onClick={e => props.setLanguage('en')}/>
                    <img className='language-flags' src={russia} alt='russia' onClick={e => props.setLanguage('ru')}/>
                    <img className='language-flags' src={portugal} alt='portugal' onClick={e => props.setLanguage('pt')}/>
                    <img className='language-flags' src={italy} alt='italy' onClick={e => props.setLanguage('it')}/>
                    <img className='language-flags' src={germany} alt='germany' onClick={e => props.setLanguage('de')}/>
                    <img className='language-flags' src={spain} alt='spain' onClick={e => props.setLanguage('es')}/>
                    <img className='language-flags' src={france} alt='france' onClick={e => props.setLanguage('fr')}/>
                    
                </div>
                <div className='search-container'>
                    <h2>{searchHeader}</h2>
                    <div className='search-input-and-button'>
                        <input ref={inputRef} type='text' className='search-input-text' 
                        onChange={e => setSearchWord(e.target.value)}>
                        </input>
                        <button ref={searchButton} className='find-synonyms-button' 
                        onClick={setAssociations}>Find Associations
                        </button>
                    </div>
                </div>
                <div className='association-container'>
                {associationArray.map((word) => {
                    return<div data-index={word.meaning} className='association-box' onClick={e => createNewSearchFromResult(e.target.dataset.index)}>
                        <p data-index={word.meaning}>{word.meaning}</p>
                        <BiMessageSquareAdd
                            className='add-word-icon'
                            data-index={word.meaning}
                            onClick={e => addWordToActiveUserVocab(e.target.dataset.index)}
                        />
                        <p data-index={word.meaning}>{word.partOfSpeech}</p>
                        <p data-index={word.meaning}>{word.weight}</p>
                        
                    </div>
                })}
                </div>
            </div>
        </div>
    );
}
