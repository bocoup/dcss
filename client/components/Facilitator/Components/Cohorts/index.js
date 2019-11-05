import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { selectIndexRequest, selectCohortIds } from '@client/reducers/cohort';
import { cohortRequestList } from '@client/actions/cohort';

export class CohortIndex extends React.Component {
    componentDidMount() {
        if (this.props.requestIndex) {
            this.props.requestIndex();
        }
    }

    render() {
        const { status, ids, error } = this.props;
        return <div> {JSON.stringify({ status, ids, error })} </div>;
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
    requestIndex: PropTypes.func
};

const mapStateToProps = state => ({
    status: selectIndexRequest(state).status,
    ids: selectCohortIds(state),
    error: selectIndexRequest(state).error
});

const mapDispatchToProps = dispatch => ({
    requestIndex: () => dispatch(cohortRequestList())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CohortIndex);
