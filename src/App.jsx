import { useCallback, useState, useRef,useEffect  } from 'react';
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
import HighlightNode from './components/HighlightNode';
const nodeTypesMap = {
  block: BlockNode,
  summing: SummingNode,
  pickoff: PickoffNode,
  input: InputNode,
  output: OutputNode,
  note: NoteNode,
  highlight: HighlightNode,
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
  const [clipboard, setClipboard] = useState(null); // { nodes: [...], edges: [...] }
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
      if (type === 'highlight') nodeData = { label: '' };
      else if (type === 'summing') nodeData.signs = ['+', '-'];
      else if (type === 'input') nodeData.label = 'Input';
      else if (type === 'output') nodeData.label = 'Output';
      else if (type === 'note') nodeData.text = 'Note...';
      // pickoff needs no data (empty object)

      const newNode = {
        id: getId(),
        type,
        position,
        data: nodeData,
      };
      if (type === 'highlight') {
      newNode.style = { width: 200, height: 100 };
      }
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]  // <-- dependency added
    
  
  );
const onCopy = useCallback(() => {
  // Get currently selected nodes
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length === 0) return;

  // Find edges that connect only selected nodes
  const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
  const selectedEdges = edges.filter(
    (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
  );

  setClipboard({ nodes: selectedNodes, edges: selectedEdges });
}, [nodes, edges]);

const onPaste = useCallback(() => {
  if (!clipboard || clipboard.nodes.length === 0) return;

  // Generate new IDs and offset
  const idMap = {};
  const offset = 50; // shift each paste slightly
  const newNodes = clipboard.nodes.map((n) => {
    const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    idMap[n.id] = newId;
    return {
      ...n,
      id: newId,
      position: { x: n.position.x + offset, y: n.position.y + offset },
      selected: false,           // new nodes start unselected
    };
  });

  // Map old edge endpoints to new IDs
  const newEdges = clipboard.edges.map((e) => ({
    ...e,
    id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    source: idMap[e.source] || e.source,
    target: idMap[e.target] || e.target,
    selected: false,
  }));

  setNodes((nds) => [...nds, ...newNodes]);
  setEdges((eds) => [...eds, ...newEdges]);
}, [clipboard, setNodes, setEdges]);
useEffect(() => {
  const handleKeyDown = (event) => {
    // Copy: Ctrl+C (or Cmd+C on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      // Do not copy if user is editing an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      event.preventDefault();
      onCopy();
    }
    // Paste: Ctrl+V (or Cmd+V)
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      event.preventDefault();
      onPaste();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onCopy, onPaste]);
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