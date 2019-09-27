import React from 'react';
import { Container, Form, Input, Label, TextArea } from 'semantic-ui-react';

import './ScenarioEditor.css';


export const ScenarioEditor = () => (
    <Container fluid className="tm__scenario-editor">
        <h2>Teacher Moment Details</h2>
        <Form size={'big'}>
            <Form.Input fluid focus required label="Title"/>
            <Form.TextArea focus label="Moment Description"/>
        </Form>
    </Container>
);
