// The idle printer: a short tip of paper out of the slot, a faint printed header and "ready".
export function PaperTip() {
  return (
    <div className="paper-tip mono" aria-hidden="true">
      <span className="tip-brand">S T A G E D</span>
      <span className="tip-rule" />
      <span className="tip-ready"><i />ready</span>
    </div>
  );
}
