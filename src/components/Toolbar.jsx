const nodeTypes = [
  {
    type: 'input',
    label: 'Entrada (Input)',
    icon: '→',
    group: 'terminals',
  },
  {
    type: 'output',
    label: 'Saída (Output)',
    icon: '←',
    group: 'terminals',
  },
  {
    type: 'block',
    label: 'Block (G(s))',
    icon: '⬜',
    group: 'blocks',
  },
  {
    type: 'summing',
    label: 'Summing Point',
    icon: '⊕',
    group: 'junctions',
  },
  {
    type: 'pickoff',
    label: 'Pickoff Point',
    icon: '●',
    group: 'junctions',
  },
  {
    type: 'highlight',
    label: 'Highlight Box',
    icon: '⬚',
    group: 'annotations',
  },
  {
    type: 'note',
    label: 'Text Note',
    icon: '📝',
    group: 'annotations',
  },
];

const groups = {
  terminals: '🔌 Terminals',
  blocks: '🧱 Blocks',
  junctions: '🔀 Junctions',
  annotations: '✏️ Annotations',
};

export default function Toolbar({ redEdgeMode, onToggleRedMode, onLoadTutorial }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Group items
  const grouped = {};
  nodeTypes.forEach((nt) => {
    if (!grouped[nt.group]) grouped[nt.group] = [];
    grouped[nt.group].push(nt);
  });

  return (
    <aside className="toolbar">
      <h3 className="toolbar-title">🧰 Components</h3>

      {Object.keys(groups).map((group) => (
        <div key={group} className="toolbar-group">
          <div className="toolbar-group-title">{groups[group]}</div>
          {grouped[group].map((nt) => (
            <div
              key={nt.type}
              className="toolbar-item"
              draggable
              onDragStart={(e) => onDragStart(e, nt.type)}
            >
              <span className="toolbar-item-icon">{nt.icon}</span>
              <span className="toolbar-item-label">{nt.label}</span>
            </div>
          ))}
        </div>
      ))}

      <hr className="toolbar-divider" />

      <div className="toolbar-control">
        <label className="toolbar-checkbox">
          <input
            type="checkbox"
            checked={redEdgeMode}
            onChange={onToggleRedMode}
          />{' '}
          <span className="toolbar-control-label">🔴 Red feedback edge</span>
        </label>
      </div>

      <button className="toolbar-tutorial-btn" onClick={onLoadTutorial}>
        📘 Load Tutorial
      </button>
    </aside>
  );
}