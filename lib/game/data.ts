import type { DistrictId, DistrictScene } from "@/lib/game/types";

export const districtOrder: DistrictId[] = ["docs", "debug", "sql", "regex", "commit"];

export const districtScenes: DistrictScene[] = [
  {
    id: "docs",
    code: "D-01",
    title: "Docs District",
    subtitle: "The manuals still glow, but half the meaning is gone.",
    accent: "var(--docs)",
    difficulty: "Low",
    threatLevel: 2,
    description:
      "Documentation terminals were rewritten by Hallucination. They sound helpful, but skip structure, examples, and edge-case notes.",
    focus: "Ask for structure, examples, and output constraints.",
    brief:
      "A junior engineer needs API docs for a `resetSession` endpoint. The AI answer looks polished but does not define the request format or failure cases.",
    aiResponse:
      "The `resetSession` endpoint resets the user session and should be used when needed. It returns a success response and improves security. Developers can call it after login issues. It is straightforward to integrate and recommended for all clients.",
    risk: "The team can implement the endpoint incorrectly because required fields, error states, and contract details are missing.",
    signalTip: "When an answer claims to be documentation, force it into an API contract.",
    verifyChecklist: [
      "Request method, route, auth assumptions, and body fields.",
      "Demand one success example and at least one failure example.",
      "Check whether edge cases and response schema are explicit.",
    ],
    incorrectConsequence: "A polished paragraph ships, but the API contract is still undefined.",
    validatorOptions: [
      {
        id: "docs-praise",
        label: "Ship it as-is",
        detail: "The answer is clear enough and sounds professional.",
      },
      {
        id: "docs-format",
        label: "Request explicit structure",
        detail: "Ask for method, path, request body, response schema, and failure examples.",
      },
      {
        id: "docs-tone",
        label: "Ask for shorter wording",
        detail: "Make the text more concise but keep the same content.",
      },
    ],
    correctOptionId: "docs-format",
    explanation:
      "The problem is not tone. The answer fails because it hides the operational details that make documentation usable. Validation means forcing the model to provide structure, examples, and error cases.",
    lesson: "A useful AI answer is specific, testable, and structured.",
    rewardLabel: "Spec Signal Restored",
  },
  {
    id: "debug",
    code: "D-02",
    title: "Debug Alley",
    subtitle: "Every crash log here comes with false certainty.",
    accent: "var(--debug)",
    difficulty: "Medium",
    threatLevel: 4,
    description:
      "Debug Alley is flooded with confident diagnoses that blame the wrong subsystem. Hallucination weaponizes certainty.",
    focus: "Challenge AI confidence and verify root cause.",
    brief:
      "A page crashes only in production. The AI claims the issue is definitely a database timeout, but the stack trace points to a client-side null access during hydration.",
    aiResponse:
      "This is definitely a database timeout. Production systems often fail under load and hydration warnings are usually secondary symptoms. You should increase DB pool size first and redeploy.",
    risk: "You can spend hours tuning infrastructure while the real defect remains in the client render path.",
    signalTip: "Treat confident debugging advice as a suspect theory until it matches logs and reproduction.",
    verifyChecklist: [
      "Compare the AI claim against the stack trace and failing frame.",
      "Separate production-only symptoms from actual root cause evidence.",
      "Verify the proposed fix changes the failing path, not a neighboring system.",
    ],
    incorrectConsequence: "Ops noise increases, but the same hydration crash survives the redeploy.",
    validatorOptions: [
      {
        id: "debug-db",
        label: "Scale the database",
        detail: "Accept the diagnosis and optimize pool size immediately.",
      },
      {
        id: "debug-trace",
        label: "Cross-check with evidence",
        detail: "Compare the claim against the stack trace, reproduction path, and client hydration logs.",
      },
      {
        id: "debug-cache",
        label: "Purge CDN cache",
        detail: "Assume the bug is stale frontend assets.",
      },
    ],
    correctOptionId: "debug-trace",
    explanation:
      "The AI sounded plausible because production issues often involve infrastructure, but the available evidence points elsewhere. Correct use of AI means treating its answer as a hypothesis, not a verdict.",
    lesson: "Evidence outranks confidence.",
    rewardLabel: "Noise Filter Calibrated",
  },
  {
    id: "sql",
    code: "D-03",
    title: "SQL Docks",
    subtitle: "Queries leave this port looking valid and arriving wrong.",
    accent: "var(--sql)",
    difficulty: "High",
    threatLevel: 5,
    description:
      "The docks export queries that pass syntax checks while failing business logic. Hallucination loves missing assumptions.",
    focus: "Check assumptions, joins, filters, and schema logic.",
    brief:
      "The task is to list active subscribers with their latest paid invoice. The AI query joins invoices without restricting status and date ranking, so it can return cancelled or outdated rows.",
    aiResponse:
      "SELECT u.email, i.amount\nFROM users u\nJOIN invoices i ON i.user_id = u.id\nWHERE u.subscription_status = 'active';",
    risk: "The query looks clean and fast enough to pass review while quietly returning incorrect finance data.",
    signalTip: "In SQL, vague business assumptions are more dangerous than syntax errors.",
    verifyChecklist: [
      "Confirm which invoice statuses count as paid.",
      "Require logic for selecting only the latest qualifying invoice.",
      "Check joins and filters against the real schema and business rule.",
    ],
    incorrectConsequence: "Dashboard numbers look believable, but finance decisions now rely on stale or invalid invoices.",
    validatorOptions: [
      {
        id: "sql-index",
        label: "Add an index",
        detail: "Focus on performance first because the query is small and readable.",
      },
      {
        id: "sql-assumptions",
        label: "Validate assumptions and ranking",
        detail: "Ask which invoice statuses count, and require latest-paid selection logic before trusting the query.",
      },
      {
        id: "sql-limit",
        label: "Add LIMIT 100",
        detail: "Reduce result size to avoid returning wrong rows.",
      },
    ],
    correctOptionId: "sql-assumptions",
    explanation:
      "The query is not wrong because it is slow. It is wrong because it does not encode the business rule. AI-generated SQL must be validated against the real domain assumptions.",
    lesson: "Correct SQL starts with correct assumptions.",
    rewardLabel: "Harbor Logic Stabilized",
  },
  {
    id: "regex",
    code: "D-04",
    title: "Regex Tunnel",
    subtitle: "Patterns echo perfectly until real input arrives.",
    accent: "var(--regex)",
    difficulty: "Medium",
    threatLevel: 3,
    description:
      "Regex Tunnel rewards patterns that look elegant and collapse under edge cases. Hallucination hides in missing tests.",
    focus: "Demand test cases and edge-case validation.",
    brief:
      "The AI proposes a pattern for matching usernames 3-16 chars long, but it accidentally allows a trailing underscore and rejects uppercase characters that the product supports.",
    aiResponse:
      "Use this regex: `^[a-z0-9_]{3,16}$` It safely matches usernames in a compact way.",
    risk: "A tiny pattern bug can silently reject real users or accept invalid names at the boundary.",
    signalTip: "Regex output is only trustworthy after it survives concrete valid and invalid samples.",
    verifyChecklist: [
      "List accepted examples and rejected examples before judging the pattern.",
      "Check character-class coverage against the actual product rules.",
      "Probe boundary cases such as first, last, minimum, and maximum characters.",
    ],
    incorrectConsequence: "The regex feels elegant in review and then fails when real usernames hit production.",
    validatorOptions: [
      {
        id: "regex-tests",
        label: "Request tests and counterexamples",
        detail: "Validate the rule against valid and invalid samples before accepting the pattern.",
      },
      {
        id: "regex-shorter",
        label: "Make it shorter",
        detail: "Ask for a more elegant one-line regex with fewer characters.",
      },
      {
        id: "regex-copy",
        label: "Copy it unchanged",
        detail: "It looks standard enough and already includes length limits.",
      },
    ],
    correctOptionId: "regex-tests",
    explanation:
      "Regex quality is not measured by compactness. It is measured by behavior across concrete examples. AI output for patterns must always be validated with positive and negative test cases.",
    lesson: "If you cannot test the pattern, you do not understand the pattern.",
    rewardLabel: "Pattern Drift Contained",
  },
  {
    id: "commit",
    code: "D-05",
    title: "Commit Station",
    subtitle: "Even the changelog got infected by vague certainty.",
    accent: "var(--commit)",
    difficulty: "Low",
    threatLevel: 2,
    description:
      "Commit Station routes changes through AI-generated summaries. Hallucination turns concrete diffs into empty phrasing.",
    focus: "Constrain output format and require specificity.",
    brief:
      "The diff adds retry logic to payment webhooks and fixes duplicate event processing. The AI answer says only 'improve backend handling', which is too vague for history and review.",
    aiResponse:
      "feat: improve backend handling",
    risk: "Future reviewers lose the why of the change, and operational history becomes almost useless.",
    signalTip: "Summaries are only useful when the output format forces the important nouns to appear.",
    verifyChecklist: [
      "Constrain the format before asking for the summary.",
      "Check whether the commit text names the real subsystem and change intent.",
      "Reject wording that could describe dozens of unrelated diffs.",
    ],
    incorrectConsequence: "The commit history stays short but stops being an audit trail.",
    validatorOptions: [
      {
        id: "commit-format",
        label: "Constrain the output",
        detail: "Require conventional commit format plus explicit mention of webhook retries and duplicate event prevention.",
      },
      {
        id: "commit-ship",
        label: "Use the generic commit",
        detail: "Short is fine because the diff already explains the change.",
      },
      {
        id: "commit-longer",
        label: "Ask for more adjectives",
        detail: "Make the commit feel more important without changing the meaning.",
      },
    ],
    correctOptionId: "commit-format",
    explanation:
      "The model was not wrong because the text was short. It was wrong because it dropped the change intent. Strong prompts for commits constrain structure and demand the meaningful details.",
    lesson: "AI-generated summaries need explicit output rules.",
    rewardLabel: "Station Archive Recovered",
  },
];

export const districtMap = Object.fromEntries(
  districtScenes.map((scene) => [scene.id, scene])
) as Record<DistrictId, DistrictScene>;