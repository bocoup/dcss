import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { selectIndexRequest, selectCohortIds } from '@client/reducers/cohort';
import { cohortRequestList, cohortCreate } from '@client/actions/cohort';

export class CohortIndex extends React.Component {
    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    async onCreate() {
        // TODO: Catch error?
        //eslint-disable-next-line
        const { id } = await this.props.cohortCreate({
            name: `New Cohort ${new Date()}`
        });
        // TODO: redirect to /cohorts/:id ?
    }

    componentDidMount() {
        if (this.props.requestIndex) {
            this.props.requestIndex();
        }
    }

    render() {
        const { status, ids, error } = this.props;
        return (
            <div>
                Debug View:
                <pre>{JSON.stringify({ status, ids, error }, null, 2)}</pre>
                <button onClick={this.onCreate}>Create</button>
            </div>
        );
    }
}

CohortIndex.propTypes = {
    status: PropTypes.oneOf(['success', 'error', 'requesting', 'init']),
    ids: PropTypes.arrayOf(PropTypes.number),
    error: PropTypes.shape({
        message: PropTypes.string,
        stack: PropTypes.string,
        status: PropTypes.oneOf([PropTypes.string, PropTypes.number])
    }),
    requestIndex: PropTypes.func,
    cohortCreate: PropTypes.func
};

const mapStateToProps = state => ({
    status: selectIndexRequest(state).status,
    ids: selectCohortIds(state),
    error: selectIndexRequest(state).error
});

const mapDispatchToProps = dispatch => ({
    requestIndex: () => dispatch(cohortRequestList()),
    cohortCreate: params => dispatch(cohortCreate(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CohortIndex);
