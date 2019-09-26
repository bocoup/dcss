import React from 'react';
import { Tab } from 'semantic-ui-react';
import { ScenarioEditor} from '@components/scenarioEditor';
import { SlideEditor } from '@components/slideEditor';
import './editor.css';

const panes = [
    { menuItem: 'Moment', render: ScenarioEditor},
    { menuItem: 'Slides', render: SlideEditor}
];

export const Editor = () => (
    <Tab panes={panes} />
);
