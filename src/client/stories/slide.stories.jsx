import React from 'react';
import { storiesOf } from '@storybook/react';
import { Slide } from '../components/slide';

storiesOf('Slide', module)
    .add('plain slide', () => 
        <Slide />
    )