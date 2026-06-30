import { Handle, Position } from 'reactflow';

export default function SummingNode({ data }) {
  const signs = data.signs || ['+', '-'];
  return (
    <div className="summing-node">
      <Handle type="target" position={Position.Top} id="top" />
      <span className="sign sign-top">{signs[0]}</span>
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <span className="sign sign-bottom">{signs[1]}</span>
      <div className="circle">X</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}