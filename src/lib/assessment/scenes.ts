import { TraitVector } from "./types";

// A "chapter" is one of five narrative worlds (Analyst/Physician/Executive/Founder/Builder).
// Each chapter runs 7 scenes. No scene is a pure single-instinct test: every scene's
// trait contributions blend a primary instinct with a meaningful secondary one, and the
// UI never labels a scene by trait name, so there's nothing for a user to
// reverse-engineer and answer strategically toward.
export type ChapterId = "analyst" | "physician" | "executive" | "founder" | "builder";

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

export type DragRankSceneConfig = {
  type: "dragRank";
  id: string;
  chapterId: ChapterId;
  title: string;
  prompt: string;
  items: RankingItem[];
  correctOrder: string[];
  primaryQuadrant: keyof TraitVector;
  secondaryQuadrant: keyof TraitVector;
  confirmLabel: string;
  description: string;
};

export type SceneConfig =
  | ChoiceSceneConfig
  | TimedSelectSceneConfig
  | RankingSceneConfig
  | AllocationSceneConfig
  | DragRankSceneConfig;

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
    quadrantLabel: "The analytical instinct",
    focus:
      "This chapter is built around analytical thinking: the logical, fact-based, data-first way some people naturally approach problems. The seven moments ahead reward rigor and evidence over gut instinct.",
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
      {
        type: "ranking",
        id: "sequence_diligence",
        chapterId: "analyst",
        title: "Sequence the diligence",
        prompt: "The partner wants a go or no-go recommendation on an acquisition target by Friday. Five workstreams are still open. Order them by which should be tackled first to surface a dealbreaker fastest.",
        displayOrder: [
          { id: "audit", primaryLabel: "Reconcile the financial statements", secondaryLabel: "Check if the numbers actually tie out" },
          { id: "legal", primaryLabel: "Review legal and regulatory exposure", secondaryLabel: "Any pending litigation or compliance issues" },
          { id: "customer_concentration", primaryLabel: "Check customer concentration", secondaryLabel: "How much revenue rides on the top 3 clients" },
          { id: "management_background", primaryLabel: "Vet the founding team's background", secondaryLabel: "Reference checks and past ventures" },
          { id: "competitive_landscape", primaryLabel: "Map the competitive landscape", secondaryLabel: "Who else is eating this market" },
        ],
        correctOrder: ["audit", "legal", "customer_concentration", "management_background", "competitive_landscape"],
        primaryQuadrant: "quadrant_a",
        secondaryQuadrant: "quadrant_b",
        description: "sequencing five diligence workstreams to surface a dealbreaker fastest",
      },
      {
        type: "choice",
        id: "model_midnight",
        chapterId: "analyst",
        title: "The model doesn't tie out",
        prompt: "It's midnight. The pitch is at 9am. Your model is off by $2M and you can't find the error. What do you do?",
        confirmLabel: "Go with this",
        options: [
          { id: "rebuild_from_scratch", label: "Rebuild the model from scratch, checking every formula.", traitContribution: { quadrant_a: 0.95, quadrant_b: 0.55, quadrant_c: 0.05, quadrant_d: 0.15 } },
          { id: "sleep_on_it", label: "Stop, sleep on it, and look again with fresh eyes at 6am.", traitContribution: { quadrant_a: 0.5, quadrant_b: 0.4, quadrant_c: 0.15, quadrant_d: 0.45 } },
          { id: "flag_the_partner", label: "Message the partner now and flag the discrepancy honestly.", traitContribution: { quadrant_a: 0.55, quadrant_b: 0.3, quadrant_c: 0.75, quadrant_d: 0.15 } },
          { id: "estimate_and_footnote", label: "Estimate the gap, footnote the assumption, and move on.", traitContribution: { quadrant_a: 0.4, quadrant_b: 0.25, quadrant_c: 0.15, quadrant_d: 0.75 } },
        ],
        description: "deciding how to handle a model that doesn't tie out the night before a pitch",
      },
      {
        type: "timedSelect",
        id: "catch_memo_error",
        chapterId: "analyst",
        title: "Catch the error in the memo",
        prompt: "This memo goes to the client in ten minutes. Skim it once. One line has an error that doesn't belong. Find it.",
        items: [
          { id: "rev_line", primaryLabel: "Revenue grew 12% year over year to $4.2M.", secondaryLabel: "", correct: false },
          { id: "margin_line", primaryLabel: "Gross margin held steady at 61% for the third straight quarter.", secondaryLabel: "", correct: false },
          { id: "headcount_line", primaryLabel: "Headcount grew from 40 to 52 employees this quarter.", secondaryLabel: "", correct: false },
          { id: "typo_line", primaryLabel: "Customer churn dropped to 400% from 6% last quarter.", secondaryLabel: "", correct: true },
          { id: "cash_line", primaryLabel: "Cash runway extended to 14 months after the bridge round.", secondaryLabel: "", correct: false },
          { id: "nps_line", primaryLabel: "Net promoter score rose 8 points to 42.", secondaryLabel: "", correct: false },
        ],
        timeLimitMs: 15000,
        correctContribution: { quadrant_a: 0.9, quadrant_b: 0.4, quadrant_c: 0.1, quadrant_d: 0.15 },
        incorrectContribution: { quadrant_a: 0.5, quadrant_b: 0.3, quadrant_c: 0.15, quadrant_d: 0.2 },
        confirmVerb: "Flag",
        description: "catching an erroneous line in a client memo before it goes out",
      },
      {
        type: "dragRank",
        id: "weigh_the_evidence",
        chapterId: "analyst",
        title: "Weigh the evidence",
        prompt:
          "The partner wants one number for the client: last year's true revenue. Four sources disagree. Drag them into the order you'd trust, most reliable on top, then lock it in.",
        items: [
          { id: "deck", primaryLabel: "The founder's fundraising deck", secondaryLabel: "Prepared to impress investors" },
          { id: "bank", primaryLabel: "Bank statements for the year", secondaryLabel: "Raw inflows, unreconciled" },
          { id: "audited", primaryLabel: "Audited financial statements", secondaryLabel: "Signed off by a Big Four firm last quarter" },
          { id: "crm", primaryLabel: "The internal CRM export", secondaryLabel: "Self-reported by the sales team" },
        ],
        correctOrder: ["audited", "bank", "crm", "deck"],
        primaryQuadrant: "quadrant_a",
        secondaryQuadrant: "quadrant_b",
        confirmLabel: "Lock in the order",
        description: "ranking four conflicting revenue sources by evidentiary reliability",
      },
    ],
  },
  {
    id: "physician",
    name: "Physician",
    intro: "An ER shift.",
    quadrantLabel: "The sequential instinct",
    focus:
      "This chapter is built around sequential thinking: the structured, detail-oriented, process-driven way some people operate under pressure. The seven moments ahead reward order, precision, and following (or knowingly breaking) protocol.",
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
      {
        type: "choice",
        id: "consult_conflict",
        chapterId: "physician",
        title: "The consult that doesn't add up",
        prompt: "A specialist's consult note recommends a treatment that conflicts with your own read of the labs. The patient is stable, but you need a decision before rounds in 20 minutes.",
        confirmLabel: "Go with this",
        options: [
          { id: "follow_protocol", label: "Follow the standard protocol for this diagnosis exactly.", traitContribution: { quadrant_a: 0.5, quadrant_b: 0.9, quadrant_c: 0.2, quadrant_d: 0.1 } },
          { id: "call_specialist", label: "Call the specialist directly to reconcile the two reads.", traitContribution: { quadrant_a: 0.5, quadrant_b: 0.45, quadrant_c: 0.75, quadrant_d: 0.2 } },
          { id: "order_one_more_test", label: "Order one more targeted test before deciding.", traitContribution: { quadrant_a: 0.85, quadrant_b: 0.55, quadrant_c: 0.15, quadrant_d: 0.2 } },
          { id: "trust_own_read", label: "Trust your own read of the labs and proceed.", traitContribution: { quadrant_a: 0.6, quadrant_b: 0.35, quadrant_c: 0.15, quadrant_d: 0.65 } },
        ],
        description: "deciding between your own read and a specialist's conflicting recommendation before rounds",
      },
      {
        type: "timedSelect",
        id: "drug_interaction",
        chapterId: "physician",
        title: "Spot the drug interaction",
        prompt: "A new medication order just came in for a patient already on three others. Scan the list, one combination is dangerous. Which one?",
        items: [
          { id: "combo1", primaryLabel: "Acetaminophen + Ibuprofen", secondaryLabel: "", correct: false },
          { id: "combo2", primaryLabel: "Lisinopril + Metformin", secondaryLabel: "", correct: false },
          { id: "combo3", primaryLabel: "Warfarin + new NSAID order", secondaryLabel: "", correct: true },
          { id: "combo4", primaryLabel: "Atorvastatin + Levothyroxine", secondaryLabel: "", correct: false },
          { id: "combo5", primaryLabel: "Amlodipine + Hydrochlorothiazide", secondaryLabel: "", correct: false },
          { id: "combo6", primaryLabel: "Omeprazole + Calcium supplement", secondaryLabel: "", correct: false },
        ],
        timeLimitMs: 15000,
        correctContribution: { quadrant_a: 0.5, quadrant_b: 0.9, quadrant_c: 0.1, quadrant_d: 0.15 },
        incorrectContribution: { quadrant_a: 0.3, quadrant_b: 0.55, quadrant_c: 0.15, quadrant_d: 0.15 },
        confirmVerb: "Flag",
        description: "catching a dangerous drug interaction in a new medication order under time pressure",
      },
      {
        type: "ranking",
        id: "restock_wave",
        chapterId: "physician",
        title: "Restock before the next wave",
        prompt: "You've got 5 minutes before the next ambulance wave hits. Rank these tasks by what actually matters most before patients arrive.",
        displayOrder: [
          { id: "notify_team", primaryLabel: "Notify the full team the wave is inbound", secondaryLabel: "So no one is caught off guard" },
          { id: "airway_cart", primaryLabel: "Confirm the airway cart is fully stocked", secondaryLabel: "Intubation kit, oxygen, suction" },
          { id: "bed_assignments", primaryLabel: "Clear and assign open beds", secondaryLabel: "Know exactly where new patients go" },
          { id: "gauze_restock", primaryLabel: "Restock gauze and basic supplies", secondaryLabel: "Routine but necessary" },
          { id: "chart_cleanup", primaryLabel: "Finish charting on discharged patients", secondaryLabel: "Paperwork from an hour ago" },
        ],
        correctOrder: ["notify_team", "airway_cart", "bed_assignments", "gauze_restock", "chart_cleanup"],
        primaryQuadrant: "quadrant_b",
        secondaryQuadrant: "quadrant_a",
        description: "prioritizing prep tasks in the five minutes before a new patient wave arrives",
      },
      {
        type: "dragRank",
        id: "order_the_handoff",
        chapterId: "physician",
        title: "Order the handoff",
        prompt:
          "Shift change in three minutes. You're handing four patients to the night team. Drag them into the order you'd brief them, riskiest overnight first.",
        items: [
          { id: "discharge_am", primaryLabel: "Stable patient due for morning discharge", secondaryLabel: "Paperwork already done" },
          { id: "sepsis_watch", primaryLabel: "Post-op patient trending febrile", secondaryLabel: "Could tip into sepsis overnight" },
          { id: "insulin", primaryLabel: "Diabetic patient on an insulin drip", secondaryLabel: "Needs glucose checks every hour" },
          { id: "chest_obs", primaryLabel: "Chest-pain patient under observation", secondaryLabel: "Second troponin test due at 2 AM" },
        ],
        correctOrder: ["sepsis_watch", "chest_obs", "insulin", "discharge_am"],
        primaryQuadrant: "quadrant_b",
        secondaryQuadrant: "quadrant_c",
        confirmLabel: "Hand off",
        description: "sequencing a shift-change handoff so the night team hears the riskiest patients first",
      },
    ],
  },
  {
    id: "executive",
    name: "Executive",
    intro: "A workplace conflict.",
    quadrantLabel: "The interpersonal instinct",
    focus:
      "This chapter is built around interpersonal thinking: the relational, emotionally attuned, people-first way some people lead. The seven moments ahead reward reading people and situations, not just the facts on the page.",
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
      {
        type: "ranking",
        id: "onboard_new_hire",
        chapterId: "executive",
        title: "Onboard the new hire",
        prompt: "A new report starts Monday. You have one hour to prep their first week. Rank these by what actually matters most for a strong start.",
        displayOrder: [
          { id: "laptop_access", primaryLabel: "Confirm laptop and system access works", secondaryLabel: "Basic logistics" },
          { id: "clear_priorities", primaryLabel: "Write down their top 3 priorities for the month", secondaryLabel: "So ambiguity doesn't stall them" },
          { id: "intro_team", primaryLabel: "Schedule 1:1 intros with each teammate", secondaryLabel: "So they feel like part of the group fast" },
          { id: "feedback_norms", primaryLabel: "Explain how and when you give feedback", secondaryLabel: "So critique doesn't land as a surprise later" },
          { id: "shadow_time", primaryLabel: "Block time for them to shadow a live meeting", secondaryLabel: "See how the team actually works" },
        ],
        correctOrder: ["laptop_access", "clear_priorities", "intro_team", "feedback_norms", "shadow_time"],
        primaryQuadrant: "quadrant_c",
        secondaryQuadrant: "quadrant_b",
        description: "prioritizing a new hire's first week for the strongest start",
      },
      {
        type: "choice",
        id: "reluctant_volunteer",
        chapterId: "executive",
        title: "The reluctant volunteer",
        prompt: "You need someone to lead a cross-team project nobody wants. One person on your team is capable but clearly reluctant. What do you do?",
        confirmLabel: "Go with this",
        options: [
          { id: "ask_directly", label: "Ask them directly and honestly why they're hesitant.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.25, quadrant_c: 0.9, quadrant_d: 0.2 } },
          { id: "assign_it", label: "Assign it. Sometimes the job needs to get done regardless.", traitContribution: { quadrant_a: 0.35, quadrant_b: 0.6, quadrant_c: 0.25, quadrant_d: 0.35 } },
          { id: "sweeten_the_deal", label: "Offer something that makes it worth their while.", traitContribution: { quadrant_a: 0.4, quadrant_b: 0.2, quadrant_c: 0.55, quadrant_d: 0.6 } },
          { id: "find_someone_else", label: "Look for a more willing volunteer first.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.3, quadrant_c: 0.65, quadrant_d: 0.25 } },
        ],
        description: "deciding how to handle a capable but reluctant volunteer for an unwanted project",
      },
      {
        type: "timedSelect",
        id: "promotion_review",
        chapterId: "executive",
        title: "Who needs the promotion conversation",
        prompt: "Performance reviews are due tomorrow. Skim these self-assessments fast. One person is clearly underselling themselves and needs you to push back before you finalize it.",
        items: [
          { id: "person_a", primaryLabel: "\"I hit all my targets this quarter, nothing major to flag.\"", secondaryLabel: "", correct: false },
          { id: "person_b", primaryLabel: "\"I guess I did okay, though I'm sure others carried more weight than me.\"", secondaryLabel: "", correct: true },
          { id: "person_c", primaryLabel: "\"Shipped the redesign two weeks early, feeling good about it.\"", secondaryLabel: "", correct: false },
          { id: "person_d", primaryLabel: "\"Missed one deadline, but the client extension made up for it.\"", secondaryLabel: "", correct: false },
          { id: "person_e", primaryLabel: "\"On track for everything, would like to discuss next steps.\"", secondaryLabel: "", correct: false },
        ],
        timeLimitMs: 15000,
        correctContribution: { quadrant_a: 0.1, quadrant_b: 0.15, quadrant_c: 0.95, quadrant_d: 0.35 },
        incorrectContribution: { quadrant_a: 0.15, quadrant_b: 0.2, quadrant_c: 0.5, quadrant_d: 0.2 },
        confirmVerb: "Flag",
        description: "spotting which teammate is underselling their own performance review before finalizing it",
      },
      {
        type: "dragRank",
        id: "sequence_conversations",
        chapterId: "executive",
        title: "Sequence the conversations",
        prompt:
          "Your best engineer just resigned in the middle of the all-hands, then walked out. Four conversations need to happen before end of day. Drag them into the order you'd take them.",
        items: [
          { id: "hr", primaryLabel: "HR", secondaryLabel: "Process, paperwork, and what you're allowed to say" },
          { id: "resigned_eng", primaryLabel: "The engineer who resigned", secondaryLabel: "Door closed, one on one" },
          { id: "ceo", primaryLabel: "Your own manager", secondaryLabel: "Will hear about it within the hour" },
          { id: "team", primaryLabel: "Their immediate team", secondaryLabel: "Six people who just watched it happen" },
        ],
        correctOrder: ["resigned_eng", "team", "ceo", "hr"],
        primaryQuadrant: "quadrant_c",
        secondaryQuadrant: "quadrant_b",
        confirmLabel: "Commit to the order",
        description: "choosing the human order of conversations after a public resignation",
      },
    ],
  },
  {
    id: "founder",
    name: "Founder",
    intro: "A founder's budget.",
    quadrantLabel: "The imaginative instinct",
    focus:
      "This chapter is built around imaginative thinking: the big-picture, intuitive, risk-embracing way some people build under uncertainty. The seven moments ahead reward vision and conviction over caution.",
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
      {
        type: "ranking",
        id: "investor_questions",
        chapterId: "founder",
        title: "Answer the investor's questions",
        prompt: "An investor update is due tonight. You only have time to properly answer 5 of their questions. Rank by what they'll actually care about most.",
        displayOrder: [
          { id: "burn_rate", primaryLabel: "What's your current burn rate and runway?", secondaryLabel: "The number every investor asks first" },
          { id: "biggest_risk", primaryLabel: "What's the biggest risk right now?", secondaryLabel: "Shows self-awareness" },
          { id: "big_win", primaryLabel: "What's the biggest win since the last update?", secondaryLabel: "Momentum signal" },
          { id: "hiring_plan", primaryLabel: "Who are you hiring next?", secondaryLabel: "Team-building signal" },
          { id: "competitor_move", primaryLabel: "What did a competitor just launch?", secondaryLabel: "Market awareness" },
        ],
        correctOrder: ["burn_rate", "biggest_risk", "big_win", "hiring_plan", "competitor_move"],
        primaryQuadrant: "quadrant_d",
        secondaryQuadrant: "quadrant_a",
        description: "prioritizing which investor questions matter most with limited time to answer",
      },
      {
        type: "choice",
        id: "cofounder_disagreement",
        chapterId: "founder",
        title: "The cofounder disagreement",
        prompt: "Your cofounder wants to raise a big round now. You think it's premature and dilutes too early. You need to align before the board call tomorrow.",
        confirmLabel: "Make the call",
        options: [
          { id: "raise_now", label: "Back the raise. Momentum and capital now beats caution.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.15, quadrant_c: 0.25, quadrant_d: 0.9 } },
          { id: "hold_off", label: "Hold off. Prove more traction first, raise on better terms later.", traitContribution: { quadrant_a: 0.65, quadrant_b: 0.55, quadrant_c: 0.2, quadrant_d: 0.35 } },
          { id: "bring_data", label: "Bring hard data to the conversation and let the numbers decide.", traitContribution: { quadrant_a: 0.9, quadrant_b: 0.45, quadrant_c: 0.25, quadrant_d: 0.3 } },
          { id: "align_privately", label: "Talk it through privately with your cofounder before the board sees any split.", traitContribution: { quadrant_a: 0.3, quadrant_b: 0.35, quadrant_c: 0.85, quadrant_d: 0.35 } },
        ],
        description: "resolving a disagreement with your cofounder about raising before a board call",
      },
      {
        type: "allocation",
        id: "demo_day_split",
        chapterId: "founder",
        title: "Split the demo day slot",
        prompt: "You've got 3 minutes on stage and 100 points of attention to give. Split it across what you actually want the room to remember.",
        categories: [
          { id: "vision", label: "The big vision", hint: "Where this goes in 5 years" },
          { id: "traction", label: "Traction and numbers", hint: "What's actually working right now" },
          { id: "team", label: "The team", hint: "Why you're the ones to do this" },
          { id: "ask", label: "The ask", hint: "What you actually need from the room" },
        ],
        concentrationQuadrant: "quadrant_d",
        balanceQuadrant: "quadrant_a",
        balanceCategoryId: "traction",
        confirmLabel: "Lock in the pitch",
        description: "allocating a 3-minute demo day pitch across vision, traction, team, and the ask",
      },
      {
        type: "dragRank",
        id: "spend_the_runway",
        chapterId: "founder",
        title: "Spend the runway",
        prompt:
          "Ten weeks of cash left and four moves on the table. Drag them into the order that buys the most learning per week, fastest first.",
        items: [
          { id: "onboarding", primaryLabel: "Rebuild onboarding end to end", secondaryLabel: "Three weeks of engineering" },
          { id: "churn_calls", primaryLabel: "Call the last five customers who quit", secondaryLabel: "A day of brutal but free feedback" },
          { id: "deck", primaryLabel: "Polish the fundraising deck", secondaryLabel: "Only matters if the numbers improve" },
          { id: "pricing_test", primaryLabel: "Run a pricing test on the site", secondaryLabel: "Two days to ship, a week to read" },
        ],
        correctOrder: ["churn_calls", "pricing_test", "onboarding", "deck"],
        primaryQuadrant: "quadrant_d",
        secondaryQuadrant: "quadrant_a",
        confirmLabel: "Run it",
        description: "sequencing scarce runway toward the fastest validated learning",
      },
    ],
  },
  {
    id: "builder",
    name: "Builder",
    intro: "A prototype deadline.",
    quadrantLabel: "The hands-on instinct",
    focus:
      "This chapter is built around hands-on thinking: the tactile, iterative, build-to-learn way some people solve problems with their hands as much as their head. The seven moments ahead reward tinkering, prototyping, and learning by doing over theorizing from a distance.",
    caseStudy:
      "You're the only one on a four-person team who can actually open the prototype up and find out why it's not working. The investor demo is in four days, the enclosure barely closes, and the only way through is one hands-on test at a time.",
    scenes: [
      {
        type: "choice",
        id: "chase_intermittent_fault",
        chapterId: "builder",
        title: "Chase the intermittent fault",
        prompt: "The prototype cuts out randomly, maybe once every ten minutes, no pattern you can see yet. Demo is in four days. What's your first move?",
        confirmLabel: "Go with this",
        options: [
          { id: "wiggle_test", label: "Open it up and wiggle every connector while it's powered, watching for the cutout.", traitContribution: { builder_instinct: 0.95, quadrant_d: 0.4, quadrant_a: 0.2, quadrant_b: 0.15 } },
          { id: "log_everything", label: "Write a script to log every sensor reading so the failure shows up in data, not guesswork.", traitContribution: { quadrant_a: 0.85, builder_instinct: 0.45, quadrant_b: 0.4 } },
          { id: "reread_datasheets", label: "Re-read the component datasheets for anything wired wrong.", traitContribution: { quadrant_b: 0.7, quadrant_a: 0.5, builder_instinct: 0.3 } },
          { id: "call_vendor", label: "Message the vendor support line and ask if this is a known issue with the board.", traitContribution: { quadrant_c: 0.55, quadrant_a: 0.3, builder_instinct: 0.15 } },
        ],
        description: "deciding how to start chasing an intermittent hardware fault four days before a demo",
      },
      {
        type: "timedSelect",
        id: "find_open_joint",
        chapterId: "builder",
        title: "Find the open joint",
        prompt: "You're testing continuity across every joint on the board with a multimeter before the enclosure closes for good. One reads open when it shouldn't. Find it before the battery on the meter gives out.",
        items: [
          { id: "power_rail", primaryLabel: "Joint 1, power rail", secondaryLabel: "0.2Ω, continuous", correct: false },
          { id: "ground", primaryLabel: "Joint 2, ground", secondaryLabel: "0.1Ω, continuous", correct: false },
          { id: "sensor_bus", primaryLabel: "Joint 3, sensor bus", secondaryLabel: "0.3Ω, continuous", correct: false },
          { id: "motor_driver", primaryLabel: "Joint 4, motor driver", secondaryLabel: "open circuit, no continuity", correct: true },
          { id: "status_led", primaryLabel: "Joint 5, status LED", secondaryLabel: "0.4Ω, continuous", correct: false },
          { id: "battery_lead", primaryLabel: "Joint 6, battery lead", secondaryLabel: "0.15Ω, continuous", correct: false },
        ],
        timeLimitMs: 18000,
        correctContribution: { builder_instinct: 0.95, quadrant_a: 0.5, quadrant_b: 0.3, quadrant_d: 0.1 },
        incorrectContribution: { builder_instinct: 0.5, quadrant_a: 0.3, quadrant_b: 0.2, quadrant_d: 0.1 },
        confirmVerb: "Mark it",
        description: "spotting the open joint in a continuity test under a countdown",
      },
      {
        type: "choice",
        id: "bracket_doesnt_fit",
        chapterId: "builder",
        title: "The part doesn't fit",
        prompt: "The 3D-printed bracket you designed doesn't fit the motor mount, off by about 2mm. The print farm is booked solid for two days. What do you do?",
        confirmLabel: "Go with this",
        options: [
          { id: "file_by_hand", label: "File and sand the bracket down by hand until it fits, right now.", traitContribution: { builder_instinct: 0.95, quadrant_d: 0.3, quadrant_b: 0.2 } },
          { id: "redo_cad", label: "Redo the CAD model precisely, requeue the print, and wait the two days.", traitContribution: { quadrant_b: 0.75, quadrant_a: 0.5, builder_instinct: 0.4 } },
          { id: "design_shim", label: "Design a thin shim to make up the 2mm instead of remaking the whole part.", traitContribution: { builder_instinct: 0.8, quadrant_a: 0.5, quadrant_d: 0.35 } },
          { id: "ask_around", label: "Ask around if anyone has a spare part close enough to swap in.", traitContribution: { quadrant_c: 0.6, builder_instinct: 0.25 } },
        ],
        description: "deciding how to handle a physical part that doesn't fit two days before a print slot opens up",
      },
      {
        type: "ranking",
        id: "order_the_build",
        chapterId: "builder",
        title: "Order the build",
        prompt: "Four subsystems still need final assembly before the enclosure closes for good. Order them by which should go in last, so you're never tearing something apart to fix what's underneath it.",
        displayOrder: [
          { id: "battery", primaryLabel: "Battery pack", secondaryLabel: "Sits at the very bottom of the stack" },
          { id: "mainboard", primaryLabel: "Main control board", secondaryLabel: "Mounts directly over the battery" },
          { id: "wiring", primaryLabel: "Sensor wiring harness", secondaryLabel: "Routes around and connects everything" },
          { id: "enclosure_lid", primaryLabel: "Enclosure lid and latches", secondaryLabel: "Closes the whole thing up" },
        ],
        correctOrder: ["battery", "mainboard", "wiring", "enclosure_lid"],
        primaryQuadrant: "builder_instinct",
        secondaryQuadrant: "quadrant_b",
        description: "sequencing final assembly so nothing has to be undone to fix what's underneath",
      },
      {
        type: "allocation",
        id: "allocate_final_hours",
        chapterId: "builder",
        title: "Allocate the last 48 hours",
        prompt: "48 hours before the demo. 100 points of effort left to spend. Split it across what actually needs it.",
        categories: [
          { id: "reliability", label: "Fixing the intermittent cutout", hint: "The thing that could embarrass you on stage" },
          { id: "polish", label: "Cosmetic fit and finish", hint: "How it looks and feels in someone's hands" },
          { id: "backup_plan", label: "Preparing a backup demo path", hint: "In case the hardware just doesn't cooperate" },
          { id: "rehearsal", label: "Rehearsing the pitch itself", hint: "How you'll talk through what it does" },
        ],
        concentrationQuadrant: "builder_instinct",
        balanceQuadrant: "quadrant_b",
        balanceCategoryId: "rehearsal",
        confirmLabel: "Lock in the split",
        description: "allocating the final 48 hours before a demo across reliability, polish, backup plan, and rehearsal",
      },
      {
        type: "choice",
        id: "sensor_disagreement",
        chapterId: "builder",
        title: "Two engineers disagree",
        prompt: "Your co-founder wants to scrap the current sensor for a different model, worried it won't hold up on stage. You think it just needs a firmware fix. Two days left. What do you do?",
        confirmLabel: "Go with this",
        options: [
          { id: "prove_the_fix", label: "Spend a few hours proving the firmware fix actually works before agreeing to anything.", traitContribution: { builder_instinct: 0.9, quadrant_a: 0.5, quadrant_d: 0.15 } },
          { id: "trust_cofounder", label: "Trust their instinct and start integrating the new sensor today.", traitContribution: { quadrant_c: 0.55, quadrant_d: 0.4, builder_instinct: 0.3 } },
          { id: "run_both", label: "Run both in parallel today and decide tonight based on what's actually working.", traitContribution: { builder_instinct: 0.85, quadrant_d: 0.55, quadrant_a: 0.3 } },
          { id: "escalate_vote", label: "Bring it to the rest of the team and let a vote decide.", traitContribution: { quadrant_c: 0.7, quadrant_b: 0.3, builder_instinct: 0.1 } },
        ],
        description: "resolving a technical disagreement with a co-founder two days before a demo",
      },
      {
        type: "dragRank",
        id: "rank_likely_culprits",
        chapterId: "builder",
        title: "Rank the likely culprits",
        prompt: "The cutout is still happening. Four things could be causing it. Drag them into the order you'd actually test first, most likely culprit on top.",
        items: [
          { id: "battery_connector", primaryLabel: "Loose battery connector", secondaryLabel: "Most common cause of intermittent power loss" },
          { id: "solder_joint", primaryLabel: "A cold solder joint from assembly", secondaryLabel: "You did the soldering yourself, late at night" },
          { id: "interference", primaryLabel: "Electromagnetic interference from the motor", secondaryLabel: "Only shows up under specific conditions" },
          { id: "firmware_bug", primaryLabel: "A firmware bug in the power management code", secondaryLabel: "Possible, but you tested this path last week" },
        ],
        correctOrder: ["battery_connector", "solder_joint", "interference", "firmware_bug"],
        primaryQuadrant: "builder_instinct",
        secondaryQuadrant: "quadrant_a",
        confirmLabel: "Start testing",
        description: "ranking four possible causes of an intermittent hardware fault by how likely and how testable each is",
      },
    ],
  },
];

export const TOTAL_SCENES = CHAPTERS.reduce((sum, c) => sum + c.scenes.length, 0);
