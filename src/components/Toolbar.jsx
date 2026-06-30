const nodeTypes = [
  { type: 'block', label: 'Block' },
  { type: 'summing', label: 'Summing Point' },
  { type: 'pickoff', label: 'Pickoff Point' },
  { type: 'input', label: 'Entrada' },
  { type: 'output', label: 'Saída' },
  { type: 'note', label: 'Note (text)', }
];

export default function Toolbar({ redEdgeMode, onToggleRedMode }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="toolbar">
      <h3>Components</h3>
      {nodeTypes.map((nt) => (
        <div
          key={nt.type}
          className="toolbar-item"
          draggable
          onDragStart={(e) => onDragStart(e, nt.type)}
        >
          {nt.label}
        </div>
      ))}
      <hr />
    <div className="toolbar-control">
      <label>
        <input
          type="checkbox"
          checked={redEdgeMode}
          onChange={onToggleRedMode}
        />{' '}
        Red feedback edge
      </label>
    </div>
  </aside>
  );
}