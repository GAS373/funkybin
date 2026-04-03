# Escape From Hallucination City Plan

## Goal

Build a greenfield one-page game site for `funkybin.dev` that is visually strong, cheap to operate on Cloudflare, and designed to teach critical AI usage skills.

## Product Scope

- Single-page app: landing and gameplay in one experience.
- Five districts: Docs District, Debug Alley, SQL Docks, Regex Tunnel, Commit Station.
- No real-time AI in MVP.
- No accounts.
- No server-side persistence.
- Progress stored only in localStorage.
- First target is a polished MVP, not a tech demo.

## Core Product Idea

The city runs on AI infrastructure but is infected by Hallucination, an entity that produces confident but wrong answers. The player moves through city districts, receives a task, sees a misleading AI response, validates it, corrects it, and restores the district.

The game teaches:

- do not trust AI blindly
- validate outputs before using them
- ask for examples, constraints, and format
- use AI as an assistant, not an oracle

## Core Gameplay Loop

1. The player opens the site and sees Hallucination City.
2. The player starts a mission.
3. The player selects or unlocks a district.
4. The game shows a task and a wrong AI answer.
5. The player uses a validation tool or chooses a corrective action.
6. The game shows whether the choice was correct.
7. The game explains why.
8. The next district unlocks.
9. The player reaches a final learning summary.

## Page Structure

1. Hero section
2. Story introduction
3. City map with districts
4. Main gameplay panel
5. Progress and skills learned
6. Replay call to action

## District Learning Goals

### Docs District

Focus:
Ask for structure, examples, and precise output format.

### Debug Alley

Focus:
Challenge AI confidence and verify root-cause analysis.

### SQL Docks

Focus:
Check assumptions, schema logic, joins, and filters.

### Regex Tunnel

Focus:
Demand test cases and edge-case validation.

### Commit Station

Focus:
Constrain output format and require specificity.

## Content Model

Each scene should be data-driven and include:

- `id`
- `district`
- `title`
- `brief`
- `aiResponse`
- `validatorOptions`
- `correctOptionId`
- `explanation`
- `lesson`
- `difficulty`

## Technical Direction

- Use a modern TypeScript + React stack.
- Prefer static or near-static delivery for low runtime cost on Cloudflare.
- Avoid backend APIs unless they are genuinely required.
- Keep the game content data-driven instead of hardcoding logic in UI components.

## Project Architecture

1. `app/layout.tsx`: metadata, fonts, shell, theme bootstrap.
2. `app/page.tsx`: single-page composition for landing and game.
3. `components/game/*`: map, HUD, scene panel, district cards, validator UI, result panel.
4. `data/game/*`: districts, scenarios, fake AI answers, validation options, lesson summaries.
5. `lib/game/*`: types, reducer or state machine, localStorage adapter, progression rules.
6. `app/globals.css`: design system, visual language, motion, city atmosphere.

## Visual Direction

- Sci-fi city interface with strong identity.
- Neon, glow, grid, distortion overlays.
- Each district gets its own color and pattern language.
- Hallucination is represented through glitch, red flags, fake confidence, noisy overlays.
- Validation is represented through cleaner signal UI, cyan or green accents, structured panels.
- Avoid heavy video and expensive 3D dependencies in MVP.

## Cost Strategy

- No real-time AI calls in the core game loop.
- No auth.
- No server-side session storage.
- No mandatory database for gameplay.
- Use localStorage for progress.
- Use Cloudflare primarily for hosting and optional analytics in MVP.

## Cloudflare Footprint For MVP

- Static frontend hosting
- Optional Cloudflare Web Analytics
- No Workers AI in critical path
- No KV or D1 required for first release

## Implementation Phases

### Phase 1

- Scaffold the clean app
- Build base layout and theme
- Set up game state model
- Create the initial content structure

### Phase 2

- Build hero and city map
- Implement one complete district as a vertical slice
- Add local progress persistence

### Phase 3

- Add the remaining four districts
- Add final summary and replay flow
- Polish motion, transitions, and responsive behavior

### Phase 4

- Validate build
- Validate Cloudflare deployment setup
- Run performance pass and trim bundle size

## Acceptance Criteria

- The site works as a one-page game.
- All five districts are playable.
- Progress restores after refresh via localStorage.
- Core gameplay works without a backend.
- Mobile and desktop are both usable.
- The visual presentation feels premium despite a low-cost runtime model.

## What Is Explicitly Out Of Scope For MVP

- real-time AI in every scene
- user accounts
- online save sync
- global leaderboard
- procedural content generation
- multiplayer or user-generated content

## Expansion Path After MVP

1. Add daily challenge mode.
2. Add shareable result cards.
3. Add optional global progress with KV or D1.
4. Add premium sandbox mode with real AI.
5. Add anonymous telemetry for balancing and difficulty tuning.

## Start Condition

Once the user deletes the old codebase, development starts immediately from scaffolding and Phase 1 implementation.
