import LayoutFlow from './LayoutFlow';
import { useEffect, useMemo, useState } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    addEdge,
    isEdge,
    useStoreState,
    getOutgoers
} from 'react-flow-renderer';
import { COLLAPSE_HANDLE_IDS, EDGE_IDS, NODE_TYPE } from './const';

const TestFlow = ({ rootNode, allElements, shouldLayout, setShouldLayout }) => {
    const [elements, setElements] = useState([rootNode]);
    const { fitView } = useZoomPanHelper();
    const edges = useMemo(() => elements.filter(isEdge), [elements]);

    const onGapClick = () => console.log("I GOT CLICKED!");

    useEffect(() => {
        const modifiedRoot = {
            ...rootNode,
            data: {
                ...rootNode.data,
                onGapClick,
            }
        }
        const modifiedNodes = getOutgoers(rootNode, allElements)
            .map((node) => ({
                ...node,
                type: NODE_TYPE.DETACH_NODE
            }
            ));
        setElements([modifiedRoot, ...modifiedNodes])
    }, [setElements, rootNode, allElements])

    // on render, view should be reset. might change later
    useEffect(() => {
        fitView({ padding: 0.5 });
        setShouldLayout(true);
    }, [fitView]);

    const onRemoveEdge = (edgeId, targetId) => {
        console.log("called with : ", edgeId, targetId);
        const node = elements.find((el) => targetId === el.id);
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                connected: false
            }
        };
        const remainingElements = elements.filter((el) => targetId !== el.id && edgeId !== el.id);
        setElements([updatedNode, ...remainingElements]);
    }


    const onConnect = params => {
        // make sure the edge doesn't exist already. only one edge per handle
        console.log("connecting!!");
        if (!edges.find(edge => edge.sourceHandle === params.sourceHandle || edge.target === params.target)) {
            const edgeId = EDGE_IDS.TEST_EDGE(rootNode.id, params.target);
            const newEdge = {
                ...params,
                id: edgeId,
                animated: true,
                data: { type: 'test' }
            }
            let node = elements.find((el) => el.id === params.target);
            const remainingElements = elements.filter((el) => el.id !== params.target);
            node = {
                ...node,
                data: {
                    ...node.data,
                    onHandleClick: () => onRemoveEdge(edgeId, node.id),
                    connected: true
                }
            }
            setElements([...remainingElements, node, newEdge]);
        }
    };
    // source: "my:risk-What?"
    // sourceHandle: "default"
    // target: "my:borrower"
    // targetHandle: null

    const onElementsRemove = elementsToRemove =>
        setElements(els => removeElements(elementsToRemove, els));


    return (
        <LayoutFlow
            elements={elements} // put setView in useEffect on render []
            setElements={setElements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}

        />);
};
export default TestFlow;