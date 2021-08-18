import React from 'react';

const nodeStyle = (disabled) => ({
    padding: 10,
    border: '1px solid',
    borderColor: disabled ? '#828282' : '#ff0072',
    background: disabled ? '#b5b5b5' : 'white',
    position: 'relative',
    minWidth: 120,
    maxWidth: 180,
    borderRadius: 3,
    marginTop: 20,
    cursor: disabled ? 'default' : 'grab',
    userSelect: 'none'
});

const edgeStyle = {
    padding: 10,
    border: '1px solid',
    borderColor: '#1b17ef',
    background: 'white',
    position: 'relative',
    width: 80,
    borderRadius: 5,
    marginTop: 20,
    cursor: 'grab',
    userSelect: 'none'
};

const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow/id', node.id);
    event.dataTransfer.setData('application/reactflow/type', node.data.type);
    event.dataTransfer.effectAllowed = 'move';
};

//TODO: shit duplicate code.. come on

export const NodeSidebar = ({ nodes, setDragging, onDragEnd }) => {
    console.log(nodes);
    return (
        <aside style={{ border: '1px solid red' }}>
            <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                Drag the nodes you need to the pane on the left.
            </div>
            <div style={{ padding: 10 }}>
                {
                    nodes.map((node) => (
                        <div key={node.id}
                            style={nodeStyle(node.data.disabled)}
                            onDragStart={(event) => {
                                setDragging(node.data.type);
                                onDragStart(event, node)
                            }}
                            onDragEnd={onDragEnd}
                            draggable={!node.data.disabled}>
                            {node.data.label}
                        </div>
                    ))
                }
            </div>
        </aside>
    );
};

export const LabelSidebar = ({ nodes, setDragging, onDragEnd }) => {
    return (
        <aside style={{ margin: '2px', border: '1px solid blue' }}>
            <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                Drag the edge labels you need to the pane on the left.
            </div>
            <div style={{ padding: 10 }}>
                {
                    nodes.map((node) => (
                        <div key={node.id}
                            style={edgeStyle}
                            onDragStart={(event) => {
                                setDragging(node.data.type);
                                onDragStart(event, node)
                            }}
                            onDragEnd={onDragEnd}
                            draggable={true}>
                            {node.data.label}
                        </div>
                    ))
                }
            </div>
        </aside>
    );
};