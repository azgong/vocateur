// Renders children directly, no scroll-triggered animation. Content that's
// there the instant it's on screen reads as more deliberate than every
// section fading up as you scroll past it.
export function ScrollReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
