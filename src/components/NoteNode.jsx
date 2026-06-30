import { Handle, Position } from 'reactflow';

export default function NoteNode({ data }) {
  return (
    <div className="note-node">
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <div contentEditable suppressContentEditableWarning className="note-text">
        {data.text || 'Note...'}
      </div>
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  );
}