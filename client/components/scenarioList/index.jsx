import React, { Component } from 'react';
import { List } from 'semantic-ui-react';

const ScenarioEntries = ({ scenarioData }) => {
    if (!scenarioData.length) {
        return null;
    }

    return scenarioData.map(({ title, description }) => {
        return (
            <List.Item>
                <List.Header as="h3">{title}</List.Header>
                <List.Content>{description}</List.Content>
            </List.Item>
        );
    });
};

class ScenarioList extends Component {
    constructor(props) {
        super(props);
        console.log('props', props);
        this.state = {
            scenarioData: props.scenarioData || []
        };
    }

    getScenarios() {}

    render() {
        return (
            <div>
                <h2>Practice spaces for teacher preparation programs</h2>
                <List relaxed>
                    <ScenarioEntries scenarioData={this.state.scenarioData} />
                </List>
            </div>
        );
    }
}

export default ScenarioList;
