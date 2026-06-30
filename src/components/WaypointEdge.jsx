import { useCallback, useRef, useState } from 'react';
import { BaseEdge, useReactFlow } from 'reactflow';

// Helper: distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export default function WaypointEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  const { setEdges } = useReactFlow();
  const waypoints = data?.waypoints || [];
  const draggingIdxRef = useRef(null); // ref to avoid stale state
  const [, forceRender] = useState(0); // to force re‑render during drag (optional, but we rely on setEdges)

  // Build complete point array: source -> waypoints -> target
  const points = [
    { x: sourceX, y: sourceY },
    ...waypoints,
    { x: targetX, y: targetY },
  ];

  // Update edge data with new waypoints
  const updateWaypoints = useCallback(
    (newWaypoints) => {
      setEdges((edges) =>
        edges.map((e) =>
          e.id === id ? { ...e, data: { ...e.data, waypoints: newWaypoints } } : e
        )
      );
    },
    [id, setEdges]
  );

  // Add waypoint on double‑click of the edge
  const handleEdgeDoubleClick = (event) => {
    const { clientX, clientY } = event;
    const svg = event.target.closest('svg');
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM().inverse();
    const { x, y } = pt.matrixTransform(ctm);

    // Find nearest segment
    let minDist = Infinity;
    let insertIndex = 1; // after source
    for (let i = 0; i < points.length - 1; i++) {
      const d = distToSegment(x, y, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      if (d < minDist) {
        minDist = d;
        insertIndex = i + 1;
      }
    }

    const newWaypoints = [...waypoints];
    newWaypoints.splice(insertIndex - 1, 0, { x, y });
    updateWaypoints(newWaypoints);
  };

  // Start dragging a waypoint
  const handleMouseDown = (index) => (event) => {
    event.stopPropagation();
    draggingIdxRef.current = index;

    const svg = event.target.closest('svg');
    if (!svg) return;

    const onMouseMove = (e) => {
      const currentIdx = draggingIdxRef.current;
      if (currentIdx === null) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM().inverse();
      const { x, y } = pt.matrixTransform(ctm);

      // Update waypoints using current index
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id !== id) return edge;
          const wps = edge.data?.waypoints || [];
          if (currentIdx < 0 || currentIdx >= wps.length) return edge;
          const updated = wps.map((wp, i) => (i === currentIdx ? { x, y } : wp));
          return { ...edge, data: { ...edge.data, waypoints: updated } };
        })
      );
    };

    const onMouseUp = () => {
      draggingIdxRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Remove waypoint on double‑click of the circle
  const handleWaypointDoubleClick = (index) => (event) => {
    event.stopPropagation();
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    updateWaypoints(newWaypoints);
  };

  // Polyline path for visual
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <>
      {/* Wide transparent path for easy double‑click */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        onDoubleClick={handleEdgeDoubleClick}
        style={{ cursor: 'pointer' }}
      />
      {/* Visible edge (no pointer events so circles are clickable) */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={style.stroke || '#555'}
        strokeWidth={style.strokeWidth || 2}
        markerEnd={markerEnd}
        pointerEvents="none"
      />
      {/* Draggable waypoint circles */}
      {waypoints.map((wp, i) => (
        <circle
          key={i}
          cx={wp.x}
          cy={wp.y}
          r={5}
          fill="#ffffff"
          stroke={style.stroke || '#555'}
          strokeWidth={2}
          style={{ cursor: 'move' }}
          onMouseDown={handleMouseDown(i)}
          onDoubleClick={handleWaypointDoubleClick(i)}
        />
      ))}
    </>
  );
}