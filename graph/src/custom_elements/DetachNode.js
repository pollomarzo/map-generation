import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import './DetachNodeStyle.css';
import { NODE_DATA_TYPE } from '../const';
import { useNodeContext } from '../NodeContext';

const handleStyle = (clickable) => ({
    pointerEvents: clickable ? 'auto' : 'none',
    width: 15,
    height: 15,
})

const correctColor = '#99ff66';
const incorrectColor = '#ff5757';

const nodeStyle = (showResults, correct) => ({
    padding: 10,
    border: '1px solid',
    borderColor: '#ff0072',
    background: !showResults ? 'white' : correct ? correctColor : incorrectColor,
    width: 170,
    borderRadius: 100,
})

const labelStyle = (showResults, correct) => ({
    padding: 10,
    border: '2px solid',
    borderColor: '#1b17ef',
    background: !showResults ? 'white' : correct ? correctColor : incorrectColor,
    width: 120,
    borderRadius: 3
})


const DetachNode = memo(({ id, data }) => {
    const { label, onDelete } = data;
    const { navigationState, showResults } = useNodeContext();

    return (
        <div style={(data.type === NODE_DATA_TYPE.NODE) ?
            nodeStyle(showResults, data.correct) :
            labelStyle(showResults, data.correct)}>
            <Handle
                type="target"
                position="left"
                style={handleStyle(navigationState === 0)}
            />
            <Handle
                type="source"
                position="right"
                style={handleStyle(navigationState === 0)}
            />
            <div style={{ textAlign: 'center' }}>
                {label}
            </div>
            <div className="removeIcon" onClick={() => onDelete()} style={{
                display: navigationState === 0 ? undefined : 'none',
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