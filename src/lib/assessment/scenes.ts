import { TraitVector } from "./types";

// A "chapter" is one of the four narrative worlds (Analyst/Physician/Executive/Founder).
// Each chapter runs 3 scenes. No scene is a pure single-quadrant test: every scene's
// trait contributions blend a primary quadrant with a meaningful secondary one, and the
// UI never labels a scene by quadrant/trait name, so there's nothing for a user to
// reverse-engineer and answer strategically toward.
export type ChapterId = "analyst" | "physician" | "executive" | "founder";

export type ChoiceOption = {
  id: string;
  label: string;
  traitContribution: Partial<TraitVector>;
};

export type ChoiceSceneConfig = {
  type: "choice";
  id: string;
  chapterId: ChapterId;
  title: string;
  context?: { speaker: string; text: string }[];
  prompt: string;
  options: ChoiceOption[];
  confirmLabel: string;
  description: string;
};

export type TimedSelectItem = {
  id: string;
  primaryLabel: string;
  secondaryLabel: string;
  correct: boolean;
};

export type TimedSelectSceneConfig = {
  type: "timedSelect";
  id: string;
  chapterId: ChapterId;
  title: string;
  prompt: string;
  items: TimedSelectItem[];
  timeLimitMs: number;
  correctContribution: Partial<TraitVector>;
  incorrectContribution: Partial<TraitVector>;
  confirmVerb: string;
  description: string;
};

export type RankingItem = {
  id: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type RankingSceneConfig = {
  type: "ranking";
  id: string;
  chapterId: ChapterId;
  title: string;
  prompt: string;
  displayOrder: RankingItem[];
  correctOrder: string[];
  primaryQuadrant: keyof TraitVector;
  secondaryQuadrant: keyof TraitVector;
  description: string;
};

export type AllocationCategory = {
  id: string;
  label: string;
  hint: string;
};

export type AllocationSceneConfig = {
  type: "allocation";
  id: string;
  chapterId: ChapterId;
  title: string;
  prompt: string;
  categories: AllocationCategory[];
  concentrationQuadrant: keyof TraitVector;
  balanceQuadrant: keyof TraitVector;
  balanceCategoryId: string;
  confirmLabel: string;
  description: string;
};

export type SceneConfig = ChoiceSceneConfig | TimedSelectSceneConfig | RankingSceneConfig | AllocationSceneConfig;

export type Chapter = {
  id: ChapterId;
  name: string;
  intro: string;
  /** Shown on the dedicated chapter title screen: what this chapter is built to assess. */
  quadrantLabel: string;
  focus: string;
  /** A short narrative setup for the chapter's world, shown as a "case file" on the title screen. */
  caseStudy: string;
  scenes: SceneConfig[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "analyst",
    name: "Analyst",
    intro: "An analyst call.",
    quadrantLabel: "Quadrant A: Analytical",
    focus:
      "This chapter is built around analytical thinking: the logical, fact-based, data-first way some people naturally approach problems. The three moments ahead reward rigor and evidence over gut instinct.",
    caseStudy:
      "You're three weeks into a research associate role at a mid-size investment fund. The senior partner is out sick, the client call starts in ten minutes, and the numbers on your screen need to make sense before it does.",
    scenes: [
      {
        type: "timedSelect",
        id: "spot_anomaly",
        chapterId: "analyst",
        title: "Spot the anomaly",
        prompt: "This quarter's regional revenue growth just came in. One number doesn't belong. Find it before time runs out.",
        items: [
          { id: "north", primaryLabel: "North", secondaryLabel: "+4.2%", correct: false },
          { id: "south", primaryLabel: "South", secondaryLabel: "+3.8%", correct: false },
          { id: "east", primaryLabel: "East", secondaryLabel: "+4.5%", correct: false },
          { id: "west", primaryLabel: "West", secondaryLabel: "+38.1%", correct: true },
          { id: "central", primaryLabel: "Central", secondaryLabel: "+4.0%", correct: false },
          { id: "pacific", primaryLabel: "Pacific", secondaryLabel: "+4.3%", correct: false },
        ],
        timeLimitMs: 20000,
        correctContribution: { quadrant_a: 0.95, quadrant_b: 0.35, quadrant_c: 0.05, quadrant_d: 0.15 },
        incorrectContribution: { quadrant_a: 0.55, quadrant_b: 0.3, quadrant_c: 0.1, quadrant_d: 0.15 },
        confirmVerb: "Lock in",
        description: "spotting the anomaly in a regional revenue dataset under a countdown",
      },
      {
        type: "choice",
        id: "diagnose_outage",
        chapterId: "analyst",
        title: "Diagnose the outage",
        prompt: "Checkout error rates just spiked to 12%. You have one message before the on-call lead escalates further. What do you check first?",
        confirmLabel: "Go with this",
        options: [
          { id: "diff_deploys", label: "Pull the last 3 deploys and diff what changed.", traitContribution: { quadrant_a: 0.95, quadrant_b: 0.4, quadrant_c: 0.05, quadrant_d: 0.15 } },
          { id: "traffic_correlation", label: "Check if it correlates with a traffic spike from one region.", traitContribution: { quadrant_a: 0.85, quadrant_b: 0.2, quadrant_c: 0.1, quadrant_d: 0.55 } },
          { id: "ask_oncall", label: "Ask the on-call lead what they're seeing on their end first.", traitContribution: { quadrant_a: 0.4, quadrant_b: 0.3, quadrant_c: 0.7, quadrant_d: 0.15 } },
          { id: "rollback", label: "Roll back the most recent deploy immediately, ask questions after.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.15, quadrant_c: 0.1, quadrant_d: 0.4 } },
        ],
        description: "diagnosing a production outage with one shot before it escalates",
      },
      {
        type: "choice",
        id: "trust_the_model",
        chapterId: "analyst",
        title: "Trust the model or the analyst",
        prompt: "Your valuation model says the deal is overpriced by 15%. The senior analyst who's done this 20 times says the model is missing something qualitative. You present in an hour.",
        confirmLabel: "Go with this",
        options: [
          { id: "quantify_it", label: "Re-run the model with her point quantified as a real variable.", traitContribution: { quadrant_a: 0.95, quadrant_b: 0.55, quadrant_c: 0.15, quadrant_d: 0.2 } },
          { id: "present_both", label: "Present both numbers and let the room decide.", traitContribution: { quadrant_a: 0.6, quadrant_b: 0.35, quadrant_c: 0.55, quadrant_d: 0.2 } },
          { id: "trust_her", label: "Trust her experience and go with the qualitative read.", traitContribution: { quadrant_a: 0.35, quadrant_b: 0.2, quadrant_c: 0.6, quadrant_d: 0.3 } },
          { id: "trust_model", label: "Trust the model: data over intuition, every time.", traitContribution: { quadrant_a: 0.97, quadrant_b: 0.3, quadrant_c: 0.05, quadrant_d: 0.1 } },
        ],
        description: "deciding whether to trust a valuation model over a senior analyst's gut call",
      },
    ],
  },
  {
    id: "physician",
    name: "Physician",
    intro: "An ER shift.",
    quadrantLabel: "Quadrant B: Sequential",
    focus:
      "This chapter is built around sequential thinking: the structured, detail-oriented, process-driven way some people operate under pressure. The three moments ahead reward order, precision, and following (or knowingly breaking) protocol.",
    caseStudy:
      "It's hour nine of a twelve-hour ER shift at a busy urban hospital. The waiting room just got fuller, the charge nurse is stretched thin, and every decision you make in the next few minutes has a real person attached to it.",
    scenes: [
      {
        type: "ranking",
        id: "triage",
        chapterId: "physician",
        title: "Triage the incoming cases",
        prompt: "Five patients just arrived. Tap them in the order you'd see them, most urgent first. Once you place a case, it's locked, no undo.",
        displayOrder: [
          { id: "wrist", primaryLabel: "Wrist injury after a fall", secondaryLabel: "Visible deformity, pain 6/10, alert" },
          { id: "chest_pain", primaryLabel: "Chest pain and shortness of breath", secondaryLabel: "Sweating, pain radiating to left arm" },
          { id: "ankle", primaryLabel: "Twisted ankle", secondaryLabel: "Mild swelling, able to bear some weight" },
          { id: "allergic", primaryLabel: "Severe allergic reaction", secondaryLabel: "Face and throat swelling, difficulty breathing" },
          { id: "meningitis", primaryLabel: "High fever, confusion", secondaryLabel: "104°F, stiff neck, disoriented" },
        ],
        correctOrder: ["allergic", "chest_pain", "meningitis", "wrist", "ankle"],
        primaryQuadrant: "quadrant_b",
        secondaryQuadrant: "quadrant_c",
        description: "sequencing five ER patients by urgency with no undo",
      },
      {
        type: "choice",
        id: "stick_to_checklist",
        chapterId: "physician",
        title: "Stick to the checklist",
        prompt: "You're mid-way through a pre-op checklist when a nurse flags something that isn't on the list but looks concerning. You're already behind schedule.",
        confirmLabel: "Go with this",
        options: [
          { id: "finish_first", label: "Finish the checklist exactly as written, then address it.", traitContribution: { quadrant_a: 0.35, quadrant_b: 0.95, quadrant_c: 0.15, quadrant_d: 0.05 } },
          { id: "pause_fully", label: "Pause the checklist, investigate the new concern fully, then resume.", traitContribution: { quadrant_a: 0.6, quadrant_b: 0.6, quadrant_c: 0.3, quadrant_d: 0.25 } },
          { id: "quick_assess", label: "Quickly assess if it's urgent, then decide whether to pause.", traitContribution: { quadrant_a: 0.65, quadrant_b: 0.55, quadrant_c: 0.2, quadrant_d: 0.3 } },
          { id: "delegate", label: "Delegate the checklist to someone else while you look into it.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.4, quadrant_c: 0.55, quadrant_d: 0.3 } },
        ],
        description: "deciding whether to break protocol mid-checklist for an unlisted concern",
      },
      {
        type: "ranking",
        id: "shift_handoff",
        chapterId: "physician",
        title: "Write the handoff",
        prompt: "End of shift. You have 90 seconds to hand off 5 things to the next physician. Order them by what they need to know first.",
        displayOrder: [
          { id: "supplies", primaryLabel: "Supply cart is low on gauze", secondaryLabel: "Restock requested" },
          { id: "labs_pending", primaryLabel: "Labs are pending for bed 2", secondaryLabel: "Results due in an hour" },
          { id: "unstable", primaryLabel: "Bed 4 is unstable", secondaryLabel: "Watch for a crash" },
          { id: "discharged", primaryLabel: "Bed 1 was discharged", secondaryLabel: "Room needs cleaning" },
          { id: "followup", primaryLabel: "Bed 6 needs a follow-up call", secondaryLabel: "To their PCP tomorrow" },
        ],
        correctOrder: ["unstable", "labs_pending", "followup", "supplies", "discharged"],
        primaryQuadrant: "quadrant_b",
        secondaryQuadrant: "quadrant_c",
        description: "prioritizing a 90-second end-of-shift handoff",
      },
    ],
  },
  {
    id: "executive",
    name: "Executive",
    intro: "A workplace conflict.",
    quadrantLabel: "Quadrant C: Interpersonal",
    focus:
      "This chapter is built around interpersonal thinking: the relational, emotionally attuned, people-first way some people lead. The three moments ahead reward reading people and situations, not just the facts on the page.",
    caseStudy:
      "You were just promoted to team lead. Two people you used to sit next to are now people you manage, and they're not getting along. Everything you know about them so far is coming through a screen.",
    scenes: [
      {
        type: "choice",
        id: "mediate_conflict",
        chapterId: "executive",
        title: "Mediate the conflict",
        context: [
          { speaker: "Alex (Slack DM)", text: "Jordan keeps rewriting my work without telling me. I found out about it in a client meeting. I look incompetent." },
          { speaker: "Jordan (Slack DM)", text: "Alex's draft had errors that would've gone to the client. I fixed it under deadline. There wasn't time to loop back." },
        ],
        prompt: "You only have these two messages. What do you do?",
        confirmLabel: "Go with this",
        options: [
          { id: "private_listen", label: "Meet with each of them privately first, before deciding anything.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.3, quadrant_c: 0.85, quadrant_d: 0.2 } },
          { id: "immediate_compromise", label: "Bring them together right now and propose a compromise on the spot.", traitContribution: { quadrant_a: 0.15, quadrant_b: 0.2, quadrant_c: 0.75, quadrant_d: 0.45 } },
          { id: "feelings_first", label: "Focus on how each person is feeling before touching the actual disagreement.", traitContribution: { quadrant_a: 0.1, quadrant_b: 0.15, quadrant_c: 0.95, quadrant_d: 0.25 } },
          { id: "escalate", label: "Escalate to their manager, since you don't have the full picture.", traitContribution: { quadrant_a: 0.25, quadrant_b: 0.6, quadrant_c: 0.35, quadrant_d: 0.1 } },
        ],
        description: "mediating a conflict between two coworkers from two DMs and no other context",
      },
      {
        type: "choice",
        id: "deliver_feedback",
        chapterId: "executive",
        title: "Deliver the feedback",
        prompt: "Your report's numbers were wrong in front of the client. You need to give them feedback before the next meeting in 2 days.",
        confirmLabel: "Go with this",
        options: [
          { id: "step_by_step", label: "Walk through exactly what was wrong and why, step by step.", traitContribution: { quadrant_a: 0.75, quadrant_b: 0.35, quadrant_c: 0.6, quadrant_d: 0.1 } },
          { id: "praise_first", label: "Start with what they did well, then get into the error.", traitContribution: { quadrant_a: 0.4, quadrant_b: 0.25, quadrant_c: 0.9, quadrant_d: 0.15 } },
          { id: "ask_process", label: "Ask them to walk you through their process first.", traitContribution: { quadrant_a: 0.45, quadrant_b: 0.2, quadrant_c: 0.85, quadrant_d: 0.25 } },
          { id: "keep_brief", label: "Keep it brief: just flag the error and the fix, move on.", traitContribution: { quadrant_a: 0.7, quadrant_b: 0.5, quadrant_c: 0.35, quadrant_d: 0.1 } },
        ],
        description: "giving feedback after a direct report's error reached a client",
      },
      {
        type: "timedSelect",
        id: "read_the_room",
        chapterId: "executive",
        title: "Read the room",
        prompt: "Stand-up just ended. One teammate needs a check-in before the day gets away from you. Skim the last hour of messages: who is it?",
        items: [
          { id: "pr_up", primaryLabel: "\"on it, will have the PR up by 2\"", secondaryLabel: "", correct: false },
          { id: "rough_morning", primaryLabel: "\"sorry, having a rough morning, might be a bit slow today\"", secondaryLabel: "", correct: true },
          { id: "shipped_fix", primaryLabel: "\"shipped the fix, tests passing\"", secondaryLabel: "", correct: false },
          { id: "push_1on1", primaryLabel: "\"can we push the 1:1 to tomorrow? swamped\"", secondaryLabel: "", correct: false },
          { id: "no_updates", primaryLabel: "\"no updates from me, all good\"", secondaryLabel: "", correct: false },
          { id: "after_lunch", primaryLabel: "\"will circle back after lunch\"", secondaryLabel: "", correct: false },
        ],
        timeLimitMs: 15000,
        correctContribution: { quadrant_a: 0.1, quadrant_b: 0.15, quadrant_c: 0.95, quadrant_d: 0.45 },
        incorrectContribution: { quadrant_a: 0.15, quadrant_b: 0.2, quadrant_c: 0.5, quadrant_d: 0.25 },
        confirmVerb: "Check in on",
        description: "spotting who on the team needed a check-in from a stream of Slack messages",
      },
    ],
  },
  {
    id: "founder",
    name: "Founder",
    intro: "A founder's budget.",
    quadrantLabel: "Quadrant D: Imaginative",
    focus:
      "This chapter is built around imaginative thinking: the big-picture, intuitive, risk-embracing way some people build under uncertainty. The three moments ahead reward vision and conviction over caution.",
    caseStudy:
      "Eight months after launch, the seed money is finite and the calendar keeps moving whether the product is ready or not. You're the one who has to decide where the next dollar and the next month go.",
    scenes: [
      {
        type: "allocation",
        id: "allocate_runway",
        chapterId: "founder",
        title: "Allocate your runway",
        prompt: "You've got 100 points of budget and six months of runway left. Split it however you want. There's no correct answer here.",
        categories: [
          { id: "product", label: "Product", hint: "Build the next feature customers are asking for" },
          { id: "marketing", label: "Marketing & Growth", hint: "Spend to acquire more users, fast" },
          { id: "hiring", label: "Hiring", hint: "Bring on people before you're underwater" },
          { id: "runway", label: "Runway / Savings", hint: "Keep cash in the bank in case things go sideways" },
        ],
        concentrationQuadrant: "quadrant_d",
        balanceQuadrant: "quadrant_b",
        balanceCategoryId: "runway",
        confirmLabel: "Ship this plan",
        description: "allocating a startup's budget across product, marketing, hiring, and runway",
      },
      {
        type: "choice",
        id: "pick_the_bet",
        chapterId: "founder",
        title: "Pick the bet",
        prompt: "You've got budget for exactly one experiment this quarter. Which do you greenlight?",
        confirmLabel: "Greenlight it",
        options: [
          { id: "enterprise_ask", label: "The feature every enterprise prospect keeps asking for.", traitContribution: { quadrant_a: 0.65, quadrant_b: 0.5, quadrant_c: 0.3, quadrant_d: 0.4 } },
          { id: "wild_idea", label: "The wild idea that could 10x growth but might flop.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.1, quadrant_c: 0.15, quadrant_d: 0.97 } },
          { id: "customer_interviews", label: "Whatever your best customer interviews point to.", traitContribution: { quadrant_a: 0.5, quadrant_b: 0.25, quadrant_c: 0.6, quadrant_d: 0.55 } },
          { id: "cheap_tests", label: "Run a cheap 2-week test on 3 different ideas before committing.", traitContribution: { quadrant_a: 0.75, quadrant_b: 0.45, quadrant_c: 0.15, quadrant_d: 0.6 } },
        ],
        description: "choosing which single experiment to bet the quarter's budget on",
      },
      {
        type: "choice",
        id: "pivot_or_persist",
        chapterId: "founder",
        title: "Pivot or persist",
        prompt: "Growth has been flat for 6 weeks. Half your team thinks you should pivot the core product. The other half says stay the course and fix onboarding.",
        confirmLabel: "Make the call",
        options: [
          { id: "pivot", label: "Pivot: flat growth for 6 weeks is a real signal.", traitContribution: { quadrant_a: 0.35, quadrant_b: 0.1, quadrant_c: 0.2, quadrant_d: 0.95 } },
          { id: "fix_onboarding", label: "Stay the course, fix onboarding first, revisit in a month.", traitContribution: { quadrant_a: 0.5, quadrant_b: 0.6, quadrant_c: 0.3, quadrant_d: 0.35 } },
          { id: "call_churned_users", label: "Get on calls with 10 churned users this week before deciding.", traitContribution: { quadrant_a: 0.45, quadrant_b: 0.25, quadrant_c: 0.75, quadrant_d: 0.5 } },
          { id: "split_team", label: "Split the team: half on a pivot prototype, half on onboarding.", traitContribution: { quadrant_a: 0.35, quadrant_b: 0.4, quadrant_c: 0.35, quadrant_d: 0.7 } },
        ],
        description: "deciding whether to pivot the product after six weeks of flat growth",
      },
    ],
  },
];

export const TOTAL_SCENES = CHAPTERS.reduce((sum, c) => sum + c.scenes.length, 0);
