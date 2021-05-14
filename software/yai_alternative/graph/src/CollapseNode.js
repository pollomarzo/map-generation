import React, { memo, useEffect, useCallback } from 'react';

import { Handle, Position, NodeProps, Connection, Edge, } from 'react-flow-renderer';

import Collapse from 'react-collapse';

import { annotatedText } from './utils';

const targetHandleStyle = { background: '#555' };
const sourceHandleStyleA = { ...targetHandleStyle /** do we need any style? */ };

const onConnect = (params) => console.log('handle onConnect', params);

const CollapseNode = ({ id, data }) => {/* 
    const [open, setOpen] = useState(false); */
    const { label, ans, open } = data;

    return (
        <div style={{ padding: 20, backgroundColor: '#ffff', width: '300px' }}>
            <Handle type="target" position={Position.Left} style={targetHandleStyle} onConnect={onConnect} />
            <div style={{}}> {/**bold? change font? have to make it decent... */}
                {label}
            </div>

            <Collapse isOpened={open} >
                <div>
                    {ans}
                </div>
            </Collapse>
            <Handle type="source" position={Position.Right} id="a" style={sourceHandleStyleA} />
        </div>
    );
};

export default memo(CollapseNode);