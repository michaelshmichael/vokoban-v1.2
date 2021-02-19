import React from 'react';
import { SocialIcon } from 'react-social-icons';
import '../styles/Footer.scss';

export default function Footer () {
    return(
        <div className="footer">
            <div className="footer-data">
                <div className='footer-details'>
                    <p>learnwithvokoban@gmail.com</p>
                </div>
                <div className='footer-socials'> 
                    <SocialIcon className='socials' url="https://twitter.com" />
                    <SocialIcon className='socials' url="https://www.instagram.com/learnwithvokoban/" />
                    <SocialIcon className='socials' url="https://www.facebook.com" /> 
                </div>
            </div>
        </div>
    )
}