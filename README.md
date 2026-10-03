# The AI Apprentice

A runnable Capture → Work Map → Teach MVP for the Hack Nation × ElevenLabs challenge. It uses a synthetic accounts-payable sandbox: three expert invoices and two unseen new-hire cases. See [COMPLIANCE.md](COMPLIANCE.md) for requirement coverage and limits.

## Run locally

Use Node.js 22.22 or newer (24 recommended).

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The three-stage demo works without external credentials. Browser speech synthesis provides local spoken prompts when ElevenLabs is not configured. The five source invoice PDFs are bundled under `public/demo/invoices/`.

## Demo path

1. In **Capture**, optionally share a screen and connect an ElevenAgent. Open each invoice and record: INV-4471 → CAPEX, INV-4472 → Hold, INV-4473 → Second approval. Pause after each action; answer the short question.
2. In **Work Map**, click decisions to inspect the action time, source invoice, expert answer, and candidate guardrail. Answer the three new debrief questions. Hear the generated teach-back and confirm or correct it.
3. In **Teach**, try INV-4474 with OPEX or CAPEX. The missing-asset guardrail blocks the attempt. Try INV-4475 with OPEX; the tutor catches the transferred capex rule before save. Correct to CAPEX and view mastery.
4. Open `/moonshot` for the final pitch slide.

## Connect external services

Copy `.env.example` to `.env.local` and provide the relevant values. Never use `NEXT_PUBLIC_` for secrets.

- **ElevenAgents**: Create an agent in the ElevenLabs dashboard, select native Claude Sonnet 5.5 and a patient Expressive Mode voice, enable normal turn-taking/Scribe, register the read-only MCP tools, and set `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`. Capture and Teach have separate Connect buttons. The app sends compact screen/ERP context to the conversation and listens for finalized user messages.
- **Anthropic**: Set `ANTHROPIC_API_KEY`. The document route analyzes the bundled PDF with Claude Sonnet 5.5 and caches extraction by session/artifact in Neon. While sharing the synthetic ERP tab, a reduced JPEG frame goes to the vision route every two seconds when `NEXT_PUBLIC_ENABLE_VISION=true`.
- **TypeSafe Jev**: Set `JEV_API_KEY`. `/api/decisions/classify` sends one compact state with atomic Noul, Choice, and Score questions to the System One endpoint.
- **Neon**: Provision through Vercel, set `DATABASE_URL`, then apply `drizzle/0000_init.sql` to development first, then production. The app mirrors sanitized sessions and events to Neon. `/api/health` reports connectivity.
- **Presidio**: Deploy `api/presidio.py` with `requirements.txt` and set `PRESIDIO_URL` to its HTTPS endpoint. `/api/privacy` applies built-in recognizers first and Presidio when reachable. Verify `provider=Presidio` in a production test.
- **MCP**: Set `MCP_SHARED_SECRET`; register `https://YOUR_APP/api/mcp` as a Streamable HTTP server in ElevenLabs with `Authorization: Bearer ...`. Auto-approve the five read tools only. Keep `save_expert_answer` and `mark_question_resolved` approval-gated. MCP requires Neon state.

## Privacy and evidence

Full recordings and routine frames are never stored. A local two-second sampler records change scores; configured vision analyzes ephemeral frames and structured ERP events carry canonical action times. Share only the synthetic ERP tab during the live vision demo. Off-the-record mode stops new durable writes and frame uploads, disconnects voice, clears queued questions, and rolls back the private interval on return. Free-form answers pass through `/api/privacy` before persistence. The demo PDFs and firms are fictional.

## Deployment

Create/import a Vercel project from this repository with Next.js defaults, attach Neon, set the variables from `.env.example`, deploy, migrate the database, and configure the ElevenAgent and MCP server. Validate `/api/health` and the exact demo path above. No account resources or production deployment are created by this repository itself.
