import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Container,
  Header,
  Icon,
  Menu,
  Modal,
  Popup
} from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import './ConfirmableLogout.css';
import './Login.css';

class ConfirmableLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: 'clipboard outline'
    };
    this.onCancel = this.onCancel.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }
  onCancel() {
    this.setState({ open: false });
  }
  onClick() {
    this.setState({ open: true });
  }
  onConfirm() {
    this.setState({ open: false });
    this.props.history.push('/logout');
  }
  render() {
    const { onCancel, onClick, onConfirm } = this;
    const { open, name } = this.state;
    const {
      user: { username }
    } = this.props;

    const onNavLinkClick = event => {
      event.preventDefault();
      onClick();
    };

    return (
      <React.Fragment>
        <Menu.Item onClick={onNavLinkClick}>Log out</Menu.Item>
        <Modal open={open} size="small">
          <Header icon="log out" content="Log out confirmation" />
          <Modal.Content>
            <Container style={{ textAlign: 'center' }}>
              <p>You are currently logged in as: </p>
              <Popup
                content="Copy user name to clipboard"
                trigger={
                  <Button
                    icon
                    className="clmi__button"
                    content={
                      <React.Fragment>
                        <code>{username}</code>
                        <Icon name={name} />
                      </React.Fragment>
                    }
                    onClick={() => {
                      copy(username);
                      this.setState({
                        name: 'clipboard'
                      });
                    }}
                  />
                }
              />
              <p>Are you sure you want to log out?</p>
            </Container>
          </Modal.Content>
          <Modal.Actions className="modal__action-height">
            <Button.Group>
              <Button onClick={onConfirm} primary size="large">
                Yes, log me out
              </Button>
              <Button.Or />
              <Button onClick={onCancel} size="large">
                Cancel
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

ConfirmableLogout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object
};

export default withRouter(ConfirmableLogout);