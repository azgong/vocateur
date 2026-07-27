// Backfills occupations.trait_profile.builder_instinct (0-1, 0.5 neutral) with a
// per-title score, individually reasoned rather than keyword-matched: how much
// this role is genuinely hands-on, iterative, build-to-learn work versus
// analytical/advisory/administrative work. Deterministic and idempotent, safe
// to re-run after adding occupations (existing titles just get overwritten
// with the same score; new titles need adding to SCORES below first).
//
// Usage: node scripts/backfill_builder_instinct.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envRaw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SCORES = {
  "Actuary": 0.15,
  "Aerospace Engineer": 0.9,
  "AI Research Scientist": 0.55,
  "AI Safety Researcher": 0.45,
  "Air Traffic Controller": 0.55,
  "Airline Pilot": 0.6,
  "Anesthesiologist": 0.7,
  "Architect": 0.75,
  "Astronaut": 0.85,
  "Astrophysicist": 0.35,
  "Barista / Cafe Manager": 0.7,
  "Behavioral / Clinical Psychologist": 0.2,
  "Bioinformatics Scientist": 0.55,
  "Biomedical Engineer": 0.85,
  "Biomedical Researcher": 0.6,
  "Biotech Research Scientist": 0.6,
  "Biotech Startup Founder": 0.5,
  "Blockchain Developer": 0.75,
  "Brand Manager": 0.2,
  "Business Development Manager": 0.2,
  "Cardiologist": 0.65,
  "Chef / Executive Chef": 0.85,
  "Chemical Engineer": 0.8,
  "Chief Executive Officer": 0.2,
  "Chief Financial Officer": 0.15,
  "Chief Innovation Officer": 0.3,
  "Chief Marketing Officer": 0.2,
  "Chief of Staff": 0.2,
  "Chief Operating Officer": 0.25,
  "Civil Engineer": 0.85,
  "Client Success Director (SaaS/Tech)": 0.2,
  "Climate Scientist": 0.45,
  "Clinical Research Associate": 0.3,
  "Clinical Trials / Drug Development Manager": 0.3,
  "Cloud Solutions Architect": 0.7,
  "Commercial Pilot (Charter/Cargo)": 0.6,
  "Compliance Officer": 0.15,
  "Computer Vision Engineer": 0.75,
  "Concierge Medicine Physician": 0.45,
  "Corporate Finance Analyst (FP&A)": 0.15,
  "Corporate Lawyer (Transactional)": 0.1,
  "Corporate Strategy Manager": 0.2,
  "Creative Director (Advertising)": 0.35,
  "Credit Analyst": 0.15,
  "Cybersecurity Analyst": 0.65,
  "Data Architect / DBA": 0.65,
  "Data Engineer": 0.75,
  "Data Scientist": 0.55,
  "Dental Hygienist": 0.8,
  "Dentist": 0.85,
  "Dermatologist": 0.55,
  "DevOps / Site Reliability Engineer": 0.75,
  "Diplomat / Foreign Service Officer": 0.15,
  "Economic / Policy Consultant": 0.15,
  "Economist": 0.15,
  "Electrical Engineer": 0.85,
  "Electrician": 0.95,
  "Elementary School Teacher": 0.35,
  "Embedded Systems Engineer": 0.85,
  "Emergency Medicine Physician": 0.75,
  "Emerging Technology / Innovation Analyst": 0.3,
  "Engineering Manager": 0.45,
  "Environmental Engineer": 0.75,
  "Environmental Scientist": 0.45,
  "Epidemiologist / Public Health Analyst": 0.3,
  "Equity Research Analyst": 0.15,
  "Event Planner": 0.3,
  "Executive Coach": 0.15,
  "Executive Recruiter": 0.15,
  "Family Medicine Physician": 0.55,
  "Fashion Designer": 0.7,
  "FBI Special Agent": 0.45,
  "Film / TV Director": 0.5,
  "Firefighter": 0.6,
  "Flight Test Engineer": 0.85,
  "Game Designer": 0.65,
  "Genetic Counselor": 0.2,
  "Genetic Engineer": 0.75,
  "Graphic Designer": 0.55,
  "Growth Product Manager": 0.35,
  "Healthcare Consultant": 0.2,
  "Hedge Fund Analyst": 0.15,
  "Hospital Administrator": 0.2,
  "Human Resources / People Director": 0.15,
  "In-House Corporate Counsel": 0.1,
  "Industrial Designer": 0.8,
  "Industrial Engineer": 0.75,
  "Innovation Consultant": 0.25,
  "Intellectual Property / Patent Attorney": 0.15,
  "Intelligence Analyst": 0.2,
  "Investment Banking Analyst": 0.15,
  "IT / Technology Consultant": 0.5,
  "Litigation Attorney": 0.1,
  "Logistics / Supply Chain Manager": 0.3,
  "M&A Analyst": 0.15,
  "Machine Learning Engineer": 0.7,
  "Major Gifts / Philanthropy Officer": 0.15,
  "Management Consultant": 0.2,
  "Marketing Manager": 0.2,
  "Materials Science Engineer": 0.8,
  "Mechanical Engineer": 0.9,
  "Medical Science Liaison": 0.25,
  "Mergers & Acquisitions Lawyer": 0.1,
  "Mission Operations Engineer": 0.7,
  "Mobile App Developer": 0.75,
  "National Lab Research Scientist": 0.6,
  "Network Engineer": 0.7,
  "Neurologist": 0.4,
  "Neuroscientist": 0.5,
  "Neurosurgeon": 0.85,
  "Nuclear Engineer": 0.75,
  "Nurse Anesthetist (CRNA)": 0.7,
  "Nurse Practitioner": 0.6,
  "OB/GYN Physician": 0.7,
  "Occupational Therapist": 0.6,
  "Oncologist": 0.4,
  "Ophthalmologist": 0.65,
  "Operations Manager": 0.3,
  "Optometrist": 0.55,
  "Orthodontist": 0.8,
  "Orthopedic Surgeon": 0.85,
  "Pediatrician": 0.5,
  "Petroleum Engineer": 0.75,
  "Pharmaceutical Scientist": 0.55,
  "Pharmacist": 0.5,
  "Pharmacologist": 0.45,
  "Physical Therapist": 0.65,
  "Physician Assistant": 0.55,
  "Physician-Scientist (MD-PhD)": 0.5,
  "Physicist": 0.4,
  "Plastic Surgeon": 0.85,
  "Plumber": 0.95,
  "Police Officer": 0.4,
  "Portfolio Manager": 0.15,
  "Private Equity Associate": 0.15,
  "Private Wealth Relationship Director": 0.15,
  "Product Manager (Tech)": 0.4,
  "Product Marketing Manager": 0.2,
  "Psychiatrist": 0.2,
  "Public Accountant / Auditor": 0.15,
  "Quantitative Analyst": 0.3,
  "Quantitative Developer": 0.55,
  "Quantum Computing Researcher": 0.55,
  "Radiologist": 0.4,
  "Real Estate Agent": 0.25,
  "Real Estate Investment Analyst": 0.15,
  "Registered Nurse": 0.6,
  "Regulatory / Compliance Attorney": 0.1,
  "Regulatory Affairs Specialist (Biotech/Pharma)": 0.2,
  "Research Mathematician": 0.15,
  "Risk Analyst (Financial)": 0.15,
  "Robotics Engineer": 0.95,
  "Rocket Propulsion Engineer": 0.9,
  "Sales & Trading Associate": 0.2,
  "Sales Director": 0.2,
  "Sales Engineer": 0.6,
  "Satellite Systems Engineer": 0.85,
  "Screenwriter": 0.15,
  "Semiconductor Chip Design Engineer": 0.8,
  "Software Engineer": 0.75,
  "Spacecraft GNC Engineer": 0.85,
  "Startup CTO / Technical Co-Founder": 0.8,
  "Startup Founder / Entrepreneur": 0.5,
  "Statistician": 0.2,
  "Strategy Consultant": 0.15,
  "Structural Engineer": 0.85,
  "Surgeon": 0.9,
  "Tax Attorney": 0.1,
  "Technical Program Manager": 0.4,
  "Think Tank Policy Researcher": 0.15,
  "Treasury Analyst": 0.15,
  "University Professor": 0.35,
  "Urban Planner": 0.5,
  "UX / Product Designer": 0.6,
  "Venture Capitalist": 0.2,
  "Venture Studio Partner": 0.25,
  "Veterinarian": 0.85,
  "Wealth Manager / Financial Advisor": 0.15,
};

const { data: occupations, error } = await admin.from("occupations").select("id, title, trait_profile");
if (error) throw error;

let updated = 0;
let missing = [];
for (const occ of occupations) {
  const score = SCORES[occ.title];
  if (score === undefined) {
    missing.push(occ.title);
    continue;
  }
  const { error: updErr } = await admin
    .from("occupations")
    .update({ trait_profile: { ...occ.trait_profile, builder_instinct: score } })
    .eq("id", occ.id);
  if (updErr) throw updErr;
  updated++;
}

console.log(`Updated ${updated} of ${occupations.length} occupations.`);
if (missing.length > 0) {
  console.log("MISSING SCORES FOR:", missing.join(", "));
  process.exit(1);
}
