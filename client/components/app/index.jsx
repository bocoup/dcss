import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

class App extends Component {
    render() {
        return (
            <Container className="tm__app">
                <h1>Teacher Moments</h1>
            </Container>
        );
    }
}

export default hot(module)(App);
