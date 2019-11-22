import { type } from './type';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Segment, TextArea } from 'semantic-ui-react';
import MicRecorder from 'mic-recorder-to-mp3';
import { detect } from 'detect-browser';
import { connect } from 'react-redux';

import './AudioResponse.css';

const SUPPORTED_BROWSERS = ['chrome', 'firefox'];

class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            type: '',
            blobURL: '',
            createdAt: ''
        };

        this.mp3Recorder = new MicRecorder({ bitRate: 128 });

        this.onClick = this.onClick.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.browserSupported = SUPPORTED_BROWSERS.includes(detect().name);
    }

    onClick() {
        this.setState(prevState => ({
            isRecording: !prevState.isRecording,
            createdAt: new Date().toISOString()
        }));
    }

    async onStart() {
        await this.mp3Recorder.start();
        this.setState({
            isRecording: true,
            createdAt: new Date().toISOString()
        });
    }

    async onStop() {
        const [buffer, blob] = await (await this.mp3Recorder.stop()).getMp3();
        const blobURL = URL.createObjectURL(blob);

        const file = new File(buffer, 'recording.mp3', {
            type: blob.type,
            lastModified: Date.now()
        });

        let data = new FormData();
        data.append('name', 'audio-response');
        data.append('recording', file);
        data.append('responseId', this.props.responseId);

        if (this.props.run) {
            data.append('runId', this.props.run.id);
        }

        const { s3Location } = await (await fetch('/api/media/audio', {
            method: 'POST',
            body: data
        })).json();

        this.setState(prevState => {
            if (prevState.blobURL) {
                URL.revokeObjectURL(prevState.blobURL);
            }
            return { blobURL, isRecording: false };
        });

        const responseChangeOptions = {
            name: this.props.responseId,
            value: s3Location,
            type: 'audio',
            createdAt: this.state.createdAt,
            endedAt: new Date().toISOString()
        };

        // This saves every recording that the user creates
        this.props.onResponseChange({}, responseChangeOptions);
    }

    render() {
        const { isRecording } = this.state;
        const { prompt, responseId, onResponseChange } = this.props;
        return this.browserSupported ? (
            <React.Fragment>
                <Segment>
                    {!isRecording && (
                        <Button basic toggle onClick={this.onStart}>
                            <Icon
                                name="circle"
                                aria-label="Record an Audio Response"
                            />
                            {prompt}
                        </Button>
                    )}
                    {isRecording && (
                        <Button basic negative onClick={this.onStop}>
                            <Icon
                                name="stop circle"
                                aria-label="Record an Audio Response"
                            />
                            Done
                        </Button>
                    )}
                </Segment>

                {this.state.blobURL && (
                    <audio src={this.state.blobURL} controls="controls" />
                )}
            </React.Fragment>
        ) : (
            <Segment>
                <Form>
                    <Form.Field>
                        <TextArea
                            name={responseId}
                            placeholder="Type your response here"
                            onChange={onResponseChange}
                        />
                    </Form.Field>
                </Form>
            </Segment>
        );
    }
}

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

Display.propTypes = {
    prompt: PropTypes.string,
    placeholder: PropTypes.string,
    isRecording: PropTypes.bool,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired,
    responseId: PropTypes.string,
    run: PropTypes.object
};

export default connect(mapStateToProps)(React.memo(Display));
