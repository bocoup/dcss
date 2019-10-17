import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ScenarioEditor from '@components/ScenarioEditor';
import Slides from './Slides';

import './editor.css';

const EditorMessage = ({ message }) => {
    return <div>{message}</div>;
};

class Editor extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
        this.getPostSubmitCallback = this.getPostSubmitCallback.bind(this);
        this.getTab = this.getTab.bind(this);
        this.updateEditorMessage = this.updateEditorMessage.bind(this);
        this.state = {
            activeTab: 'moment',
            editorMessage: '',
            scenarioId: this.props.match.params.id,
            tabs: {
                moment: this.getTab('moment')
            }
        };

        if (this.props.match.params.id != 'new') {
            const tabsObj = {
                ...this.state.tabs,
                slides: this.getTab('slides')
            };
            this.state.tabs = tabsObj;
        }
    }

    onClick(e, { name }) {
        this.setState({ activeTab: name });
        this.updateEditorMessage('');
    }

    getTab(name) {
        switch (name) {
            case 'moment':
                return (
                    <ScenarioEditor
                        scenarioId={this.props.match.params.id}
                        submitCB={this.getSubmitCallback()}
                        postSubmitCB={this.getPostSubmitCallback()}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'slides':
                return (
                    <Slides
                        scenarioId={this.props.match.params.id}
                        className="active"
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            default:
                return null;
        }
    }

    getSubmitCallback() {
        let endpoint, method;
        const scenarioId = this.props.match.params.id;

        if (scenarioId === 'new') {
            endpoint = '/api/scenarios';
            method = 'PUT';
        } else {
            endpoint = `/api/scenarios/${scenarioId}`;
            method = 'POST';
        }

        return scenarioData => {
            return fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scenarioData)
            });
        };
    }

    getPostSubmitCallback() {
        if (this.props.match.params.id === 'new') {
            return scenarioData => {
                this.props.history.push(`/editor/${scenarioData.id}`);
                this.setState({
                    activeTab: 'slides',
                    scenarioId: scenarioData.id
                });

                if (!this.state.tabs.slides) {
                    const tabsObj = this.state.tabs;
                    tabsObj.slides = this.getTab('slides');
                    this.setState({ tabs: tabsObj });
                }
            };
        }

        return null;
    }

    updateEditorMessage(message) {
        this.setState({ editorMessage: message });
    }

    render() {
        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        name="moment"
                        active={this.state.activeTab === 'moment'}
                        onClick={this.onClick}
                    />
                    {this.state.scenarioId !== 'new' && (
                        <Menu.Item
                            name="slides"
                            active={this.state.activeTab === 'slides'}
                            onClick={this.onClick}
                        />
                    )}
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <EditorMessage message={this.state.editorMessage} />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <div>{this.state.tabs[this.state.activeTab]}</div>
            </div>
        );
    }
}

EditorMessage.propTypes = {
    message: PropTypes.string
};

Editor.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired
};

export default Editor;
