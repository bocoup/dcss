import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import './AudioResponse.css';

const Display = ({ prompt }) => (
    <Container text>
        <h1>Audio Response </h1>
        <p>{prompt}</p>
    </Container>
);

Display.propTypes = {
    //
};

export default React.memo(Display);