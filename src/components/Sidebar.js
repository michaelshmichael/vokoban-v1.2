import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Sidebar.scss';

export default function Sidebar() {
    const { profile } = useParams();

    return(
        <div className='sidebar'>
            <div className='link-container'>
                <a href={`/${profile}`}>Profile</a>
                <a href={`/${profile}/search`}>Search</a>
                <a href={`/${profile}/vocab`}>Vocab Learner</a>
                <a href={`/${profile}/quizselect`}>Quiz</a>
            </div>
        </div>
    )
}