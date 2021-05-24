import React from 'react';

const nodeStyle = (disabled) => ({
    padding: 10,
    border: '1px solid',
    borderColor: '#ff0072',
    background: 'white',
    position: 'relative',
    width: 150,
    borderRadius: 3,
    marginTop: 20,
    cursor: disabled ? 'default' : 'grab',
    userSelect: 'none'
});

const TestSidebar = ({ nodes }) => {
    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', node.id);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
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

export default TestSidebar;