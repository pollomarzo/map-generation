import React, { memo, useState } from 'react';

import { Handle } from 'react-flow-renderer';
import './DetachNodeStyle.css';
import { NODE_DATA_TYPE } from '../const';
import { useNodeContext } from '../NodeContext';
import { useNavigationContext } from '../NavigationContext';
import { NAV } from '../conf';

const handleStyle = (clickable, dragOver) => ({
    pointerEvents: clickable ? 'auto' : 'none',
    width: 15,
    height: 15,
    background: dragOver ? 'red' : 'black',
})

const correctColor = '#99ff66';
const incorrectColor = '#ff5757';

const nodeStyle = (showResults, correct, dragOver) => ({
    padding: 10,
    borderStyle: dragOver ? 'dotted' : 'solid',
    borderWidth: dragOver ? 3 : 2,
    borderColor: '#ff0072',
    background: !showResults ? 'white' : correct ? correctColor : incorrectColor,
    width: 120,
    borderRadius: 100,
})

const labelStyle = (showResults, correct, dragOver) => ({
    padding: 10,
    borderStyle: dragOver ? 'dotted' : 'solid',
    borderWidth: dragOver ? 3 : 2,
    borderColor: '#1b17ef',
    background: !showResults ? 'white' : correct ? correctColor : incorrectColor,
    width: 250,
    borderRadius: 3
})


const DetachNode = memo(({ id, data }) => {
    const { label, onDelete } = data;
    const { showResults } = useNodeContext();
    const { navigationState } = useNavigationContext();
    const [dragOver, setDragOver] = useState(0);
    const editable = (navigationState === NAV.CREATE || navigationState === NAV.RECREATE)

    return (
        <div style={(data.type === NODE_DATA_TYPE.NODE) ?
            nodeStyle(showResults, data.correct, dragOver !== 0) :
            labelStyle(showResults, data.correct)}
            onDrop={(e) => {
                setDragOver(o => o - 1);
                data.onDrop(e);
            }}
            onDragEnter={(e) => {
                console.log('onDragEnter', e);
                e.preventDefault();
                e.stopPropagation();
                setDragOver(o => o + 1);
            }}
            onDragLeave={() => {
                console.log('onDragLeave');
                setDragOver(o => o - 1);
            }}
        >
            <Handle
                type="target"
                position="left"
                style={handleStyle(editable)}
            />
            <Handle
                type="source"
                position="right"
                style={handleStyle(editable, dragOver !== 0)}
            />
            <div style={{ textAlign: 'center' }}>
                {label}
            </div>
            <div className="removeIcon" onClick={() => onDelete()} style={{
                display: editable ? undefined : 'none',
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