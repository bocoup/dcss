import React from 'react';
import './dropdown.css';

export const Dropdown = props => (
    <div className="dropdown-list">
        <select>
            {props.title && <DropdownTitle title={props.title} />}
            {props.values &&
                props.values.map(v => (
                    <option value={v} key={v} className="dropdown-text">
                        {v}
                    </option>
                ))}
        </select>
    </div>
);

export const DropdownTitle = props => (
    <option defaultValue disabled aria-label="dropdown-title">
        {props.title}
    </option>
);
