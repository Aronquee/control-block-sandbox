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

const nodeTypesMap = {
  block: BlockNode,
  summing: SummingNode,
  pickoff: PickoffNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrow' } }, eds)),
    [setEdges]
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

      const position = reactFlowWrapper.current
        ? (reactFlowWrapper.current as any).screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : { x: 0, y: 0 };

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: type === 'block' ? 'G(s)' : type === 'summing' ? { signs: ['+', '-'] } : {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Toolbar />
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