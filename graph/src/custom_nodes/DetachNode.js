import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import './DetachNodeStyle.css';
import { NODE_DATA_TYPE } from '../const';

const handleStyle = {
    width: 15,
    height: 15,
}

const nodeStyle = (showResults, correct) => ({
    padding: 10,
    border: '1px solid',
    borderColor: '#ff0072',
    background: !showResults ? 'white' : correct ? 'green' : 'red',
    position: 'relative',
    width: 150,
    borderRadius: 100,
})

const labelStyle = (showResults, correct) => ({
    padding: 10,
    border: '1px solid',
    borderColor: '#1b17ef',
    background: !showResults ? 'white' : correct ? 'green' : 'red',
    position: 'relative',
    width: 80,
    borderRadius: 3
})


const DetachNode = memo(({ id, data }) => {
    const { label, onDelete } = data;

    return (
        <div style={(data.type === NODE_DATA_TYPE.NODE) ?
            nodeStyle(data.showResults, data.correct) :
            labelStyle(data.showResults, data.correct)}>
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
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 3,
                top: '0px',
                right: '10px',
                backgroundColor: 'red',
                borderRadius: '50%',
            }} />
        </div>
    );
});

export default DetachNode;