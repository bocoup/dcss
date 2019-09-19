import React from 'react';
import { Grid } from 'semantic-ui-react';
import { ThumbnailContainer } from '@components/thumbnailContainer';
import './editor.css';

export const Editor = () => (
    <Grid divided="vertically">
        <ThumbnailContainer width={4} />
        <Grid.Column width={12} color="blue">
            SLIDE EDITOR
        </Grid.Column>
    </Grid>
);
