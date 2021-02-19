import React from 'react';
import learningSVG from '../svg/learning.svg';
import '../styles/Landing.scss';

export default function Landing(props) {
    if(props.signedIn === false){
    return (
        <div className='landing-container'>
            <div className='landing-blurb'>
                <h2>Your Language Learning Portal!</h2>
            </div>
            <img className='learning-svg' src={learningSVG} alt='person-learning'></img>
            <button className='ui-button' href='registration'>Register</button>
            
        </div>
    );
    } else {
        return (
        <div className='landing-container'>
            <div className='landing-blurb'>
                <h2>Your Language Learning Portal!</h2>
            </div>
            <img className='learning-svg' src={learningSVG} alt='person-learning'></img>
        </div>
        );
    };
}


