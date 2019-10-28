import React from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm } from 'semantic-ui-react';

class ConfirmableDeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        const { onConfirm, what } = this.props;

        const ariaLabel = `Delete ${what}`.trim();
        // TODO: figure out a nicer way to do this :|
        const content = what
            ? `Deleting cannot be undone! Are you sure you want to delete this ${what}?`
            : `Deleting cannot be undone! Are you sure you want to delete?`;

        return (
            <React.Fragment>
                <Button
                    icon="trash alternate outline"
                    aria-label={ariaLabel}
                    onClick={() => this.setState({ open: true })}
                />
                <Confirm
                    open={this.state.open}
                    content={content}
                    cancelButton="No, thanks"
                    confirmButton="Yes, I understand!"
                    onCancel={() => this.setState({ open: false })}
                    onConfirm={() => {
                        onConfirm();
                        this.setState({ open: false });
                    }}
                />
            </React.Fragment>
        );
    }
}

ConfirmableDeleteButton.propTypes = {
    what: PropTypes.string,
    onConfirm: PropTypes.func.isRequired
};
export default ConfirmableDeleteButton;
