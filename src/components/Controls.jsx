import { FILTERS } from '../constants/filters';

/** Filter picker + camera/photo action buttons. */
export function Controls({
  filter,
  onFilterChange,
  onSwitchCamera,
  onTakePhoto,
  canTakePhoto,
  onResetStrip,
  onDownloadStrip,
  hasShots,
}) {
  return (
    <div className="controls">
      <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
        {FILTERS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <button onClick={onSwitchCamera}>Switch Camera</button>
      <button className="primary" disabled={!canTakePhoto} onClick={onTakePhoto}>
        📸 Take Photo (3s)
      </button>
      <button onClick={onResetStrip}>Reset Strip</button>
      <button disabled={!hasShots} onClick={onDownloadStrip}>
        Download Strip
      </button>
    </div>
  );
}
