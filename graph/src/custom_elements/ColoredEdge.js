import React from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';
import { useNodeContext } from '../NodeContext';

const correctColor = '#99ff66';
const incorrectColor = '#ff5757';

const style = (showResults, correct) => ({
    stroke: showResults ? (correct ? correctColor : incorrectColor) : undefined,
    cursor: showResults && 'pointer',
});

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    arrowHeadType,
    markerEndId,
}) {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const { showResults } = useNodeContext();

    return (
        <>
            <path id={id} style={style(showResults, data.correct)} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
        </>
    );
}