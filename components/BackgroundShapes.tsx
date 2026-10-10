// Soft, static colour shapes (moss + gold, ~15% peak) that sit behind the homepage
// so the glass surfaces have something to blur. Purely decorative: absolutely
// positioned, no animation, no layout impact.
export default function BackgroundShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="shape-moss absolute -left-44 top-4 h-[480px] w-[480px] rounded-full md:h-[720px] md:w-[720px]" />
      <div className="shape-gold absolute -right-44 top-40 h-[420px] w-[420px] rounded-full md:h-[620px] md:w-[620px]" />
      <div className="shape-gold absolute -left-48 top-[26%] h-[460px] w-[460px] rounded-full md:h-[680px] md:w-[680px]" />
      <div className="shape-moss absolute -right-48 top-[48%] h-[460px] w-[460px] rounded-full md:h-[700px] md:w-[700px]" />
      <div className="shape-gold absolute -left-44 top-[72%] h-[420px] w-[420px] rounded-full md:h-[620px] md:w-[620px]" />
      <div className="shape-moss absolute -right-44 top-[88%] h-[420px] w-[420px] rounded-full md:h-[620px] md:w-[620px]" />
    </div>
  );
}
