// The little receipt slip that pops out of the Copy button, then tears off.
export function CopySlip({ tag, run }) {
  if (!run) return null;
  return (
    <span className="slip-slot" aria-hidden="true">
      <span className="slip" key={run}>
        <span className="slip-paper">
          <i>STAGED</i>
          <b className="mono"><u />copied {tag}</b>
        </span>
      </span>
    </span>
  );
}
