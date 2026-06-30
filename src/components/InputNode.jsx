// InputNode.jsx
import { Handle, Position } from 'reactflow';

export default function InputNode({ data }) {
  return (
    <div className="terminal-node input-node">
      <div className="terminal-label">{data.label || 'Entrada'}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}