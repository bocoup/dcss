import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Dropdown, Form, Grid } from 'semantic-ui-react';
import { setScenario } from '@client/actions';

import './scenarioEditor.css';

class ScenarioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            categories: [],
            topics: [],
            scenarioCategories: []
        };

        this.getScenarioData = this.getScenarioData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeCategories = this.onChangeCategories.bind(this);

        if (this.props.scenarioId === 'new') {
            this.props.setScenario({
                title: '',
                description: '',
                categories: []
            });
        } else {
            this.getScenarioData();
        }
    }

    async componentDidMount() {
        const allCategories = await (await fetch(
            '/api/tags/categories'
        )).json();
        this.setState({ categories: allCategories });
    }

    async getScenarioData() {
        const scenarioResponse = await (await fetch(
            `/api/scenarios/${this.props.scenarioId}`
        )).json();

        if (scenarioResponse.status === 200) {
            this.props.setScenario({
                title: scenarioResponse.scenario.title,
                description: scenarioResponse.scenario.description,
                // TODO: These need to be added to the scenario data
                // coming from the API as:
                //
                // scenarioResponse.scenario.categories
                // scenarioResponse.scenario.topics
                //
                // ...where the values are just arrays of
                // tag (category or topic) ids
                //
                // The list [2] is for mockup purposes.
                categories: scenarioResponse.scenario.categories,
                topics: scenarioResponse.scenario.topics || []
            });
        }
    }

    onChange(event) {
        this.props.updateEditorMessage('');
        this.props.setScenario({ [event.target.name]: event.target.value });
    }

    onChangeCategories(event, { value }) {
        this.setState({ scenarioCategories: value });
    }

    async onSubmit() {
        if (!this.props.title || !this.props.description) {
            this.props.updateEditorMessage(
                'A title and description are required for Teacher Moments'
            );
            return;
        }
        this.setState({ saving: true });
        const data = {
            title: this.props.title,
            description: this.props.description,
            categories: this.state.scenarioCategories,
            topics: this.props.topics
        };

        const saveResponse = await (await this.props.submitCB(data)).json();

        switch (saveResponse.status) {
            case 200:
                this.setState({ saving: false });
                this.props.updateEditorMessage('Teacher Moment saved');
                break;
            case 201:
                this.setState({ saving: false });
                this.props.updateEditorMessage('Teacher Moment created');
                break;
            default:
                if (saveResponse.error) {
                    this.setState({ saving: false });
                    this.props.updateEditorMessage(saveResponse.message);
                }
                break;
        }

        if (this.props.postSubmitCB) {
            this.props.postSubmitCB(saveResponse.scenario);
        }
    }

    render() {
        return (
            <Form size={'big'}>
                <Container fluid className="tm__editor-tab">
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Input
                                    focus
                                    required
                                    label="Title"
                                    name="title"
                                    value={this.props.title}
                                    onChange={this.onChange}
                                />
                                <Form.TextArea
                                    focus="true"
                                    required
                                    label="Description"
                                    name="description"
                                    value={this.props.description}
                                    onChange={this.onChange}
                                />

                                {this.state.saving ? (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        loading
                                    />
                                ) : (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        onClick={this.onSubmit}
                                    >
                                        Save
                                    </Form.Button>
                                )}
                            </Grid.Column>
                            <Grid.Column width={3}>
                                {this.state.categories.length && (
                                    <Form.Field>
                                        <label>Categories</label>
                                        <Dropdown
                                            label="Categories"
                                            name="categories"
                                            placeholder="Select..."
                                            fluid
                                            multiple
                                            selection
                                            options={this.state.categories.map(
                                                category => ({
                                                    key: category.id,
                                                    text: category.name,
                                                    value: category.name
                                                })
                                            )}
                                            defaultValue={this.props.categories}
                                            onChange={this.onChangeCategories}
                                        />
                                    </Form.Field>
                                )}
                                {/*
                                    TODO: create the same Dropdown style thing
                                            for displaying and selecting
                                            available topics (if any exist)

                                */}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    // TODO: Presently "categories" and "topics" are missing.
    const { title, description, categories, topics } = state.scenario;
    return { title, description, categories, topics };
}

const mapDispatchToProps = {
    setScenario
};

ScenarioEditor.propTypes = {
    scenarioId: PropTypes.node.isRequired,
    setScenario: PropTypes.func.isRequired,
    submitCB: PropTypes.func.isRequired,
    postSubmitCB: PropTypes.func,
    updateEditorMessage: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    topics: PropTypes.array
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioEditor);
