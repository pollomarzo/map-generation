import LayoutFlow from './LayoutFlow';
import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    addEdge,
    isEdge,
    useStoreState,
    getOutgoers,
} from 'react-flow-renderer';
import { NODE_IDS, EDGE_IDS, NODE_TYPE, FRAGMENT_TYPE } from './const';
import { getRandom } from './utils';
import { TEST_CONF } from './config';


const TestFlow = ({ rootNode, elements, setElements,
    allElements,
    shouldLayout,
    setShouldLayout,
    flowProps }) => {
    const { fitView } = useZoomPanHelper();
    const edges = useMemo(() => elements.filter(isEdge), [elements]);

    const onRemoveEdge = (edge, targetId) => {
        const node = elements.find((el) => targetId === el.id);
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                connected: false
            }
        };
        setElements(els => [updatedNode, ...removeElements([updatedNode, edge], els)]);
    }



    // on render, view should be reset. might change later
    useEffect(() => {
        fitView({ padding: 0.5 });
        setShouldLayout(true);
    }, [fitView, setShouldLayout]);




    const onConnect = params => {
        // make sure the edge doesn't exist already. only one edge per handle
        if (!edges.find(edge => edge.sourceHandle === params.sourceHandle || edge.target === params.target)) {
            const edgeId = EDGE_IDS.TEST_EDGE(rootNode.id, params.target);
            const newEdge = {
                ...params,
                id: edgeId,
                animated: false,
                data: { type: 'test' }
            }
            let node = elements.find((el) => el.id === params.target);
            const remainingElements = elements.filter((el) => el.id !== params.target);
            node = {
                ...node,
                data: {
                    ...node.data,
                    onHandleClick: () => onRemoveEdge(newEdge, params.target),
                    connected: true,
                }
            };
            setElements([...remainingElements, node, newEdge]);
        }
    };


    return (
        <LayoutFlow
            elements={elements} // put setView in useEffect on render []
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
            flowProps={{
                ...flowProps,
                onConnect
            }}
        />);
};
export default TestFlow;