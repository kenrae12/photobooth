const BULB_COUNT = 7;

/** Decorative row of flickering marquee bulbs above the title. */
export function Marquee() {
  return (
    <div className="marquee">
      {Array.from({ length: BULB_COUNT }).map((_, i) => (
        <div className="bulb" key={i} />
      ))}
    </div>
  );
}
