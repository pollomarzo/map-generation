import LayoutFlow from './LayoutFlow';
import { useCallback, useEffect, useMemo } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    isEdge,
} from 'react-flow-renderer';
import { EDGE_IDS } from '../const';


const TestFlow = ({ rootNode, elements, setElements,
    shouldLayout,
    setShouldLayout,
    flowProps }) => {
    const edges = useMemo(() => elements.filter(isEdge), [elements]);
    const { fitView: originalFitView, setCenter } = useZoomPanHelper();



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



    const fitView = (nodes) => {
        let fitted = false;
        const node = nodes[0];
        if (node) {
            fitted = true;
            const x = node.__rf.position.x + node.__rf.width;
            const y = node.__rf.position.y + node.__rf.height;
            const zoom = 0.90;
            setCenter(x, y, zoom);
        }
        console.log("setting shouldFitView to: ", !fitted);
        return fitted;
    }



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
        <>
            <LayoutFlow
                fitView={fitView}
                elements={elements} // put setView in useEffect on render []
                setElements={setElements}
                shouldLayout={shouldLayout}
                setShouldLayout={setShouldLayout}
                flowProps={{
                    ...flowProps,
                    onConnect
                }}
            />);
        </>)
};
export default TestFlow;