import { NextRequest, NextResponse } from "next/server";
import { invoices } from "@/lib/fixtures";
import { sanitizeText } from "@/lib/privacy";
import type { Step } from "@/lib/model";

export async function POST(request:NextRequest){
 const body=await request.json().catch(()=>({}));
 const invoice=invoices.find(x=>x.id===body.invoice?.id&&x.role==="teach");
 if(!invoice||typeof body.choice!=="string")return NextResponse.json({error:"Invalid unseen-case decision"},{status:400});
 const steps=Array.isArray(body.steps)?body.steps as Step[]:[];
 const source=steps.find(x=>x.invoiceId==="INV-4471"&&x.status==="confirmed"&&x.answer);
 if(!source)return NextResponse.json({blocked:true,rule:"unconfirmed_memory",explanation:"I cannot find a confirmed expert rule for this decision. Stop and ask the expert or controller before saving.",confidence:1});
 const reason=sanitizeText(source.answer||source.reason);
 const learned=[source.correction,source.guardrail,reason].filter(Boolean).join(" ");
 const thresholdMatch=learned.match(/(?:€|EUR\s*)?([\d,.]+)\s*(?:euros?)?/i);
 const threshold=thresholdMatch?Number(thresholdMatch[1].replace(/,/g,"")):NaN;
 if(invoice.category!=="Equipment"||!Number.isFinite(threshold))return NextResponse.json({blocked:true,rule:"unresolved_rule",explanation:"The expert's confirmed rule is not precise enough for this case. Stop and ask before saving.",confidence:1});
 const provenance={invoiceId:source.invoiceId,sourceDecision:source.id,screenMoment:source.moment,confirmed:true};
 if(invoice.amount>threshold&&(!invoice.assetNumber||invoice.assetNumber==="Missing")){
  const guardrailKnown=/asset number/i.test(learned)&&/(missing|no asset|ask|stop)/i.test(learned);
  if(!guardrailKnown)return NextResponse.json({blocked:true,rule:"unresolved_guardrail",explanation:"This case lacks an asset number and the stop condition is not confirmed. Ask the controller before saving.",confidence:1,provenance});
  const blocked=body.choice!=="Stop and ask controller";
  return NextResponse.json({blocked,rule:"asset_required",explanation:`The expert explained: ‘${reason}’ No asset number is present, so stop and ask the controller before posting.`,confidence:1,provenance});
 }
 if(invoice.amount>threshold){const blocked=body.choice!=="CAPEX · 0400";return NextResponse.json({blocked,rule:"capex_threshold",explanation:`The expert explained: ‘${reason}’ This unseen invoice is ${invoice.amount.toLocaleString()} EUR with asset ${invoice.assetNumber}.`,confidence:1,provenance});}
 return NextResponse.json({blocked:true,rule:"outside_confirmed_scope",explanation:"This case is outside the confirmed capex rule. Ask for the relevant workflow before saving.",confidence:1,provenance});
}
