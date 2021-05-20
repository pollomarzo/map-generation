import React, { memo, useCallback, useMemo } from 'react';

import { getConnectedEdges, Handle, Position, useStoreState } from 'react-flow-renderer';

import Collapse from 'react-collapse';

import { COLLAPSE_HANDLE_IDS, FRAGMENT_TYPE, HANDLE_TYPE } from './const';
import { TEST_CONF } from './config';


const targetHandleStyle = { background: '#555' };

const notConnectedStyle = { background: '#bdbbb3' };
const connectedStyle = (correct) => (TEST_CONF.COLORED_FEEDBACK ?
    { background: (correct ? '#c8f7ba' : '#ff4d64') } : notConnectedStyle);

// const onConnect = (params) => console.log('handle onConnect', params);


const CollapseNode = ({ id, data }) => {
    const { label, gappedText, open, hasQuestions, onGapClick, noTargetHandle } = data;
    const nodes = useStoreState(store => store.nodes);
    const edges = useStoreState(store => store.edges);

    const handles = useMemo(() => gappedText.filter((el) => (el.type === FRAGMENT_TYPE.GAP)).map((el, idx) => (
        <Handle
            key={idx}
            type={HANDLE_TYPE.SOURCE}
            position={Position.Right}
            style={{ position: 'static', display: (!open ? 'none' : 'block') }}
            id={el.handleId}
        />
    )), [gappedText, open]);

    const populateContent = useCallback(() => {
        const connectedEdges = edges.filter((edge) => edge.source === id);
        return gappedText.map((it, idx) => {
            if (it.type === FRAGMENT_TYPE.PIECE) return (<span key={idx}>{it.text}</span>);
            // if the node is connected to a node then display the words
            const edge = connectedEdges.find((edge) => (edge.source === id &&
                edge.sourceHandle === it.handleId));
            if (edge) {
                return <span
                    key={idx}
                    style={connectedStyle(edge.target === it.targetId)}
                    onClick={onGapClick}>{
                        nodes.find(
                            (node) => node.id === edge.target).data.label}</span>;
            }
            // otherwise set style and empty content
            return <span key={idx} style={notConnectedStyle}>_____</span>;
        });
    }, [edges, gappedText, id, nodes, onGapClick]);

    const content = useMemo(() => populateContent(gappedText, edges), [populateContent, gappedText, edges]);
    // console.log(gappedText);

    return (
        <div style={{ padding: 20, backgroundColor: '#ffff', width: '300px', position: 'relative' }}>

            { noTargetHandle || <Handle
                type={HANDLE_TYPE.TARGET}
                position={Position.Left}
                style={targetHandleStyle}
                /* onConnect={onConnect} */ />
            }
            <div style={{}}> {/**bold? change font? have to make it decent... */}
                {label}
            </div>

            <Collapse isOpened={open} style={{ transition: 'height 500ms' }} /* TODO:why no anim? */>
                <div>
                    {content}
                </div>
            </Collapse>

            {hasQuestions && <Handle
                type={HANDLE_TYPE.SOURCE}
                position={Position.Bottom}
                id={COLLAPSE_HANDLE_IDS.QUESTIONS}
                style={{ position: 'absolute', top: '50%', zIndex: '-1' }}
            />}

            <Handle
                type={HANDLE_TYPE.SOURCE}
                position={Position.Right}
                id={COLLAPSE_HANDLE_IDS.DEFAULT}
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