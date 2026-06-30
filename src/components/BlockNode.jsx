import { Handle, Position } from 'reactflow';

export default function BlockNode({ data }) {
  return (
    <div className="block-node">
      {/* Left side – both target and source */}
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />

      {/* Right side – both target and source */}
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />

      <div contentEditable suppressContentEditableWarning className="block-label">
        {data.label || 'G(s)'}
      </div>
    </div>
  );
}