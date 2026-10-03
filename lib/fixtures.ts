export type Invoice = { id:string; supplier:string; amount:number; category:string; description:string; assetNumber:string; subsidiary:string; received:string; risk:string; initialCode:string; expected:string; role:"expert"|"teach" };
export const invoices: Invoice[] = [
 {id:"INV-4471",supplier:"Muster Technik GmbH",amount:7200,category:"Equipment",description:"CNC calibration unit",assetNumber:"A-1837",subsidiary:"DE",received:"04 Dec 2026",risk:"None",initialCode:"OPEX · 4711",expected:"CAPEX · 0400",role:"expert"},
 {id:"INV-4472",supplier:"Rhein Supply Co.",amount:1840,category:"Operations",description:"Replacement machine parts",assetNumber:"—",subsidiary:"DE",received:"08 Dec 2026",risk:"December duplicate history",initialCode:"OPEX · 4711",expected:"Hold for review",role:"expert"},
 {id:"INV-4473",supplier:"Morava Components s.r.o.",amount:3400,category:"Operations",description:"Assembly components",assetNumber:"—",subsidiary:"CZ",received:"11 Dec 2026",risk:"Cross-border approval",initialCode:"OPEX · 4711",expected:"Second approval",role:"expert"},
 {id:"INV-4474",supplier:"Werkhalle Systems",amount:8100,category:"Equipment",description:"Hydraulic workstation",assetNumber:"Missing",subsidiary:"DE",received:"15 Dec 2026",risk:"No asset number",initialCode:"OPEX · 4711",expected:"Stop and ask controller",role:"teach"},
 {id:"INV-4475",supplier:"Nordpump AG",amount:9600,category:"Equipment",description:"Industrial pump",assetNumber:"A-1992",subsidiary:"DE",received:"17 Dec 2026",risk:"None",initialCode:"OPEX · 4711",expected:"CAPEX · 0400",role:"teach"}
];
export const expertInvoices = invoices.filter(x=>x.role==="expert");
export const teachInvoices = invoices.filter(x=>x.role==="teach");
