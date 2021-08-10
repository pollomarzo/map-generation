import React from 'react';

const nodeStyle = (disabled) => ({
    padding: 10,
    border: '1px solid',
    borderColor: disabled ? '#828282' : '#ff0072',
    background: disabled ? '#b5b5b5' : 'white',
    position: 'relative',
    width: 150,
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

export const NodeSidebar = ({ nodes }) => {
    return (
        <aside style={{ border: '1px solid red' }}>
            <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                Drag the nodes you need to the pane on the left.
            </div>
            <div style={{ padding: 10 }}>
                {
                    nodes.map((node) => (
                        <div key={node.id} style={nodeStyle(node.data.disabled)} onDragStart={(event) => onDragStart(event, node)} draggable={!node.data.disabled}>
                            {node.data.label}
                        </div>
                    ))
                }
            </div>
        </aside>
    );
};

export const LabelSidebar = ({ nodes }) => {
    return (
        <aside style={{ margin: '2px', border: '1px solid blue' }}>
            <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                Drag the edge labels you need to the pane on the left.
            </div>
            <div style={{ padding: 10 }}>
                {
                    nodes.map((node) => (
                        <div key={node.id} style={edgeStyle} onDragStart={(event) => onDragStart(event, node)} draggable={true}>
                            {node.data.label}
                        </div>
                    ))
                }
            </div>
        </aside>
    );
};