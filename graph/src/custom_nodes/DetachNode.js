import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import './DetachNodeStyle.css';

const handleStyle = {
    width: 15,
    height: 15,
}

const DetachNode = memo(({ id, data }) => {
    const { label, onDelete } = data;

    return (
        <div style={{
            padding: 10,
            border: '1px solid',
            borderColor: '#ff0072',
            background: 'white',
            position: 'relative',
            width: 150,
            borderRadius: 3
        }}>
            <Handle
                type="target"
                position="left"
                style={handleStyle}
            />
            <Handle
                type="source"
                position="right"
                style={handleStyle}
            />
            <div style={{ textAlign: 'center' }}>
                {label}
            </div>
            <div className="removeIcon" onClick={() => onDelete()} style={{
                width: '10px',
                height: '10px',
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 3,
                top: '5px',
                right: '5px',
            }} />
        </div>
    );
});

export default DetachNode;