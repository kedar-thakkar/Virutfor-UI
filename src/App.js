// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import './css/magnific-popup.css'
import './css/style.css'
import './css/media.css'
// import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import JoiMeeting from './components/Meeting/JoinMeeting';
import GuestRegisrationForm from './components/Meeting/guestRegisrationForm';
import TermsAndConditions from './components/Meeting/termsAndConditions';
import MeetingRoom from './components/Meeting/meetingRoom';
import TablesMeetingRoom from './components/Meeting/tablesMeetingRoom';
import SocketCode from './components/socketCode';
import Prelaunch from './components/Meeting/preluanch';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={JoiMeeting} />
          <Route path='/meeting/guest-resigration-form' component={GuestRegisrationForm} />
          <Route path='/meeting/terms-and-conditions' component={TermsAndConditions} />
          <Route path='/meeting/meetingroom' component={MeetingRoom} />
          <Route path='/meeting/meeting-room-popup' component={MeetingRoom} />
          <Route path='/meeting/tables-meeting-room' component={TablesMeetingRoom} />
          <Route path='/socket-code' component={SocketCode} />
          <Route path='/preluanch' component={Prelaunch}/>
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
