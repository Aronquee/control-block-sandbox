import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import BlockNode from './components/BlockNode';
import SummingNode from './components/SummingNode';
import PickoffNode from './components/PickoffNode';
import Toolbar from './components/Toolbar';
import InputNode from './components/InputNode';
import OutputNode from './components/OutputNode';
import NoteNode from './components/NoteNode';
import WaypointEdge from './components/WaypointEdge';
const nodeTypesMap = {
  block: BlockNode,
  summing: SummingNode,
  pickoff: PickoffNode,
  input: InputNode,
  output: OutputNode,
  note: NoteNode,
};
const edgeTypes = {
  default: WaypointEdge, 
};
let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [redEdgeMode, setRedEdgeMode] = useState(false);
const onConnect = useCallback(
(params) => {
    const edgeParams = {
      ...params,
      type: 'default',   // use our custom edge
      markerEnd: { type: 'arrow' },
      data: { waypoints: [] },   // initialize empty waypoints
    };
    if (redEdgeMode) {
      edgeParams.style = { stroke: '#d32f2f', strokeWidth: 2 };
    }
    setEdges((eds) => addEdge(edgeParams, eds));
  },
  [setEdges, redEdgeMode]
);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !nodeTypesMap[type]) return;

      // Use the React Flow instance to convert screen coordinates to flow coordinates
      const position = reactFlowInstance
        ? reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : { x: 0, y: 0 };

      let nodeData = {};
      if (type === 'block') nodeData.label = 'G(s)';
      else if (type === 'summing') nodeData.signs = ['+', '-'];
      else if (type === 'input') nodeData.label = 'Entrada';
      else if (type === 'output') nodeData.label = 'Saída';
      else if (type === 'note') nodeData.text = 'Note...';
      // pickoff needs no data (empty object)

      const newNode = {
        id: getId(),
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]  // <-- dependency added
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Toolbar
        redEdgeMode={redEdgeMode}
        onToggleRedMode={() => setRedEdgeMode(!redEdgeMode)}
      />
      <div ref={reactFlowWrapper} style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypesMap}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}  // <-- this captures the instance
          defaultEdgeOptions={{ type: 'smoothstep' }}   // <-- add this
          edgesReconnectable={true}
          fitView
        >
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}