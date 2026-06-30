import { Handle, Position } from 'reactflow';

export default function BlockNode({ data }) {
  return (
    <div className="block-node">
      <Handle type="target" position={Position.Left} />
      <div contentEditable suppressContentEditableWarning className="block-label">
        {data.label || 'G(s)'}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}