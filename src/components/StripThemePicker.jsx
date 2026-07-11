import { STRIP_THEMES } from '../constants/stripThemes';

/** Lets the user pick a visual theme for the downloadable photo strip. */
export function StripThemePicker({ selectedThemeId, onSelect }) {
  return (
    <div className="theme-picker">
      <p className="theme-picker-label">Strip design</p>
      <div className="theme-swatches">
        {STRIP_THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`swatch ${selectedThemeId === theme.id ? 'selected' : ''}`}
            onClick={() => onSelect(theme.id)}
            title={theme.label}
          >
            <span
              className="swatch-preview"
              style={{
                background: theme.swatch[0],
                border: `2px solid ${theme.swatch[1]}`,
              }}
            />
            <span className="swatch-name">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
