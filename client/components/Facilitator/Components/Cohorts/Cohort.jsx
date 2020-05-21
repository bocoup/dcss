import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup, Segment } from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import storage from 'local-storage-fallback';
import {
  getCohort,
  setCohort,
  setCohortUserRole
} from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import CohortDataTable from './CohortDataTable';
import CohortParticipants from './CohortParticipants';
import CohortScenarios from './CohortScenarios';
import './Cohort.css';

export class Cohort extends React.Component {
  constructor(props) {
    super(props);

    const { location, match } = this.props;

    let {
      params: { id }
    } = match;

    if (!id && this.props.id) {
      id = this.props.id;
    }

    if (location && location.search) {
      storage.setItem(`referrer_params`, location.search);
    }

    this.persistenceKey = `cohort/${id}`;
    let persisted = JSON.parse(storage.getItem(this.persistenceKey));

    if (!persisted) {
      persisted = { activeTabKey: 'cohort', tabs: [] };
      storage.setItem(this.persistenceKey, JSON.stringify(persisted));
    }

    const { activeTabKey = 'cohort', tabs = [] } = persisted;

    this.state = {
      activeTabKey,
      cohort: {
        id
      },
      tabs
    };

    this.onClick = this.onClick.bind(this);
    this.onDataTableClick = this.onDataTableClick.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  async componentDidMount() {
    const {
      cohort: { id }
    } = this.state;

    await this.props.getCohort(Number(id));
    await this.props.getScenarios();

    const {
      cohort: { users },
      user: { username }
    } = this.props;

    if (!users.find(user => username === user.username)) {
      // For now we'll default all unknown
      // users as "participant".
      await this.props.setCohortUserRole({
        id: Number(id),
        role: 'participant'
      });
    }
  }

  onClick(event, { source, type }) {
    let { activeTabKey } = this.state;
    const {
      cohort,
      cohort: { id },
      tabs
    } = this.state;
    const isScenario = type === 'scenario';
    const icon = isScenario ? 'content' : 'user outline';
    const key = `cohort-${id}-${type}-${source.id}`;
    const tab = tabs.find(tab => tab.menuItem.key === key);
    const content = source[isScenario ? 'title' : 'username'];

    // const display = source[isScenario ? 'title' : 'username'];
    // const content = (
    //   <>
    //     {display}
    //     <Button
    //       circular
    //       icon="close"
    //       floated="right"
    //       size="mini"
    //       style={{ fontSize: '0.75em', marginLeft: '1rem' }}
    //     />
    //   </>
    // );

    if (!tab) {
      tabs.push({
        menuItem: {
          content,
          key,
          icon
        },
        data: {
          cohortId: cohort.id,
          [`${type}Id`]: source.id
        }
      });
      activeTabKey = key;
    } else {
      activeTabKey = tab.menuItem.key;
    }

    this.setState({
      activeTabKey,
      tabs
    });
  }

  onTabClick(event, { name: activeTabKey }) {
    this.setState({ activeTabKey });
  }

  onDataTableClick(event, { name, key }) {
    const { tabs } = this.state;

    // If the button name was "close"...
    if (name === 'close') {
      // Move to the main cohort tab
      this.setState({ activeTabKey: 'cohort' });

      // Remove the tab from the tabs list
      tabs.splice(tabs.indexOf(tabs.find(tab => tab.menuItem.key === key)), 1);
      this.setState({ tabs });
    }
  }

  render() {
    const {
      cohort,
      cohort: { id, name },
      user: { username, permissions }
    } = this.props;
    const { activeTabKey, tabs } = this.state;
    const { onClick, onTabClick, onDataTableClick } = this;
    const cohortUrl = `${location.origin}/cohort/${cohort.id}`;
    const source = tabs.find(tab => tab.menuItem.key === activeTabKey);
    const currentUserInCohort = cohort.users.find(cohortMember => {
      return cohortMember.username === username;
    });

    // Everytime there is a render, save the state.
    storage.setItem(this.persistenceKey, JSON.stringify(this.state));

    return (
      <div>
        <Menu attached="top" tabular className="cohort__tab-menu--overflow">
          <Menu.Item
            active={activeTabKey === 'cohort'}
            content={name}
            key="cohort"
            name="cohort"
            onClick={onTabClick}
          />

          {tabs.map(({ menuItem }) => {
            const { content, key, icon } = menuItem;
            return (
              <Menu.Item
                active={activeTabKey === key}
                content={content}
                key={key}
                name={key}
                icon={icon}
                onClick={onTabClick}
              />
            );
          })}
        </Menu>

        {activeTabKey === 'cohort' ? (
          <Segment attached="bottom">
            <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
              <Menu icon borderless>
                <Popup
                  content="Copy cohort link to clipboard"
                  trigger={
                    <Menu.Item
                      key="menu-item-account-administration"
                      className="editormenu__padding"
                      onClick={() => copy(cohortUrl)}
                    >
                      <Icon.Group className="editormenu__icon-group">
                        <Icon name="clipboard outline" />
                      </Icon.Group>
                      {cohortUrl}
                    </Menu.Item>
                  }
                />
                {/*
                  <Popup
                      content="Run this cohort as a participant"
                      trigger={
                          <Menu.Item
                              icon
                              content={<Icon name="play" />}
                              onClick={() => {
                                  alert(
                                      'View cohort as participant. (Feature not available in this version)'
                                  );
                              }}
                          />
                      }
                  />
                  <Popup
                      content="Download the data from this data table tab"
                      trigger={
                          <Menu.Item
                              icon
                              content={<Icon name="download" />}
                              onClick={() => {
                                  alert(
                                      'Download all data from this cohort. (Feature not available in this version)'
                                  );
                              }}
                          />
                      }
                  />
              */}
              </Menu>
            </ConfirmAuth>
            <CohortScenarios key="cohort-scenarios" id={id} onClick={onClick} />
            <ConfirmAuth requiredPermission="edit_all_cohorts">
              <CohortParticipants
                key="cohort-participants"
                id={id}
                onClick={onClick}
              />
            </ConfirmAuth>
            {currentUserInCohort && (
              <ConfirmAuth
                isAuthorized={!permissions.includes('edit_all_cohorts')}
              >
                <CohortDataTable
                  source={{
                    cohortId: id,
                    participantId: currentUserInCohort.id
                  }}
                  onClick={onDataTableClick}
                />
              </ConfirmAuth>
            )}
          </Segment>
        ) : (
          <Segment key={activeTabKey} attached="bottom">
            <CohortDataTable
              source={source && source.data}
              onClick={onDataTableClick}
            />
          </Segment>
        )}
      </div>
    );
  }
}

Cohort.propTypes = {
  activeTabKey: PropTypes.string,
  scenarios: PropTypes.array,
  runs: PropTypes.array,
  users: PropTypes.array,
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
  id: PropTypes.any,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onChange: PropTypes.func,
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  setCohortUserRole: PropTypes.func,
  getScenarios: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { username, permissions } = state.login;
  const { currentCohort: cohort } = state.cohort;
  const { scenarios } = state;
  return { cohort, scenarios, user: { username, permissions } };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getScenarios: () => dispatch(getScenarios()),
  setCohort: params => dispatch(setCohort(params)),
  setCohortUserRole: params => dispatch(setCohortUserRole(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohort)
);
