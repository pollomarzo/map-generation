import ReactFlow, {
    removeElements,
    isEdge,
    Controls
} from 'react-flow-renderer';
import { EDGE_TYPE } from '../const';
import DetachNode from '../custom_elements/DetachNode';
import ColoredEdge from '../custom_elements/ColoredEdge';

const nodeTypes = {
    detach_node: DetachNode,
};

const edgeTypes = {
    colored_edge: ColoredEdge,
};



const Flow = ({
    elements, setElements,
    flowProps }) => {
    const { onDrop,
        onDragOver,
        onLoad } = flowProps;

    const onRemoveEdge = (edge) => setElements(els => [...removeElements([edge], els)]);

    const onConnect = params => {
        console.log("connecting params: ", params);
        // make sure the two nodes are different types
        const target = elements.find(el => el.id === params.target);
        const targetType = target.data.type;
        const targetOriginalId = target.originalId || target.id;

        const source = elements.find(el => el.id === params.source);
        const sourceType = source.data.type;
        const sourceOriginalId = source.originalId || source.id;

        if (sourceType !== targetType) {
            const edgeId = `${params.source}-${params.target}-edge`;
            let newEdge = {
                ...params,
                id: edgeId,
                animated: false,
                type: EDGE_TYPE.COLORED_EDGE,
                data: {
                    onClick: () => onRemoveEdge(newEdge, newEdge.target),
                },
                sourceOriginalId: sourceOriginalId,
                targetOriginalId: targetOriginalId,
            }
            setElements(elements => [...elements, newEdge]);
        }
    };

    const onElementClick = (_, el) => {
        if (isEdge(el) && flowProps.inCreation) {
            onRemoveEdge(el, el.target);
        }
    };

    return (
        <div style={{ height: '100%' }}>
            <ReactFlow
                elements={elements}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                elementsSelectable={false}
                onElementClick={onElementClick}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onLoad={onLoad}
                onlyRenderVisibleElements={true}
            >
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>)
};
export default Flow;