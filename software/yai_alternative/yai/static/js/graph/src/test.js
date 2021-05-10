
const ReactFlow = window.ReactFlow.default;
const elements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    // you can also pass a React component as a label
    { id: '2', data: { label: 'pippo' }, position: { x: 100, y: 100 } },
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

const BasicFlow = () => <ReactFlow style={{ width: 500, height: 500 }} elements={elements} />;

console.log(elements);
const domContainer = document.querySelector('#test');
ReactDOM.render(<BasicFlow />, domContainer);