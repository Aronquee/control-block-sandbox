// OutputNode.jsx
import { Handle, Position } from 'reactflow';

export default function OutputNode({ data }) {
  return (
    <div className="terminal-node output-node">
      <Handle type="target" position={Position.Left} />
      <div className="terminal-label">{data.label || 'Saída'}</div>
    </div>
  );
}