import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import APIEndpoints from '../api';
import selection from '../svg/selection.svg';
import Sidebar from './Sidebar';
import '../styles/QuizSelect.scss';

export default function QuizSelect (props) {
    const [vocabSetsArray, setVocabSetsArray] = useState([]);
    const history = useHistory();
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

    const getActiveUser = (allUsers) => {
        const currentActiveUser = allUsers.data.find(element => element.data.username === props.user);
        let vocabSetsArray = Object.keys(currentActiveUser.data.vocab)
        setVocabSetsArray(vocabSetsArray)
    };

    const redirectToSetQuiz = (e) => {
        let set = e.target.dataset.index;
        history.push(`/${profile}/vocab/${set}/quiz`)
    }

    return(
        <div className='quiz-select-page-container'>
            <Sidebar className='sidebar'/>
            <div className='quiz-select-container'>
                <div className='possible-sets-container'>
                    <h1>Choose Your Set</h1>
                    <div className='sets'>
                    {vocabSetsArray.map((set) => (
                        <div className='individual-set-box'
                        data-index={set}
                        onClick={e => redirectToSetQuiz(e)}>{set}</div>
                    ))}
                    </div>
                </div>
                <img src={selection} alt='person selecting an option'></img>
            </div>
        </div>
    )
}