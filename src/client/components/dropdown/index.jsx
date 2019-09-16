import React from 'react';

export const Dropdown = (props) => (
    <select>
        {
            props.title &&
            <DropdownTitle title={props.title}/>
        }
        {   
            props.values &&
            props.values.map(v => 
            <option value={v} key={v}>{v}</option>)
        }
    </select>
);

export const DropdownTitle = (props) => (
    <option defaultValue disabled aria-label="dropdown-title">{props.title}</option>
);