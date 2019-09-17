import React from 'react';
import { SlideHolder } from '../slideHolder';
import { SlideEditor } from '../slideEditor';
import './editor.css';

export const Editor = props => (
    <div className="editor_container">
        <SlideHolder />
        <SlideEditor />
    </div>
);
