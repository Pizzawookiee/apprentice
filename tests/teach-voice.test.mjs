import assert from "node:assert/strict";
import test from "node:test";
import { shouldRecordExpertAnswer, teachInvoiceContext, teachSpokenFeedback } from "../lib/teach-voice.ts";

const invoice = {
  id: "INV-4474",
  supplier: "Werkhalle Systems",
  amount: 8100,
  category: "Equipment",
  description: "Hydraulic workstation",
  assetNumber: "Missing",
  subsidiary: "DE",
  risk: "No asset number",
  expected: "Stop and ask controller",
};

test("Teach context contains visible invoice fields without leaking expected answer", () => {
  const context = JSON.parse(teachInvoiceContext(invoice));
  assert.deepEqual(context.invoice, {
    id: "INV-4474",
    supplier: "Werkhalle Systems",
    amount: 8100,
    currency: "EUR",
    description: "Hydraulic workstation",
    category: "Equipment",
    assetNumber: "Missing",
    subsidiary: "DE",
    riskFlag: "No asset number",
  });
  assert.equal(context.invoice.expected, undefined);
  assert.equal(teachInvoiceContext(invoice).includes(invoice.expected), false);
});

test("spoken feedback is brief and specific to the current case", () => {
  assert.equal(
    teachSpokenFeedback(invoice, "asset_required", true),
    "INV-4474 has no asset number. Ask the controller before posting.",
  );
  assert.equal(
    teachSpokenFeedback({ ...invoice, id: "INV-4475", amount: 9600, assetNumber: "A-1992" }, "capex_threshold", true),
    "INV-4475 is 9,600 euros of equipment with asset A-1992. Choose CAPEX.",
  );
});

test("trainee voice cannot become an expert Work Map answer", () => {
  assert.equal(shouldRecordExpertAnswer("/teach", "Why did you choose CAPEX?", "user"), false);
  assert.equal(shouldRecordExpertAnswer("/capture", "", "user"), false);
  assert.equal(shouldRecordExpertAnswer("/capture", "Why did you choose CAPEX?", "agent"), false);
  assert.equal(shouldRecordExpertAnswer("/capture", "Why did you choose CAPEX?", "user"), true);
});
