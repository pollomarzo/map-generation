import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import CancelIcon from '@material-ui/icons/Cancel';
import './DetachNodeStyle.css';

const DetachNode = memo(({ id, data }) => {
    const { label, connected, onHandleClick } = data;

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
                style={{ display: connected ? 'none' : 'inline-block' }}
            />
            {/* removal handle */}
            <Handle
                className="handle"
                type="target"
                position="left"
                style={{
                    width: '10px',
                    height: '10px',
                    boxSizing: 'border-box',
                    border: 2,
                    borderRadius: '0',
                    position: 'absolute',
                    zIndex: 3,
                    cursor: 'pointer',
                    display: !connected ? 'none' : 'inline-block'
                }}
                onClick={onHandleClick} />

            <div style={{ textAlign: 'center' }}>
                {label}
            </div>
        </div>
    );
});

export default DetachNode;