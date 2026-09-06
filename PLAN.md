# PLAN — The Full Conversation (SALES)

A functional sales-training model for `kingofthewisdomrealm-hub/SALES`.
Jeremy Miner / NEPQ structure. Thought bubbles above both people. Full process on screen. Drawn from Knockandrestore’s *job* (door-to-home-service conversation), not from its *form*.

---

## 1. Why Knockandrestore feels clunky (and what we keep)

Knockandrestore is a single `index.html` Game Boy Color sim: walk a tile street, knock, then pick ASK / EDUCATE / PROVE / INSPECT / SCHEDULE / EXIT against five meters (trust, interest, urgency, resist, patience) plus a confidence bar.

**What it gets right**

- A real Florida home-service job, not a generic “sell the widget.”
- Homeowners have a *hidden concern*. Proof that matches the concern works; generic reassurance does not.
- Leaving with respect is a valid outcome.
- Instant feedback after a line.

**Why it fights learning**

- The process is invisible. The six buttons are always on. A beginner cannot see *when* a move belongs.
- Five meters plus confidence is more dashboard than conversation. Players optimize pips instead of listening.
- There is no inner life. You never see the buyer’s unspoken fear or the seller’s next question forming.
- The sale stops at “book the look.” NEPQ’s distinctive move — commitment *before* presentation — never happens.
- The 380×760 LCD, Press Start type, and walking overworld add friction that does not teach selling.
- Tonality, permission, and “they have to say it” are not modeled. The game rewards the right *button*, not the right *sequence*.

**What this project takes instead**

- Same world: storm / roof / restoration consultative sale on the Treasure–Space Coast.
- Same idea of archetypes (guarded, burned, overloaded).
- Same respect-exit.
- Everything else is rebuilt: layout, graphics, phase machine, thought layer, two-scene arc, debrief.

---

## 2. The model (what “Jeremy Miner style” means here)

Public NEPQ sequence used as the spine:

| # | Phase | Job of the phase | Buyer has to… | Seller must not… |
| --- | --- | --- | --- | --- |
| 0 | Approach | Arrive without looking like a closer | Open the door | Lead with the company pitch |
| 1 | Connection | Drop the guard they arrived with | Relax enough to talk | Perform enthusiasm |
| 2 | Situation | Get the factual “how it works today” | Describe current state | Diagnose from the sidewalk |
| 3 | Problem awareness | Move facts into a problem *they* own | Name the difficulty | Tell them they have a problem |
| 4 | Solution awareness | Have them describe what a fix must do | Picture a working outcome | Dump features |
| 5 | Consequence | Cost of no change, in their words | Feel the future if nothing happens | Manufacture fake urgency |
| 6 | Commitment | They say they want to do something | State intent | Ask for the sale as a statement |
| 7 | Presentation | Show only what answers what they said | Recognize their own words in the offer | Present the whole binder |
| 8 | Next step | Concrete action (inspect now, book, sign) | Agree to a time / action | Get greedy after a yes |

Core rules encoded in the engine, not just the copy:

1. **Questions close. Statements raise the wall.**
2. **Phase fit beats clever lines.** A great presentation line in Connection is a miss.
3. **They have to say it.** Problem, want, and commitment flags only flip when the *buyer* speaks them — not when you declare them.
4. **Commitment before presentation.** Scene 2 will not unlock the scope/price board until the buyer has voiced intent.
5. **Tonality is a visible cue** in the seller thought bubble (“curious, not eager”).
6. **Consequence creates urgency.** Urgency is not a separate meter you pump with hype.

We do **not** paste 7th Level course scripts. Lines are original and written in that questioning style.

---

## 3. The thought-bubble layer (the actual product)

Two clouds live above the heads at all times.

**Buyer thought** — what they will not say yet.

- Guarded: “If I admit the stain, this turns into a three-hour pitch.”
- Burned: “The last truck had a magnet sign too.”
- Opening: “Just get rid of them without being rude.”

Buyer thoughts update after every reply. They are the teaching surface: students see *why* a line landed or bounced.

**Seller thought** — coach, not telepathy.

- In **Learn** mode: “Don’t solve it. Ask how long the stain has been spreading.”
- In **Practice** mode: the seller cloud is hidden. You only see the buyer (and even that can be dimmed later).

Speech bubbles are what is *said*. Thought bubbles are what is *true*. The gap between them is the lesson.

---

## 4. What is on screen from start to finish

A process rail across the top. The current phase is lit. Completed phases stay checked. Skipped or blown phases mark as “jumped.”

Two scenes so the whole sale exists, not just the knock:

```
TITLE
  → SCENE 1  Porch / first conversation
       Approach → Connection → Situation → Problem → (enough ownership)
       → Commitment to a look
  → TRANSITION  “Three days later. Findings on the table.”
  → SCENE 2  Kitchen table
       Recap situation → Solution awareness → Consequence
       → Commitment → Presentation (only the matching scope) → Next step
  → DEBRIEF
```

The street-walking overworld is gone. Getting to the door is not the skill this trainer is for.

---

## 5. State the engine actually tracks

Fewer numbers than Knockandrestore, more flags that match how a real NEPQ call is graded.

| Signal | What it is | How it moves |
| --- | --- | --- |
| `guard` 0–5 | How armored they are | Connection and listening lower it; pitching raises it |
| `ownedProblem` bool | They named the problem | Only buyer language flips it |
| `namedWant` bool | They described a desired future | Solution-awareness questions |
| `feltCost` bool | They said what inaction costs | Consequence questions |
| `voicedIntent` bool | They said they want to do something | Commitment questions |
| `trust` 0–5 | Will they let you near the house / the number | Proof that matches their fear; patience |
| `phase` | Where the rail is | Advances when the phase’s flag is earned *or* when a fitted question opens the next door |
| `jumps` | Times you sold ahead of the phase | Debrief ammunition |
| `transcript[]` | Every line, tagged by phase and fit | Review |

Win / soft / loss is computed from flags + guard, not from a secret score.

Endings:

- **Signed next step** — intent voiced, presentation matched, they pick a time.
- **Inspection booked / on the roof** — Scene 1 success path.
- **Follow-up earned** — trust up, no intent yet, you left clean.
- **Wall** — guard maxed or patience gone.
- **Early pitch** — presentation or price before ownership.

---

## 6. Graphics brief (better, still light)

Not pixel-LCD. Not a 3D game.

- Desktop-first stage, ~1200×720, works on a tablet.
- Florida late-afternoon light: sand, sage, terracotta, deep tide navy.
- CSS/SVG porch and kitchen — house silhouette, warm window, table with a findings folder in Scene 2.
- Two illustrated figures (simple, readable bodies, distinct postures). Faces shift: closed / considering / opened.
- Comic **speech** bubbles from the chest; **thought** clouds above the head with a three-dot tail.
- Process rail as a physical object, not a tiny HUD pip row.
- Type: a display serif for names/phases, a clean sans for dialogue. No 8px pixel font.
- Motion: bubble fade-in, phase tick, scene crossfade. No scanlines.

If a later pass adds portraits, they should stay graphic-novel stills, not a sprite sheet from Knockandrestore.

---

## 7. Learning loop (this is the product, not the skin)

Every choice has four outputs:

1. Spoken buyer reply  
2. Updated buyer thought  
3. Coach note (“fit: Connection — they dropped one inch of armor” / “jump: you presented in Situation”)  
4. Flag / guard change  

After the sale, the debrief lists:

- Which phases were earned vs jumped  
- The exact buyer sentence that owned the problem (or the fact that it never came)  
- One rewrite: the line you should have asked instead of the jump  

Practice mode is the same engine with the seller cloud and coach note hidden until the debrief.

---

## 8. Content rules

- Original language. No pasted course scripts.
- Curious / slightly concerned tonality in seller lines. No “great question!” closer energy.
- Proof is specific and matched to the fear (license + insured for the skeptic; no-deposit + neighbor name for the burned). Generic “we do quality work” is coded as a miss.
- Industry stays restoration so the two-scene arc (look → findings → scope) is honest.
- Characters are new: not Frank / Brenda / Walt / Carlos / Covenant Builders.

---

## 9. Build sequence

**Now (this commit)**  
Playable trainer: title, two characters, two scenes, thought bubbles, rail, Learn/Practice, debrief.

**Next**  
- Wire Do/Don't stills as stage backgrounds.  
- Third archetype (overloaded parent).  
- Optional GitHub Pages.  
- A silent “replay with thoughts revealed” after Practice.  
- Tonality chips you can tap (curious / certain / eager) that change how the same line lands.

**Later**  
- Recorded voice for the buyer (one take per reply).  
- A “write your own question” box graded by phase keywords.  
- Branch for in-home vs phone vs video — same phases, different approach.

---

## 10. What “done” looks like

A new canvasser can play Learn on Dale, see the buyer think “don’t admit the stain,” ask the situation question anyway, watch the thought change to “fine, there’s a mark in the hall,” ride the rail to a kitchen-table presentation that only talks about the hall — and then explain in the debrief *why* the early pitch would have died.

That is the whole product.

---

## 11. Visual plan and gradual field versions

Two teaching surfaces sit on top of the engine.

**Visual plan** (`docs/VISUAL_PLAN.md`) — each of the nine phases is a Do still and a Don't still. A simple-language version lives in the same file so a new person can learn the shape before the exact lines. Characters in the picture series: Jordan (seller) and Gene (homeowner). Same porch, then the same kitchen.

**Gradual versions** (`docs/GRADUAL_VERSIONS.md`) — what Josias says after the 3/16 storm, one layer at a time:

1. Door (name, team, free look, pictures, show-back). Stop.
2. Look (facts and photos only).
3. Show-back (they own the photos).
4. Claim path (file, guide to approval, work for what they pay, deductible only).
5. Loop (call together, CRM same hour, follow up on the claim).

The engine still enforces NEPQ phase fit. The gradual book is the field script that maps onto that rail. Do not stack Version 4 on a person who only opened the door.
