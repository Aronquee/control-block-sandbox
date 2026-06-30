import { BaseEdge, getSmoothStepPath } from 'reactflow';   // <-- getSmoothStepPath

export default function RedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) {
  const [edgePath] = getSmoothStepPath({   // <-- use smoothstep
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ stroke: '#d32f2f', strokeWidth: 2 }}
      markerEnd={markerEnd}
    />
  );
}