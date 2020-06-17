import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Container,
  Icon,
  Input,
  Menu,
  Popup,
  Table
} from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import _ from 'lodash';
import * as moment from 'moment';

import EditorMenu from '@components/EditorMenu';
import Sortable from '@components/Sortable';
import ClickableTableCell from '@components/ClickableTableCell';
import ConfirmAuth from '@components/ConfirmAuth';
import Loading from '@components/Loading';
import scrollIntoView from '@components/util/scrollIntoView';
import { getCohort, setCohort } from '@actions/cohort';
import { getScenarios, setScenarios } from '@actions/scenario';
import { getUserRuns } from '@actions/run';

import './Cohort.css';

export class CohortScenarios extends React.Component {
  constructor(props) {
    super(props);

    let {
      params: { id }
    } = this.props.match;

    if (!id && this.props.id) {
      id = this.props.id;
    }

    this.state = {
      isReady: false,
      cohort: {
        id
      }
    };
    // This is used as a back up copy of
    // scenarios when the list is filtered
    // by searching.
    this.scenarios = [];
    this.tableBody = React.createRef();
    this.onScenarioOrderChange = this.onScenarioOrderChange.bind(this);
    this.onScenarioCheckboxClick = this.onScenarioCheckboxClick.bind(this);
    this.onScenarioSearchChange = this.onScenarioSearchChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  async componentDidMount() {
    const {
      cohort: { id }
    } = this.state;

    const { getCohort, getScenarios, getUserRuns } = this.props;

    await getCohort(Number(id));
    await getScenarios();
    await getUserRuns();

    // See note above, re: scenarios list backup
    this.scenarios = this.props.scenarios.slice();
    this.setState({
      isReady: true
    });
  }

  async componentWillUnmount() {
    // Restore from the backup of all available scenarios
    await this.props.setScenarios(this.scenarios);
  }

  scrollIntoView() {
    scrollIntoView(this.tableBody.current.node.firstElementChild);
  }

  onScenarioCheckboxClick(event, { checked, value }) {
    const { cohort } = this.props;
    if (checked) {
      cohort.scenarios.push(value);
      // Move to the top of the list!
      this.scrollIntoView();
    } else {
      cohort.scenarios.splice(cohort.scenarios.indexOf(value), 1);
    }

    // Force deduping
    const scenarios = [...new Set(cohort.scenarios)];

    this.props.setCohort({
      ...cohort,
      scenarios
    });
  }

  async moveScenario(fromIndex, toIndex) {
    const { cohort } = this.props;
    const scenarios = cohort.scenarios.slice();
    const moving = scenarios[fromIndex];
    scenarios.splice(fromIndex, 1);
    scenarios.splice(toIndex, 0, moving);
    this.props.setCohort({
      ...cohort,
      scenarios
    });
  }

  onScenarioOrderChange(fromIndex, toIndex) {
    this.moveScenario(fromIndex, toIndex);
  }

  onScenarioSearchChange(event, { value }) {
    const { scenarios } = this;

    this.props.setScenarios([]);

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');

    const filtered = scenarios.filter(scenario => {
      if (escapedRegExp.test(scenario.title)) {
        return true;
      }

      if (escapedRegExp.test(scenario.description)) {
        return true;
      }
      return false;
    });

    this.props.setScenarios(filtered);
  }

  render() {
    const {
      onScenarioOrderChange,
      onScenarioCheckboxClick,
      onScenarioSearchChange
    } = this;
    const {
      cohort,
      isOwner,
      isParticipant,
      onClick,
      runs,
      scenarios = []
    } = this.props;
    const { isReady } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    // This is the list of scenarios that are IN the
    // cohort. The order MUST be preserved.
    const cohortScenarios = cohort.scenarios.map(id =>
      scenarios.find(scenario => scenario.id === id)
    );

    // This is the list of scenarios that are available,
    // but NOT in the cohort. The order is by id, descending
    const reducedScenarios = scenarios.reduce((accum, scenario) => {
      if (!cohort.scenarios.includes(scenario.id)) {
        accum.push(scenario);
      }
      return accum;
    }, []);

    // This is the merged, order corrected list of scenarios.
    const orderCorrectedScenarios = [...cohortScenarios, ...reducedScenarios];

    return (
      <Container fluid className="cohort__table-container">
        <EditorMenu
          type="cohort scenarios"
          items={{
            left: [
              <Menu.Item
                key="menu-item-cohort-scenarios"
                className="em__icon-padding"
                name="Scenarios in this Cohort"
                onClick={this.scrollIntoView}
              >
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="newspaper outline" />
                </Icon.Group>
                Cohort Scenarios ({cohortScenarios.length})
              </Menu.Item>
            ],
            right: [
              <Menu.Menu
                key="menu-menu-search-cohort-scenarios"
                position="right"
              >
                <Menu.Item
                  key="menu-item-search-cohort-scenarios"
                  name="Search cohort scenarios"
                  className="em__icon-padding"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onScenarioSearchChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            ]
          }}
        />
        <Table
          fixed
          striped
          selectable
          role="grid"
          aria-labelledby="header"
          className="cohort__table--constraints"
          unstackable
        >
          <Table.Header className="cohort__table-thead-tbody-tr">
            <Table.Row>
              <ConfirmAuth
                isAuthorized={isOwner}
                requiredPermission="edit_scenarios_in_cohort"
              >
                <Table.HeaderCell className="cohort__table-cell-first">
                  <Icon.Group className="em__icon-group-margin">
                    <Icon name="newspaper outline" />
                    <Icon corner="top right" name="add" color="green" />
                  </Icon.Group>
                </Table.HeaderCell>
                <Table.HeaderCell className="cohort__table-cell-options">
                  Options
                </Table.HeaderCell>
              </ConfirmAuth>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell className="cohort__table-cell-content">
                {isOwner ? 'Author' : 'Started'}
              </Table.HeaderCell>
              <Table.HeaderCell className="cohort__table-cell-content">
                {isOwner ? 'Description' : 'Completed'}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {scenarios.length ? (
            <Sortable
              isAuthorized={isOwner}
              tag="tbody"
              className="cohort__scrolling-tbody"
              onChange={onScenarioOrderChange}
              tableRef={this.tableBody}
              options={{
                direction: 'vertical',
                swapThreshold: 0.5,
                animation: 150
              }}
            >
              {orderCorrectedScenarios.map((scenario, index) => {
                if (!scenario) {
                  return null;
                }
                const checked = cohort.scenarios.includes(scenario.id);
                const disabled = true;
                const props = !checked ? { disabled } : {};

                // TODO: check localstorage for more appropriate slide number to begin at
                const pathname = `/cohort/${cohort.id}/run/${scenario.id}/slide/0`;
                const url = `${location.origin}${pathname}`;

                const requiredPermission = checked
                  ? 'view_scenarios_in_cohort'
                  : 'edit_scenarios_in_cohort';

                const onClickAddTab = (event, data) => {
                  onClick(event, {
                    ...data,
                    type: 'scenario',
                    source: scenario
                  });
                };

                const run =
                  runs.find(run => run.scenario_id === scenario.id) || {};

                const { run_created_at = null, run_ended_at = null } = run;

                const createdStatus = run_created_at
                  ? { warning: true }
                  : { negative: true };

                const completeOrIncomplete = isParticipant
                  ? run_ended_at
                    ? { positive: true }
                    : createdStatus
                  : {};

                const createdAt = run_created_at
                  ? moment(run_created_at).fromNow()
                  : '';

                const createdAtAlt = run_created_at
                  ? moment(run_created_at).calendar()
                  : '';

                const endedAt = run_ended_at
                  ? moment(run_ended_at).fromNow()
                  : '';

                const endedAtAlt = run_ended_at
                  ? moment(run_ended_at).calendar()
                  : 'This scenario is not complete';

                const startedAtDisplay = run_created_at
                  ? `${createdAt} (${createdAtAlt})`.trim()
                  : 'This scenario has not been started';

                const endedAtCreatedAtAlt = run_created_at ? endedAtAlt : '';
                const endedAtDisplay = run_ended_at
                  ? `${endedAt} (${endedAtAlt})`.trim()
                  : endedAtCreatedAtAlt;

                return (
                  <ConfirmAuth
                    key={`confirm-${index}`}
                    requiredPermission={requiredPermission}
                  >
                    <Table.Row
                      key={`row-${index}`}
                      className="cohort__table-thead-tbody-tr"
                      style={{ cursor: 'pointer' }}
                      {...completeOrIncomplete}
                    >
                      <ConfirmAuth
                        isAuthorized={isOwner}
                        requiredPermission="edit_own_cohorts"
                      >
                        <Table.Cell
                          key={`cell-checkbox-${index}`}
                          className="cohort__table-cell-first"
                        >
                          <Checkbox
                            key={`checkbox-${index}`}
                            value={scenario.id}
                            checked={checked}
                            onClick={onScenarioCheckboxClick}
                          />
                        </Table.Cell>
                      </ConfirmAuth>
                      <ConfirmAuth
                        isAuthorized={isOwner}
                        requiredPermission="edit_scenarios_in_cohort"
                      >
                        <Table.Cell className="cohort__table-cell-options">
                          {checked ? (
                            <Button.Group
                              hidden
                              basic
                              size="small"
                              className="cohort__button-group--transparent"
                            >
                              <Popup
                                content="Copy cohort scenario link to clipboard"
                                trigger={
                                  <Button
                                    icon
                                    content={<Icon name="clipboard outline" />}
                                    onClick={() => copy(url)}
                                    {...props}
                                  />
                                }
                              />
                              <Popup
                                content="Run this cohort scenario as a participant"
                                trigger={
                                  <Button
                                    icon
                                    content={<Icon name="play" />}
                                    onClick={() => {
                                      location.href = url;
                                    }}
                                    {...props}
                                  />
                                }
                              />

                              <ConfirmAuth
                                isAuthorized={isOwner}
                                requiredPermission="view_all_data"
                              >
                                <Popup
                                  content="View cohort reponses to prompts in this scenario"
                                  trigger={
                                    <Button
                                      icon
                                      content={
                                        <Icon name="file alternate outline" />
                                      }
                                      name={scenario.title}
                                      onClick={onClickAddTab}
                                      {...props}
                                    />
                                  }
                                />
                              </ConfirmAuth>
                              <Popup
                                content="Move scenario up"
                                trigger={
                                  <Button
                                    icon="caret up"
                                    aria-label="Move scenario up"
                                    disabled={index === 0}
                                    onClick={() => {
                                      onScenarioOrderChange(index, index - 1);
                                    }}
                                  />
                                }
                              />
                              <Popup
                                content="Move scenario down"
                                trigger={
                                  <Button
                                    icon="caret down"
                                    aria-label="Move scenario down"
                                    disabled={
                                      index === cohortScenarios.length - 1
                                    }
                                    onClick={() => {
                                      onScenarioOrderChange(index, index + 1);
                                    }}
                                  />
                                }
                              />
                            </Button.Group>
                          ) : null}
                        </Table.Cell>
                      </ConfirmAuth>
                      <ClickableTableCell
                        href={pathname}
                        display={scenario.title}
                      />
                      <Table.Cell className="cohort__table-cell-content">
                        {isOwner ? scenario.author.username : startedAtDisplay}
                      </Table.Cell>
                      <Table.Cell className="cohort__table-cell-content">
                        {isOwner ? scenario.description : endedAtDisplay}
                      </Table.Cell>
                    </Table.Row>
                  </ConfirmAuth>
                );
              })}
            </Sortable>
          ) : (
            <Table.Body className="cohort__scrolling-tbody">
              <Table.Row
                key={`row-empty-results`}
                className="cohort__table-thead-tbody-tr"
              >
                <Table.Cell>No scenarios match your search</Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table>
      </Container>
    );
  }
}

CohortScenarios.propTypes = {
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isOwner: PropTypes.bool,
  isParticipant: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  id: PropTypes.any,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onClick: PropTypes.func,
  getScenarios: PropTypes.func,
  setScenarios: PropTypes.func,
  scenarios: PropTypes.array,
  getUserRuns: PropTypes.func,
  runs: PropTypes.array,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { cohort, cohorts, user } = state;
  const scenarios = state.scenarios.filter(
    scenario => scenario.deleted_at === null
  );
  const runs = state.runs.filter(run => run.cohort_id === ownProps.id);
  return { cohort, cohorts, scenarios, runs, user };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  setCohort: params => dispatch(setCohort(params)),
  getScenarios: () => dispatch(getScenarios()),
  setScenarios: scenarios => dispatch(setScenarios(scenarios)),
  getUserRuns: () => dispatch(getUserRuns())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortScenarios)
);