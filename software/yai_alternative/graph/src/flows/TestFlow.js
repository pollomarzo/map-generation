import LayoutFlow from './LayoutFlow';
import { useEffect, useMemo } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    isEdge,
    useStoreState,
} from 'react-flow-renderer';
import { EDGE_IDS } from '../const';


const TestFlow = ({ rootNode, elements, setElements,
    shouldLayout,
    setShouldLayout,
    flowProps }) => {
    const edges = useMemo(() => elements.filter(isEdge), [elements]);

    const { setCenter } = useZoomPanHelper();


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
    // ouch. nodes is a new array every time, even if only position changes.
    // i'll just keep the warning for now
    useEffect(() => {
        // setShouldLayout(() => setCenter(0, 0, 1.85));
    });



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