import React, { memo, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';

import { Handle, Position, getConnectedEdges, Connection, Edge, useStoreState, useUpdateNodeInternals } from 'react-flow-renderer';

import Collapse from 'react-collapse';

const targetHandleStyle = { background: '#555' };
const sourceHandleStyleA = { ...targetHandleStyle /** do we need any style? */ };

const connectedStyle = { background: '#c8f7ba' };
const notConnectedStyle = { background: '#bdbbb3' };

const onConnect = (params) => console.log('handle onConnect', params);


const CollapseNode = ({ id, data }) => {
    const { label, gappedText, open } = data;
    const edges = useStoreState(store => store.edges);


    const populateContent = useCallback(() => gappedText.map((it, idx) => {
        if (it.type === 'piece') return (<span key={idx}>{it.text}</span>);
        // if the node is connected to the correct node then display the words
        if (edges.find((edge) => edge.source === id && edge.target === it.targetId))
            return <span key={idx} style={connectedStyle}>{it.text}</span>;
        // otherwise set style and empty content
        return <span key={idx} style={notConnectedStyle}>_____</span>;
    }), [edges, gappedText, id]);

    const content = useMemo(() => populateContent(gappedText, edges), [populateContent, gappedText, edges]);

    const handles = useMemo(() => {
        if (open) {
            return (
                gappedText.filter((el) => (el.type === 'gap')).map((el, idx) => (
                    <Handle
                        key={idx}
                        type="source"
                        position={Position.Right}
                        style={{ position: 'static' }}
                        id={`${id}_${el.targetId}_handle`}
                    />
                ))
            )
        }
        // can't do it like this. see comment in jsx
        // return (
        //     <Handle type="source" position={Position.Right} id="default" style={sourceHandleStyleA} />
        // )
    }, [gappedText, open, id]);


    return (
        <div style={{ padding: 20, backgroundColor: '#ffff', width: '300px', position: 'relative' }}>
            <Handle type="target" position={Position.Left} style={targetHandleStyle} onConnect={onConnect} />
            <div style={{}}> {/**bold? change font? have to make it decent... */}
                {label}
            </div>

            <Collapse isOpened={open} style={{ transition: 'height 500ms' }} /* TODO:why no anim? */>
                <div>
                    {content}
                </div>
            </Collapse>

            <Handle
                type="source"
                position={Position.Right}
                id="default"
                // we can't unmount it because of when react-flow rerenders stuff
                // (because setElements is called top-level, react-flow attempts to find correct handles
                // before this component is rendered. so, the correct handle is not found until the next
                // render, which causes warnings to go off but everything to work correctly)
                style={{ display: (open ? 'none' : 'block') }} />

            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, right: -4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly'
            }}>
                {handles}
            </div>


        </div>
    );
};

export default memo(CollapseNode);