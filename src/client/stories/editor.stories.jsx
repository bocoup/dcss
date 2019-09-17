import React from 'react';
import { storiesOf } from '@storybook/react';
import { Editor } from '../components/editor'
import './stories.css';

storiesOf('Editor', module)
    .add('Layout Component', () => (
        <Editor />
    ));