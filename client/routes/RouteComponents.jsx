import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Editor from '@components/Editor';
import Login from '@components/Login';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import ScenariosList from '@components/ScenariosList';

import Session from '@utils/session';

/**
 * Special case components for solving routing issues. Component state
 * doesn't update when navigating to exact same component.
 */

export const NewScenario = props => {
    return <Editor {...props} isNewScenario={true} />;
};

export const CopyScenario = props => {
    return <Editor {...props} isCopyScenario={true} />;
};

export const ScenariosListAll = props => {
    return <ScenariosList {...props} category="all" />;
};

export const ScenariosListAuthor = props => {
    return <ScenariosList {...props} category="author" />;
};

export const ScenariosListCommunity = props => {
    return <ScenariosList {...props} category="community" />;
};

export const ScenariosListOfficial = props => {
    return <ScenariosList {...props} category="official" />;
};

export const Logout = props => {
    return <Login {...props} mode="logout" />;
};

export const InterceptAnonymizableRoute = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                return Session.isSessionActive() ? (
                    children
                ) : (
                    <LoginRoutePromptModal {...props} />
                );
            }}
        />
    );
};

InterceptAnonymizableRoute.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export const RedirectRouteForActiveSession = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={() => {
                if (!Session.isSessionActive()) {
                    return children;
                }
                location.href = '/';
            }}
        />
    );
};

RedirectRouteForActiveSession.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export const RedirectRouteForInactiveSession = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={() => {
                if (Session.isSessionActive()) {
                    return children;
                }
                location.href = '/login';
            }}
        />
    );
};

RedirectRouteForInactiveSession.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};
