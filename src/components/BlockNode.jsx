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

      {/* Top side – both target and source (centred) */}
      <Handle type="target" position={Position.Top} id="target-top" style={{ left: '50%' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ left: '50%' }} />

      {/* Bottom side – both target and source (centred) */}
      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ left: '50%' }} />

      <div contentEditable suppressContentEditableWarning className="block-label">
        {data.label || 'G(s)'}
      </div>
    </div>
  );
}