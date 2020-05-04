import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

import Session from '@client/util/session';

Session.timeout();

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Navigation />
                <Routes />
                <Notification />
            </Router>
        );
    }
}

export default App;
