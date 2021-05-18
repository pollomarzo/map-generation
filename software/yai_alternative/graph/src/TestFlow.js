import LayoutFlow from './LayoutFlow';
import { useEffect, useMemo } from 'react';
import {
    useZoomPanHelper,
    removeElements,
    addEdge,
    isEdge
} from 'react-flow-renderer';
import { COLLAPSE_HANDLE_IDS } from './const';

const TestFlow = ({ rootNode, elements, setElements, shouldLayout, setShouldLayout }) => {
    const { fitView } = useZoomPanHelper();
    const edges = useMemo(() => elements.filter(isEdge), [elements]);

    // on render, view should be reset. might change later
    useEffect(() => {
        fitView({ padding: 0.5 });
    }, [fitView]);

    const onConnect = params => {
        // make sure the edge doesn't exist already. only one edge per handle
        if (!edges.find(edge => edge.sourceHandle === params.sourceHandle || edge.target === params.target))
            setElements(els =>
                addEdge({
                    ...params, animated: true, data: {
                        type: 'test',
                    }
                }, els)
            );

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