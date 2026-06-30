import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export default memo(({ data, selected }) => {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={80}
        minHeight={40}
        handleStyle={{ width: 8, height: 8 }}
      />
      <div
        className="highlight-box"
        style={{
          width: '100%',   // fills the resized container
          height: '100%',
        }}
      >
        {data.label && <span className="highlight-label">{data.label}</span>}
      </div>
      {/* Hidden handles to satisfy React Flow */}
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
    </>
  );
});