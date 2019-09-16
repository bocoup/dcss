import React from 'react';
import { storiesOf } from '@storybook/react';
import { Slide, MiniSlide } from '../components/slide';

storiesOf('Slide', module)
    .add('plain slide', () => 
        <Slide />
    )
    .add('mini slide', () => 
        <MiniSlide />
    )