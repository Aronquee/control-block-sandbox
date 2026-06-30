import { Handle, Position } from 'reactflow';

export default function PickoffNode({ data }) {
  return (
    <div className="pickoff-node">
      <Handle type="target" position={Position.Left} />
      <div className="dot"></div>
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ left: '50%' }} />
    </div>
  );
}