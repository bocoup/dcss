import React from 'react';

export const Dropdown = (props) => (
    <select>
        {   
            props.values &&
            props.values.map(v => 
            <option value={v}>{v}</option>)
        }
    </select>
)