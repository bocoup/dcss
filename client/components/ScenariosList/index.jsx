import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Card, Container, Grid, Icon, Input, Menu } from 'semantic-ui-react';
import _ from 'lodash';
import changeCase from 'change-case';
// import nextKey from '@utils/key';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import ScenarioEntries from './ScenarioEntries';
import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

class ScenariosList extends Component {
  constructor(props) {
    super(props);

    const { category } = this.props;

    this.state = {
      category,
      isReady: false,
      heading: '',
      scenarios: [],
      viewHeading: '',
      viewScenarios: []
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.reduceScenarios = this.reduceScenarios.bind(this);
    this.moveDeletedScenarios = this.moveDeletedScenarios.bind(this);
  }

  async componentDidMount() {
    await this.getScenarios();
    await this.reduceScenarios();
    this.setState({
      isReady: true
    });
  }

  moveDeletedScenarios(scenarios = []) {
    return [
      ...scenarios.filter(({ deleted_at }) => !deleted_at),
      ...scenarios.filter(({ deleted_at }) => deleted_at)
    ];
  }

  async getScenarios() {
    await this.props.getScenarios();
  }

  async reduceScenarios() {
    const { category } = this.state;
    let scenarios = [];
    let heading = '';
    let authorUsername = '';

    switch (category) {
      case 'all':
        scenarios.push(...this.props.scenarios);
        heading = 'All Scenarios';
        break;
      case 'author':
        authorUsername = this.props.match.params.username;
        heading = `Scenarios by ${authorUsername}`;
        scenarios.push(
          ...this.props.scenarios.filter(({ author: { username } }) => {
            return username === authorUsername;
          })
        );

        if (scenarios.length === 0) {
          heading = `There are no scenarios by ${authorUsername}`;
        }

        break;
      case 'official':
      case 'community':
        scenarios = this.props.scenarios.filter(({ categories }) => {
          return !category || categories.includes(category);
        });
        heading = `${changeCase.titleCase(category)} Scenarios`;
        break;
    }

    scenarios = this.moveDeletedScenarios(scenarios);

    this.setState({
      heading,
      scenarios,
      viewScenarios: scenarios.slice(0),
      viewHeading: heading
    });
  }

  onSearchChange(event, props) {
    const { scenarios, viewHeading, viewScenarios } = this.state;
    const { value } = props;
    let replacementHeading = '';

    if (value === '') {
      this.setState({
        scenarios: viewScenarios,
        heading: viewHeading
      });

      return;
    }

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
    const results = scenarios.filter(record => {
      const {
        author: { username },
        categories,
        description,
        title
      } = record;
      if (escapedRegExp.test(title)) {
        return true;
      }

      if (escapedRegExp.test(description)) {
        return true;
      }

      if (escapedRegExp.test(username)) {
        return true;
      }

      if (categories.some(category => escapedRegExp.test(category))) {
        return true;
      }

      return false;
    });

    replacementHeading = `${viewHeading}, matching '${value}'`;

    if (results.length === 0) {
      results.push(...viewScenarios);
      replacementHeading = `${viewHeading}, nothing matches '${value}'`;
    }

    this.setState({
      heading: replacementHeading,
      scenarios: results
    });
  }

  render() {
    const { isReady, heading, scenarios } = this.state;
    const { onSearchChange } = this;

    return (
      <React.Fragment>
        <EditorMenu
          type="scenarios"
          items={{
            left: [
              <ConfirmAuth
                key="menu-item-scenario-create"
                requiredPermission="create_scenario"
              >
                <Menu.Item
                  name="Create a scenario"
                  as={NavLink}
                  exact
                  to="/editor/new"
                  className="scenarios__menu-item--padding"
                >
                  <Icon.Group className="em__icon-group-margin">
                    <Icon name="newspaper outline" />
                    <Icon corner="top right" name="add" color="green" />
                  </Icon.Group>
                  Create a Scenario
                </Menu.Item>
              </ConfirmAuth>
            ],
            right: [
              <Menu.Menu
                key="menu-item-scenario-search"
                name="Search scenarios"
                position="right"
              >
                <Menu.Item
                  name="Search scenarios"
                  className="scenarios__menu-item--padding"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onSearchChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            ]
          }}
        />
        <Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column stretched>
                {heading && <h3>{heading}</h3>}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column stretched>
                {isReady ? (
                  <Card.Group itemsPerRow={4} stackable>
                    <ScenarioEntries
                      scenarios={scenarios}
                      isLoggedIn={this.props.isLoggedIn}
                    />
                  </Card.Group>
                ) : (
                  <Loading size="medium" />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

ScenariosList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  category: PropTypes.string,
  getScenarios: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  scenarios: PropTypes.array,
  username: PropTypes.string
};

const mapStateToProps = state => {
  const {
    login: { isLoggedIn, username },
    scenarios
  } = state;
  return { isLoggedIn, username, scenarios };
};

const mapDispatchToProps = {
  getScenarios
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenariosList)
);
