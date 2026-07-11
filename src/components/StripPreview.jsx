/** Thumbnail row of the photos captured so far in the current strip. */
export function StripPreview({ shots }) {
  return (
    <div className="strip-wrap">
      <div className="strip-preview">
        {shots.map((src, i) => (
          <img src={src} key={i} alt={`Captured shot ${i + 1}`} />
        ))}
      </div>
      <p className="hint">
        Take up to 4 photos to fill a strip, then download it. Everything happens in your
        browser — nothing is uploaded anywhere.
      </p>
    </div>
  );
}
