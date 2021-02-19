import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Registration from './Registration';
import Login from './Login';
import Landing from './Landing';
import Search from './Search';
import Profile from './Profile';
import Vocab from './Vocab';
import Set from './Set';
import VocabInfo from './VocabInfo';
import QuizSelect from './QuizSelect';
import Quiz from './Quiz';
import APIEndpoints from '../api';
import '../html.scss'

export default function Routes() {
    const [signedIn, setSignedIn] = useState(JSON.parse(localStorage.getItem('signedIn')) || false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');
    const [language, setLanguage] = useState('en')

    const updateSignedIn  = (username) => {
        if (signedIn === false) {
          setSignedIn(true, localStorage.setItem('signedIn', JSON.stringify(true)));
          setUser(username, localStorage.setItem('user', JSON.stringify(username)));
        } else {
          localStorage.clear();
          axios.post(APIEndpoints.logoutEndpoint, { withCredentials: true });
        }
    };
    
    async function updateUser (uniqueId, activeUser) {
      try {
          const updatedUser = await axios.put(`https://app.yawe.dev/api/1/ce/non-auth-endpoint?key=b0188b53ea77419ba1d6dcda06e4bea9&uniqueId=${uniqueId}`, 
          activeUser.data,
          { withCredentials: true },
          { headers: {'Content-Type': 'application/json'}}
          )
          console.log(updatedUser)
      } catch (error) {
          console.log(error)
      }
    }

    return (
      <div className="App">
          <Header
          signedIn={signedIn}
          user={user}
          updateSignedIn={updateSignedIn}
          ></Header>
          <Switch>
            <Route exact path='/' render={props => <Landing {...props}
                  signedIn={signedIn}
                  language={language}
                  setLanguage={setLanguage}
              />}></Route>
            <Route exact path='/login' render={props => <Login {...props}
                  updateSignedIn={updateSignedIn}
              />}></Route>
            <Route exact path='/registration' component={Registration}></Route>
            <Route exact path='/:profile' render={props => <Profile {...props}
                  user={user}
                  updateUser={updateUser}
              />}></Route>
            <Route path='/:profile/search' render={props => <Search {...props}
                  language={language}
                  setLanguage={setLanguage}
                  user={user}
            />}></Route>
            <Route exact path='/:profile/vocab' render={props => <Vocab {...props}
                user={user}
                updateUser={updateUser}
            />}></Route>
            <Route exact path='/:profile/vocab/:set' render={props => <Set {...props}
                user={user}
                updateUser={updateUser}
            />}></Route>
            <Route exact path='/:profile/quizselect' render={props => <QuizSelect {...props}
                user={user}
            />}></Route>
            <Route exact path='/:profile/vocab/:set/quiz' render={props => <Quiz {...props}
                user={user}
                updateUser={updateUser}
            />}></Route>
            <Route exact path='/:profile/vocab/:set/:vocabItem' render={props => <VocabInfo {...props}
                user={user}
                updateUser={updateUser}
            />}></Route>
          </Switch>
        <Footer></Footer>
      </div>
    );
};
