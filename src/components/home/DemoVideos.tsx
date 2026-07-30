import { existsSync } from "fs";
import path from "path";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AutoplayVideo } from "@/components/home/AutoplayVideo";

const CLIPS = [
  {
    file: "simulation-demo.mp4",
    title: "The simulations",
    description: "One real job moment, start to finish: read the scenario, make the call, see it register.",
  },
  {
    file: "skill-lab-demo.mp4",
    title: "The Skill Lab",
    description: "A quick reflex/memory/precision game, the kind that measures how you actually move, not what you'd rate yourself.",
  },
];

export function DemoVideos() {
  const available = CLIPS.filter((c) => existsSync(path.join(process.cwd(), "public/videos", c.file)));
  if (available.length === 0) return null;

  return (
    <section className="flex flex-col gap-10 scroll-mt-24 lg:-mx-16">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">See it in action</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Not a quiz. An actual moment.
        </h2>
      </ScrollReveal>
      <div className={`grid gap-8 ${available.length > 1 ? "sm:grid-cols-2" : "mx-auto w-full max-w-2xl"}`}>
        {available.map((clip, i) => (
          <ScrollReveal key={clip.file} delay={i * 0.1} className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
              <AutoplayVideo src={`/videos/${clip.file}`} />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{clip.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/60">{clip.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
