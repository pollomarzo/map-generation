import LayoutFlow from './LayoutFlow';
import { NODE_TYPE, COLLAPSE_HANDLE_IDS, EDGE_DATA_TYPE } from '../const';
import {
    removeElements,
    useStoreState,
    getConnectedEdges,
    useZoomPanHelper
} from 'react-flow-renderer';

const ViewFlow = ({ elements, setElements, shouldLayout, setShouldLayout }) => {

    const nodes = useStoreState(store => store.nodes);
    const edges = useStoreState(store => store.edges);
    const { fitView: originalFitView, setCenter } = useZoomPanHelper();

    const onElementClick = (_, element) => {
        // if it's a collapse node and we're opening it
        if (element.type === NODE_TYPE.COLLAPSE_NODE) {
            const updatedNode = {
                ...element,
                data: {
                    ...element.data,
                    open: !element.data.open
                }
            };
            // ignore question nodes. immutable
            let modifEdges = getConnectedEdges([element], edges).filter((edge) =>
                edge.source === element.id && edge.data.type !== EDGE_DATA_TYPE.QUESTION);
            const remainingNodes = nodes.filter((node) => node.id !== element.id);
            const remainingEdges = removeElements(modifEdges, edges);
            // then we need to update some edges... without CREATING any. just update present ones
            if (element.data.open) {
                modifEdges = modifEdges.map((edge) => ({
                    ...edge,
                    sourceHandle: COLLAPSE_HANDLE_IDS.DEFAULT,
                }))
            }
            else {
                modifEdges = modifEdges.map((edge) => ({
                    ...edge,
                    sourceHandle: COLLAPSE_HANDLE_IDS.GAP_HANDLE_ID(element.id, edge.target),
                }))
            }

            setElements([...remainingNodes, updatedNode, ...modifEdges, ...remainingEdges]);

        }
        else console.log(element);
    };

    const fitView = (_) => {
        let fitted = true;
        originalFitView();
        return fitted;
    }


    return (
        <LayoutFlow
            elements={elements}
            setElements={setElements}
            shouldLayout={shouldLayout}
            setShouldLayout={setShouldLayout}
            fitView={fitView}
            flowProps={{
                onElementClick
            }}
        //onConnect={onConnect}
        //onElementsRemove={onElementsRemove}
        />)
};

export default ViewFlow;