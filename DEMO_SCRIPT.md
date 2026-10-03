# AI Apprentice demo and acceptance script

**Baseline:** current Capture → Work Map → Teach app and the five bundled synthetic invoices. This is a living test document: **update it whenever routes, controls, fixture facts, questions, guardrails, integrations, or expected results change.** Rehearse it again after each such change. The challenge brief decides what must be demonstrated; `COMPLIANCE.md` tracks implementation coverage.

## What this script proves

The judge should see an expert complete three decisions, hear three questions tied to the visible invoices at natural pauses (including a guardrail), close three remaining gaps in a debrief, confirm or correct a teach-back, and watch a trainee handle a new case with a wrong decision blocked **before** it is saved. The final checks show privacy, provenance, mastery, sponsor integrations, and the moonshot.

**Use only synthetic data.** For live vision, share the synthetic ERP browser tab, not a desktop with personal information. The local fallback is useful for testing the product flow, but it does **not** prove that ElevenAgents, Scribe, Claude, Jev, Presidio, Neon, or MCP are connected.

## 0. Prepare the environment

### Local run

1. Use Node.js 22.22 or newer. Run `npm install` and `npm run dev` from the repository root. Open `http://localhost:3000/capture`.
2. Click **Reset demo** in the left sidebar. Confirm the header says **0 decisions captured** and the privacy button says **On the record**.
3. Check `http://localhost:3000/api/health`. `ok: true` means the app is serving; each service flag reports whether its credential is configured. A `false` flag means the corresponding live integration cannot be claimed in the demo.
4. Open one **source invoice PDF** link to show that the underlying artifact exists. The PDFs are bundled synthetic fixtures; no upload is needed.

### Live sponsor rehearsal (after following the Vercel setup runbook)

Before presenting the live version, verify `/api/health` reports database connected and the relevant ElevenLabs, Anthropic, Jev, and MCP flags are true. In the ElevenLabs dashboard, confirm the agent uses the intended native Claude model, Expressive Mode voice, Scribe/turn-taking, and the attached MCP server with read tools approved and write tools restricted. Verify the Presidio endpoint separately: `/api/privacy` should report `provider: "Presidio"` when `PRESIDIO_URL` is configured. Do not substitute the browser speech fallback for an ElevenLabs demonstration.

## 1. Capture: expert works while the apprentice listens

**Presenter role:** Sabine, the experienced accounts-payable expert. **Target time:** roughly 3–4 minutes. Explain the invoice only after taking an action or when the agent asks; do not read the Work Map rules aloud in advance.

1. On **Capture**, click **Share screen** and select the synthetic ERP browser tab. The side panel should change from **Screen not shared** to an observation status. With Anthropic configured and `NEXT_PUBLIC_ENABLE_VISION=true`, check the browser Network panel for `/api/claude/vision` requests about every two seconds while sharing. No full-session recording should be created. Without Anthropic, local change detection still works, but the vision requirement is **not live-verified**.
2. Click **Connect voice**. With an ElevenAgent configured, allow microphone access and confirm **Voice connected**. Otherwise, the notice says the agent ID is missing and the local browser speech fallback supplies spoken prompts. Use the live agent for the final sponsor demo.
3. Click the **INV-4471** tab even if it is already selected. This emits the document-open event; with Anthropic configured, verify one Claude PDF extraction and a cached result on later opens. Point to **€7,200**, **Equipment**, **A-1837**, and the initial **OPEX · 4711** selection.
4. Select **CAPEX · 0400** and click **Record decision**. The header should become **1 decision captured**. While still interacting, the panel should say **Waiting while you work**; it must not interrupt typing. Stop interacting for roughly three seconds. It should ask: “I saw you move INV-4471 to capex. What made that the right choice, and is there a limit?” This is the live **limit/guardrail** question.
5. Answer by voice if ElevenAgents is connected, or enter this in **Expert answer** and click **Save expert explanation**: “Equipment over €5,000 goes to capex when it has an asset number. If the asset number is missing, stop and ask the controller.” Confirm the question clears. The answer must be linked to INV-4471, not just placed in an unstructured transcript.
6. Click **INV-4472**. Point to the December duplicate-history risk. Select **Hold for review** and click **Record decision**. The header should show **2 decisions captured**. After the pause, the question should ask whether the hold applies to every supplier and who releases it. Answer: “Only this supplier has a December duplicate history. Hold the invoice until the controller verifies no second invoice exists.” Save the explanation.
7. Click **INV-4473**. Point to the **CZ** subsidiary and cross-border approval flag. Select **Second approval** and click **Record decision**. The header should show **3 decisions captured**. After the pause, the question should ask when approval is required and who gives it. Answer: “Every Czech subsidiary invoice needs a second approver from the controller team before posting.” Save the explanation.

**Capture pass checks:** three distinct invoice-specific questions were asked after pauses; at least one concerned a limit or stop condition; no question interrupted typing or speech; each action has its own canonical timestamp. In live mode, confirm finalized speech turns arrive and the voice is patient and concise. If the expert gives a reason spontaneously before a queued question, test that redundant prompting is suppressed; record a failure if it is repeated.

## 2. Map: close gaps and confirm the teach-back

Click **Open Work Map**. Stay on this page until all three debrief answers are saved; the current UI advances this question sequence within the page.

1. The left timeline should show INV-4471, INV-4472, and INV-4473 in action-time order. Click each row. The right card should show the screen moment, decision, expert’s words, and the candidate or confirmed guardrail. Click **Replay reconstructed moment** to reopen the corresponding synthetic invoice state. This is a reconstruction, not a retained screen recording.
2. **Debrief question 1** asks whether exactly €5,000 is capex and who confirms a missing asset number. Answer: “Exactly €5,000 is opex; above that requires capex. If the asset number is missing, ask the controller to provide it before posting.” Click **Save answer**. Confirm the gap count moves to **1/3** and the INV-4471 guardrail card uses the expert’s wording.
3. **Debrief question 2** asks what clears a suspected duplicate and what happens if the controller is unavailable. Answer: “Compare the supplier reference and amount against the ledger. If it is not a duplicate, the controller releases the hold. If unavailable, leave it on hold.” Save. Confirm **2/3**.
4. **Debrief question 3** asks what to do if the Czech approver is unavailable and whether there are exceptions. Answer: “Do not post it. Queue it for the controller team and explain the delay. There is no threshold exception for Czech subsidiary invoices.” Save. Confirm **3/3**.
5. Read or click **Hear teach-back**. It should be generated from the recorded decisions, live explanations, and debrief answers. Check that it covers the capex threshold, asset-number stop, December duplicate exception, Czech approval, and escalation. It should not introduce a rule the expert never confirmed.
6. Demonstrate correction: select **INV-4472** in **Correction applies to**, enter “If the controller is unavailable, keep the invoice on hold until the next business day,” then click **Confirm or save correction**. The notice should say the teach-back is confirmed. Click the INV-4472 timeline row and verify **Expert correction** appears on that step. The correction should also be available to the MCP memory tools when Neon is configured.

**Map pass checks:** three follow-up questions fill gaps that the live questions did not settle; the expert explicitly confirms/corrects the teach-back; every important step has an action time, source moment, reason in the expert’s own words, and a guardrail. If the spoken teach-back exceeds one minute, shorten the presentation wording before judging without omitting rules.

## 3. Teach: trainee faces cases the expert never showed

Click **Start Teach mode**. The new-hire cases are INV-4474 and INV-4475, neither of which appears in the expert Capture tabs. Optionally click **Share trainee screen** and **Connect tutor** for the live voice/screen rehearsal.

1. Leave **INV-4474** selected. It is **€8,100 equipment** with **Asset no. Missing**. Ask the trainee to predict the next decision before giving advice. Leave **OPEX · 4711** selected (or choose **CAPEX · 0400**) and click **Check before save**.
2. Expected: the attempt is **blocked before any business-state change**. The tutor explains the missing-asset stop in the expert’s terms and shows the INV-4471 expert moment. **Guardrails caught** becomes **1**. Select **Stop and ask controller**, click **Check before save**, and verify a safe decision is recorded.
3. Click **INV-4475**. It is an unseen **€9,600 industrial pump** with asset **A-1992**. Again ask the trainee to predict. Leave **OPEX · 4711** selected and click **Check before save**.
4. Expected: the tutor blocks OPEX, cites the expert’s €5,000 equipment reasoning, and replays the relevant INV-4471 moment. **Guardrails caught** becomes **2**. Change to **CAPEX · 0400** and click **Check before save**. **Safe decisions** should reach **2**. The practice suggestion should point back to checking evidence before assigning a cost center.

**Teach pass checks:** the trainee inferred rules on unseen cases; at least one wrong choice was intercepted *before* save; the explanation cites expert reasoning and provenance; correction/retry works; the mastery summary changes. If no confirmed expert rule exists, the backend should block as `unconfirmed_memory` rather than inventing one.

## 4. Trust and privacy tests (separate from the main judge narrative)

Run these after the core demo or in a separate reset session so the timeline remains easy to present.

1. Return to **Capture** and note the INV-4471 Work Map decision and timestamp. Click **On the record** so it becomes **Off the record**. The app should clear any queued question and disconnect an active voice session.
2. While private, record a different INV-4471 decision. The notice should say it was observed only in this browser session. Return **On the record**, reopen **Work Map**, and verify the original INV-4471 decision, explanation, and timestamp remain. The private change must not appear in durable state or Neon events. The `/api/events` endpoint also returns `{ "discarded": true }` for an `offRecord: true` event.
3. Send synthetic PII to `/api/privacy`, for example `Jane Doe jane@example.com called 555-123-4567 about the Czech subsidiary`. Expect pseudonymized person/email/phone values and **Czech subsidiary** retained. In production, verify `provider: "Presidio"`; a local `built-in recognizers` response is a fallback and does not establish full PII coverage.
4. Verify routine screen frames and full-session video are not stored. With live vision, frames are sent only while screen sharing is active and on record. Stop sharing and confirm requests stop.
5. Check the browser network payloads for leaked `ANTHROPIC_API_KEY`, `JEV_API_KEY`, `ELEVENLABS_API_KEY`, `DATABASE_URL`, or `MCP_SHARED_SECRET`. None should appear in client responses or bundles. The Agent ID is intentionally public.

## 5. Integration and sponsor checks

These checks require the services configured in the Vercel runbook. Record **Not configured**, not **Pass**, when a credential or dashboard connection is absent.

| Check | Evidence to capture |
| --- | --- |
| ElevenAgents interviewer and tutor | Connection succeeds in both modes; spoken questions and tutoring use the configured Expressive Mode voice; finalized user turns reach the app. |
| Scribe/turn-taking and natural pauses | The agent remains quiet while the expert types, reads, or speaks; one queued question is asked at a pause. Test a spontaneous explanation before a pause. |
| Claude document understanding | Opening a source invoice triggers `/api/claude/document`; INV-4471 extracts €7,200, equipment, A-1837, DE. Reopening uses the cache when Neon is connected. |
| Claude screen understanding | While sharing the synthetic tab, `/api/claude/vision` receives an ephemeral reduced frame about every two seconds; normalized observations correlate with app actions. |
| Jev reasoning | A decision calls `/api/decisions/classify` with one compact state and atomic explained/classification/importance/guardrail questions. Inspect typed results and latency; do not send raw frames or PDFs. |
| Neon | `/api/health` says `database: "connected"`; captured session and meaningful event rows persist after a refresh. Verify migrations were applied first. |
| Presidio | `/api/privacy` reports `provider: "Presidio"` and redacts synthetic PII while preserving business geography. |
| MCP | From the ElevenAgent, call read tools such as `get_guardrails` and `get_relevant_rules`; confirm they return only sanitized, confirmed, provenance-backed data. Confirm unauthorized requests receive 401 and mutating tools require approval. |

## 6. End with the moonshot

Click **The moonshot** in the footer. Close the pitch with the one-slide path: this MVP captures one expert and teaches one hire; confirmed, evidence-linked Work Maps can become a living company memory that notices workflow changes, teaches in other languages, and exposes agent-ready guardrails through MCP while people retain judgment and escalation decisions.

## Judge scorecard

| Apprentice Test question | What the demo should show |
| --- | --- |
| **When to ask?** | Visible waiting state during activity; three short questions released at pauses, one at a time. Verify live speech/turn-taking with ElevenAgents. |
| **What to ask?** | INV-4471 threshold/asset guardrail, INV-4472 duplicate scope, INV-4473 second approval. No generic question or screen-obvious fact. |
| **When has it understood?** | Three new debrief answers close open gaps; generated teach-back is corrected and confirmed. |
| **Did the new hire learn?** | INV-4474 and INV-4475 are unseen; wrong choices are blocked, corrected choices are safe, mastery changes. |
| **Can the expert trust it?** | Off-the-record rollback, no full recording, synthetic PII redaction, provenance and restricted MCP tools. |

**Presentation guardrails:** Do not claim a live sponsor integration from a local fallback. Do not call reconstructed invoice evidence a stored screen clip. Do not claim the application currently handles two experts, automatic multilingual teaching, or a company-wide memory; those are stretch/moonshot directions.

## Maintenance rule

Update this file in the **same change** as any altered Capture/Map/Teach control, fixture, prompt, question, threshold, decision rule, privacy behavior, evidence type, API integration, or deployment dependency. Re-run the core walkthrough and relevant integration checks, then update `COMPLIANCE.md` and `README.md` when their claims change. Keep the expected outcomes observable in the current app; mark any unmet challenge requirement explicitly rather than rewriting the test to hide it.
