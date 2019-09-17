import React from 'react';
import { storiesOf } from '@storybook/react';
import './stories.css';

storiesOf('Editor', module)
    .add('Layout', () => (
        <div className="editor_container">
            <div className="slide_holder"></div>
            <div className="slide_editor"></div>
        </div>
    ))