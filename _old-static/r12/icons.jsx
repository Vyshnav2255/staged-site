// Hugeicons (stroke, free set). Only the arrow on the linked card is left.
const S = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

const PATHS = {
  arrow: ['M18.5 12L4.99997 12', 'M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6'],
};

export function Icon({ name, size = 18, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      {PATHS[name].map((d) => <path key={d} d={d} {...S} />)}
    </svg>
  );
}
