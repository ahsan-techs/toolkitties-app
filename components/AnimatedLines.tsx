// Two thin brand-coloured lines that travel in opposite directions, one after the other:
// the first runs left to right, the second follows and runs right to left. Pure CSS.
export default function AnimatedLines({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`kitty-lines ${className}`}>
      <span className="kitty-line kitty-line-right" />
      <span className="kitty-line kitty-line-left" />
    </div>
  );
}
