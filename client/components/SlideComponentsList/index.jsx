import React from 'react';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';
import './SlideComponentsList.css';

const SlideComponentsList = ({ components }) => {
    const style = {
        height: '150px',
        overflow: 'hidden'
    };
    return (
        <div style={style}>
            <svg width="500" height="400">
                {/* intentionally break out */}
                <foreignObject
                    transform="scale(0.5)"
                    width="100%"
                    height="100%"
                >
                    {components.map((value, index) => {
                        const { type } = value;
                        const { Display } = Components[type];
                        return <Display key={`slide${index}`} {...value} />;
                    })}
                </foreignObject>
            </svg>
        </div>
    );
};

SlideComponentsList.propTypes = {
    components: PropTypes.array
};
export default SlideComponentsList;
