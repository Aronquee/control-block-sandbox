import { useCallback, useState, useRef, useEffect } from 'react';
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
import InputNode from './components/InputNode';
import OutputNode from './components/OutputNode';
import NoteNode from './components/NoteNode';
import WaypointEdge from './components/WaypointEdge';
import HighlightNode from './components/HighlightNode';
import Toolbar from './components/Toolbar';

// Map node types to components
const nodeTypesMap = {
  block: BlockNode,
  summing: SummingNode,
  pickoff: PickoffNode,
  input: InputNode,
  output: OutputNode,
  note: NoteNode,
  highlight: HighlightNode,
};

// Custom edge types
const edgeTypes = {
  default: WaypointEdge,
};

// Unique ID generator
let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [redEdgeMode, setRedEdgeMode] = useState(false);
  const [clipboard, setClipboard] = useState(null);

  // Track mouse position for paste-at-cursor
  const mousePosRef = useRef({ x: 0, y: 0 });

  // ----- Connection handler (with red edge support) -----
  const onConnect = useCallback(
    (params) => {
      const edgeParams = {
        ...params,
        type: 'default',
        markerEnd: { type: 'arrow' },
        data: { waypoints: [] },
      };
      if (redEdgeMode) {
        edgeParams.style = { stroke: '#d32f2f', strokeWidth: 2 };
      }
      setEdges((eds) => addEdge(edgeParams, eds));
    },
    [setEdges, redEdgeMode]
  );

  // ----- Drag & drop from toolbar -----
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !nodeTypesMap[type]) return;

      const position = reactFlowInstance
        ? reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : { x: 0, y: 0 };

      let nodeData = {};
      if (type === 'block') nodeData = { label: 'G(s)' };
      else if (type === 'summing') nodeData = { signs: ['+', '-'] };
      else if (type === 'input') nodeData = { label: 'Input' };
      else if (type === 'output') nodeData = { label: 'Output' };
      else if (type === 'note') nodeData = { text: 'Note...' };
      else if (type === 'highlight') nodeData = { label: '' };

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
    [reactFlowInstance, setNodes]
  );

  // ----- Copy / Paste logic -----
  const onCopy = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;

    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
    const selectedEdges = edges.filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );

    setClipboard({ nodes: selectedNodes, edges: selectedEdges });
  }, [nodes, edges]);

  const onPaste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;

    let baseX = 0, baseY = 0;
    if (reactFlowInstance) {
      try {
        const flowPos = reactFlowInstance.screenToFlowPosition({
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
        baseX = flowPos.x;
        baseY = flowPos.y;
      } catch (e) {
        const viewportCenter = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        baseX = viewportCenter.x;
        baseY = viewportCenter.y;
      }
    }

    const idMap = {};
    const offsetStep = 50;

    const newNodes = clipboard.nodes.map((n, index) => {
      const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      idMap[n.id] = newId;
      return {
        ...n,
        id: newId,
        position: {
          x: baseX + index * offsetStep,
          y: baseY + index * offsetStep,
        },
        selected: false,
      };
    });

    const newEdges = clipboard.edges.map((e) => ({
      ...e,
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      source: idMap[e.source] || e.source,
      target: idMap[e.target] || e.target,
      selected: false,
    }));

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [clipboard, reactFlowInstance, setNodes, setEdges]);

  // ----- Load tutorial (pre‑built example) -----
  const loadTutorial = useCallback(() => {
    const tutorialNodes = [
      { id: 'in', type: 'input', position: { x: 0, y: 150 }, data: { label: 'R(s)' } },
      { id: 'sum1', type: 'summing', position: { x: 200, y: 150 }, data: { signs: ['+', '-'] } },
      { id: 'block1', type: 'block', position: { x: 400, y: 150 }, data: { label: 'G(s)' } },
      { id: 'pick1', type: 'pickoff', position: { x: 600, y: 150 }, data: {} },
      { id: 'block2', type: 'block', position: { x: 600, y: 300 }, data: { label: 'H(s)' } },
      { id: 'out', type: 'output', position: { x: 800, y: 150 }, data: { label: 'C(s)' } },
      { id: 'note1', type: 'note', position: { x: 400, y: 420 }, data: { text: 'Exemplo: malha fechada com realimentação' } },
      { id: 'highlight1', type: 'highlight', position: { x: 350, y: 70 }, data: { label: 'Forward path' }, style: { width: 320, height: 200 } },
    ];

    const tutorialEdges = [
      { id: 'e-in-sum1', source: 'in', target: 'sum1', targetHandle: 'top', markerEnd: { type: 'arrow' } },
      { id: 'e-sum1-block1', source: 'sum1', target: 'block1', targetHandle: 'target-left', markerEnd: { type: 'arrow' } },
      { id: 'e-block1-pick1', source: 'block1', target: 'pick1', sourceHandle: 'source-right', markerEnd: { type: 'arrow' } },
      { id: 'e-pick1-out', source: 'pick1', target: 'out', sourceHandle: 'right', markerEnd: { type: 'arrow' } },
      { id: 'e-pick1-block2', source: 'pick1', target: 'block2', sourceHandle: 'bottom', targetHandle: 'target-left', markerEnd: { type: 'arrow' } },
      { id: 'e-block2-sum1', source: 'block2', target: 'sum1', sourceHandle: 'source-right', targetHandle: 'bottom', markerEnd: { type: 'arrow' }, style: { stroke: '#d32f2f', strokeWidth: 2 } },
    ];

    setNodes(tutorialNodes);
    setEdges(tutorialEdges);
  }, [setNodes, setEdges]);

  // ----- Keyboard shortcuts for copy/paste -----
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        onCopy();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        onPaste();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCopy, onPaste]);

  // ----- Render -----
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Toolbar
        redEdgeMode={redEdgeMode}
        onToggleRedMode={() => setRedEdgeMode(!redEdgeMode)}
        onLoadTutorial={loadTutorial}
      />
      <div
        ref={reactFlowWrapper}
        style={{ flex: 1 }}
        onMouseMove={(e) => {
          mousePosRef.current = { x: e.clientX, y: e.clientY };
        }}
      >
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
          onInit={setReactFlowInstance}
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