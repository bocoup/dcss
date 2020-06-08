import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import Storage from '@utils/Storage';
import Loading from '@components/Loading';
import Scenario from '@components/Scenario';
import { linkRunToCohort, setCohortUserRole } from '@client/actions/cohort';
import { getUser } from '@client/actions/user';
import { getResponse, setResponses } from '@client/actions/response';
import { getRun, setRun } from '@client/actions/run';

class Run extends Component {
  constructor(props) {
    super(props);

    const {
      match: { url }
    } = this.props;

    this.state = {
      isReady: false,
      baseurl: url.replace(/\/slide\/\d.*$/g, '')
    };

    this.responses = new Map();
    this.onChange = this.onChange.bind(this);
    this.onResponseChange = this.onResponseChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const {
      cohortId,
      getRun,
      linkRunToCohort,
      location: { search },
      scenarioId,
      setCohortUserRole,
      setRun
    } = this.props;

    const run = await getRun(scenarioId);

    if (run) {
      if (cohortId) {
        const cohort = await linkRunToCohort(cohortId, run.id);

        if (cohort) {
          const { id, users } = cohort;
          const {
            user: { username }
          } = this.props;

          if (!users.find(user => username === user.username)) {
            // For now we'll default all unknown
            // users as "participant".
            await setCohortUserRole({
              id,
              role: 'participant'
            });
          }
        }
      }

      const referrer_params = Storage.get('app/referrer_params');
      if (search || referrer_params) {
        await setRun(run.id, {
          referrer_params: QueryString.parse(search || referrer_params)
        });
        Storage.delete('app/referrer_params');
      }

      this.setState({ isReady: true });
    }
  }

  onResponseChange(event, data) {
    const {
      created_at,
      ended_at = new Date().toISOString(),
      isSkip = false,
      name,
      type,
      value
    } = data;
    const record = {
      created_at,
      ended_at,
      isSkip,
      type,
      value
    };
    const isRecordable =
      !this.responses.has(name) || (this.responses.has(name) && !isSkip);

    if (isRecordable) {
      this.responses.set(name, record);
    }
  }

  async onChange(event, data) {
    await this.props.setRun(this.props.run.id, data);
  }

  async onSubmit() {
    if (this.props.run) {
      await this.props.setResponses(this.props.run.id, [...this.responses]);
      this.responses.clear();
    }
  }

  render() {
    const { onChange, onResponseChange, onSubmit } = this;
    const { cohortId, scenarioId } = this.props;
    const { isReady, baseurl } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    return this.props.run ? (
      <Scenario
        baseurl={baseurl}
        cohortId={cohortId}
        scenarioId={scenarioId}
        onResponseChange={onResponseChange}
        onRunChange={onChange}
        onSubmit={onSubmit}
        setActiveSlide={() => {}}
      />
    ) : (
      <Loading />
    );
  }
}

Run.propTypes = {
  cohort: PropTypes.object,
  cohortId: PropTypes.node,
  setCohortUserRole: PropTypes.func,
  getUser: PropTypes.func,
  getResponse: PropTypes.func,
  setResponses: PropTypes.func,
  scenarioId: PropTypes.node,
  run: PropTypes.object,
  getRun: PropTypes.func,
  setRun: PropTypes.func,
  linkRunToCohort: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortId: PropTypes.node,
      scenarioId: PropTypes.node
    }).isRequired,
    url: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match || { params: {} };
  const { id, username, permissions } = state.login;
  const { currentCohort: cohort } = state.cohort;
  const { responses, run } = state;

  return {
    activeRunSlideIndex: Number(
      ownProps.activeRunSlideIndex || params.activeRunSlideIndex
    ),
    cohortId: Number(ownProps.cohortId || params.cohortId),
    scenarioId: Number(ownProps.scenarioId || params.scenarioId),
    cohort,
    responses,
    run,
    user: { id, username, permissions }
  };
};

const mapDispatchToProps = dispatch => ({
  setCohortUserRole: params => dispatch(setCohortUserRole(params)),
  getUser: params => dispatch(getUser(params)),
  getResponse: params => dispatch(getResponse(params)),
  setResponses: (...params) => dispatch(setResponses(...params)),
  getRun: params => dispatch(getRun(params)),
  setRun: (...params) => dispatch(setRun(...params)),
  linkRunToCohort: (...params) => dispatch(linkRunToCohort(...params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Run)
);
