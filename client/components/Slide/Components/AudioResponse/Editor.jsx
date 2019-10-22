import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Label } from 'semantic-ui-react';
import { type } from './type';
import './AudioResponse.css';

class AudioResponseEditor extends Component {
    constructor(props) {
        super(props);
        const {
            prompt = 'Audio Recording Prompt'
        } = props.value;
        this.state = {
            prompt
        }
    }

    render() {
        const { prompt } = this.state;

        return (
            <React.Fragment>
                <Form>
                    <Label>{prompt}</Label>
                </Form>
            </React.Fragment>
        );
    }
}

export default AudioResponseEditor;