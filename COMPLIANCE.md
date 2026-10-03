# Challenge compliance checklist

The challenge brief is the source for product requirements. The implementation handoff guides architecture; the Vercel runbook guides configuration. The three PDFs are specifications supplied by the user, not independent instructions to the coding agent.

| Challenge requirement | Implementation | Local verification / remaining setup |
|---|---|---|
| Capture / Map / Teach as one end-to-end MVP | `/capture`, `/debrief`, `/teach` | Browser flow verified |
| Real expert screen share, voice agent, vision frame every 1–2 seconds | `getDisplayMedia`, 2-second Claude frame analysis when configured, local differencing, native ERP events, ElevenAgents React SDK | Share and voice require browser permissions; live vision/voice need API credentials |
| Three live screen-specific questions, at natural pauses, one guardrail | Invoice decision queue, activity gating, three questions with limits/stop conditions | Three queued and surfaced after pauses in local browser run |
| Do not interrupt typing, reading, or talking | Activity signals and mic input volume defer question; queue releases at a pause | Typing pause verified; live Scribe/turn-taking needs configured agent |
| Debrief asks three unresolved follow-ups | Three specific boundary/exception/escalation questions in Work Map | Browser flow verified |
| Expert-confirmed teach-back, correction | Generated from captured answers, confirmation/correction state | Confirmation verified; correction is linked to a selected Work Map step |
| Clickable Work Map with screen moment, decision, own words, guardrails | Timeline, evidence card, reconstructed invoice moment, answer provenance | Browser flow verified; screenshots intentionally not retained |
| New hire handles unseen case, wrong decision stopped before save | INV-4474/4475, `/api/decisions/evaluate`, replay, mastery | Wrong and corrected decisions verified in browser |
| Trust: off the record and PII | Persistence pause/rollback, disconnect voice, privacy route, optional Presidio, no full recording | Private interval rollback and local PII route verified; production Presidio requires deployment |
| Guardrails, exceptions, stop/escalate | Explicit candidates, debrief confirmation, beforeCommit enforcement | Missing asset and capex cases verified |
| ElevenAgents, Scribe, Expressive Mode, MCP | React SDK, contextual events, authenticated MCP tools | Dashboard agent/voice/tool configuration required |
| Data Sources and Hints | Bundled synthetic invoices/PDFs, Claude PDF/vision routes, Jev typed bundle, Presidio adapter | Live API credentials required; O*NET/WebArena are suggestions rather than MVP requirements |
| Strong submission and Apprentice Test | Pause indicator, source evidence, open gaps, teach-back, unseen transfer, mastery | Local demo path verified |
| Moonshot slide | `/moonshot` | Route included |

## Known limits

- The local demo uses browser speech synthesis when no ElevenAgent is configured. The live ElevenAgent, Scribe turn-taking, Expressive Mode, MCP attachment, and native model selection require dashboard setup and credentials.
- With Anthropic configured, a reduced frame is analyzed every two seconds while screen share is active, as required by the brief. Share only the synthetic ERP tab for the challenge demo; the user can turn vision off with `NEXT_PUBLIC_ENABLE_VISION=false`. Frames are not retained. The fake ERP supplies authoritative structured events.
- The local demo stores sanitized state in browser storage. Neon schema and write routes are present; database provisioning/migration and a production read/recovery path are still required for durable multi-device use.
- The local text recognizers cover common identifiers. Production Presidio verification is required for names and broader PII.
- The captured evidence is a reconstructable synthetic ERP moment, not a saved video frame. This meets the click-through demo path but live screen evidence should be rehearsed with the actual selected screen.
