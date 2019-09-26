import React from 'react';
import { Container, Form, Input, Label, TextArea } from 'semantic-ui-react';


export const ScenarioEditor = () => (
    <Container>
        <h2>Teacher Moment Details</h2>
        <Form size={'big    '}>
            <Form.Input fluid focus required label="Title"/>
            <Form.TextArea focus label="Moment Description"/>
        </Form>
    </Container>
);
