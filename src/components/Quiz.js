import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';
import APIEndpoints from '../api';
import Sidebar from './Sidebar';
import '../styles/Quiz.scss';

export default function Quiz(props) {
    const [activeUser, setActiveUser] = useState('');
    const [answers, setAnswers] = useState([]);
    const [word, setWord] = useState('');
    const [number, setNumber] = useState(0);
    const firstTimeRender = useRef(true);
    const { profile, set } = useParams();

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
        setWord(currentActiveUser.data.vocab[set][0].word)
        setActiveUser(currentActiveUser)
    };

    useEffect(() => {
        if (!firstTimeRender.current) {
            generateRandomAnswers()
          }
    },[activeUser])

    const generateRandomAnswers = () => {
        let array = activeUser.data.vocab[set]
        let correctAnswer = activeUser.data.vocab[set][number].explanation
        let newAnswers = [correctAnswer];
        for(let i = 0; i <= 2;){
            let number = Math.floor(Math.random() * Math.floor(array.length))
            if(!newAnswers.includes(array[number].explanation)) {
                newAnswers.push(array[number].explanation)
                i++
            }
        }
        // Durstenfeld Shuffle
        for (let i = newAnswers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = newAnswers[i];
            newAnswers[i] = newAnswers[j];
            newAnswers[j] = temp;
        }
        setAnswers(newAnswers)
    }

    const nextWord = () => {
        let newNumber = 0;
        do {
            newNumber = Math.floor(Math.random() * Math.floor(activeUser.data.vocab[set].length))
        } while(newNumber === number);
        setNumber(newNumber);
    };

    useEffect(() => {
        if (!firstTimeRender.current) {
            setWord(activeUser.data.vocab[set][number].word)
            generateRandomAnswers()
        }
    },[number])

    const selectAnswer = (e) => {
        if(e.target.dataset.index === activeUser.data.vocab[set][number].explanation) {
            e.target.className = 'option-div-correct' 
            setTimeout(function() {
                e.target.className = 'option-div' 
                nextWord()
            }, 1000)
        } else {
            e.target.className = 'option-div-incorrect'
            setTimeout(function() {
                e.target.className = 'option-div'
            }, 350);
        }
    };

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
        <div className='quiz-page-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='quiz-main-container'>
                    <h1 className='quiz-main-title'>Quiz Yourself on the Words from the {set} Set</h1>
                    <div className='quiz-container'>
                        <div className='quiz-word'>
                            {word}
                        </div>
                        <div className='quiz-answers'>
                            {answers.map((answer) => (
                                <div className='option-div'
                                key={uniqid}
                                data-index={answer}
                                onClick={e => selectAnswer(e)}
                                >{answer}</div>
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    )
    }
}