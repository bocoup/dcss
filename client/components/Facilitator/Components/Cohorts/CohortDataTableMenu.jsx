import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import { getCohort } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import './Cohort.css';

export class CohortDataTableMenu extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(event, { name }) {
        const { cohortId, scenarioId } = this.props.source;

        this.props.onClick(event, {
            name,
            key: `cohort-${cohortId}-scenario-${scenarioId}`
        });
    }

    render() {
        const { onClick } = this;

        return (
            <Menu icon>
                <Popup
                    content="Close this data table tab"
                    trigger={
                        <Menu.Item name="close" onClick={onClick}>
                            <Icon name="close" />
                        </Menu.Item>
                    }
                />
                <Popup
                    content="Download the data from this data table tab"
                    trigger={
                        <Menu.Item name="download" onClick={onClick}>
                            <Icon name="download" />
                        </Menu.Item>
                    }
                />
            </Menu>
        );
    }
}

CohortDataTableMenu.propTypes = {
    source: PropTypes.object,
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
    onClick: PropTypes.func,
    getCohort: PropTypes.func,
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
    getScenarios: () => dispatch(getScenarios())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortDataTableMenu)
);
