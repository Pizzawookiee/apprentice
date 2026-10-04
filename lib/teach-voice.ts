import type { Invoice } from "@/lib/fixtures";

export function shouldRecordExpertAnswer(pathname: string, question: string, source?: string): boolean {
  return pathname === "/capture" && Boolean(question) && source === "user";
}

export function teachInvoiceContext(invoice: Invoice): string {
  return JSON.stringify({
    type: "teach_current_invoice",
    invoice: {
      id: invoice.id,
      supplier: invoice.supplier,
      amount: invoice.amount,
      currency: "EUR",
      description: invoice.description,
      category: invoice.category,
      assetNumber: invoice.assetNumber,
      subsidiary: invoice.subsidiary,
      riskFlag: invoice.risk,
    },
    guidance: "These are the fields visible to the trainee. Ask them to predict the next action before explaining a rule. If a required fact or confirmed rule is missing, name that gap. Do not claim you cannot see this invoice.",
  });
}

export function teachSpokenFeedback(invoice: Invoice, rule: string, blocked: boolean): string {
  switch (rule) {
    case "asset_required":
      return blocked
        ? `${invoice.id} has no asset number. Ask the controller before posting.`
        : `Correct. Hold ${invoice.id} and ask the controller for the missing asset number.`;
    case "capex_threshold":
      return blocked
        ? `${invoice.id} is ${invoice.amount.toLocaleString("en-US")} euros of equipment with asset ${invoice.assetNumber}. Choose CAPEX.`
        : `Correct. ${invoice.id} meets the confirmed CAPEX rule.`;
    case "unconfirmed_memory":
      return "The expert has not confirmed a rule for this decision. Ask before posting.";
    case "unresolved_rule":
    case "unresolved_guardrail":
    case "outside_confirmed_scope":
      return "The confirmed rule does not settle this case. Ask the expert or controller.";
    default:
      return "I could not verify this decision. Ask the controller before posting.";
  }
}
