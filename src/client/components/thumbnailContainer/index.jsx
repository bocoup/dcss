import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import { ThumbnailGallery } from '@components/thumbnailGallery';
import { ThumbnailGroup } from '@components/thumbnailGroup';
import { Thumbnail } from '@components/thumbnail';
import './thumbnailContainer.css';
import 'semantic-ui-css/semantic.min.css';

const dropDownValues = [
    {
        key: 'context',
        value: 'context',
        text: 'Context'
    },
    {
        key: 'anticipate',
        value: 'anticipate',
        text: 'Anticipate'
    },
    {
        key: 'enact',
        value: 'enact',
        text: 'Enact'
    },
    {
        key: 'reflect',
        value: 'reflect',
        text: 'Reflect'
    }
];

//TODO: remove this when actually implementing thumbnails
const getRand = () => Math.floor(Math.random() * Math.floor(10));
const getRandArr = () => {
    let n = getRand() || 1;
    return new Array(n).fill(0, 0, n);
};

export const ThumbnailContainer = props => (
    <Grid.Column
        width={props.width}
        className="thumbnail_container"
        padded={false}
    >
        <Grid.Row className="dropdown_container">
            <Dropdown
                selection
                placeholder="Add +"
                fluid
                options={dropDownValues}
            />
        </Grid.Row>
        <ThumbnailGallery>
            {dropDownValues.map(v => (
                <ThumbnailGroup title={v.text}>
                    {getRandArr().map(i => (
                        <Thumbnail />
                    ))}
                </ThumbnailGroup>
            ))}
        </ThumbnailGallery>
    </Grid.Column>
);
