from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "demo" / "invoices"
OUT.mkdir(parents=True, exist_ok=True)
records = [
    ("INV-4471", "Muster Technik GmbH", "CNC calibration unit", "EUR 7,200", "Equipment", "A-1837", "DE", "04 Dec 2026", "No risk flag"),
    ("INV-4472", "Rhein Supply Co.", "Replacement machine parts", "EUR 1,840", "Operations", "Not applicable", "DE", "08 Dec 2026", "Supplier has a December duplicate-billing history"),
    ("INV-4473", "Morava Components s.r.o.", "Assembly components", "EUR 3,400", "Operations", "Not applicable", "CZ", "11 Dec 2026", "Czech subsidiary; second approval may be required"),
    ("INV-4474", "Werkhalle Systems", "Hydraulic workstation", "EUR 8,100", "Equipment", "Missing", "DE", "15 Dec 2026", "Asset number missing"),
    ("INV-4475", "Nordpump AG", "Industrial pump", "EUR 9,600", "Equipment", "A-1992", "DE", "17 Dec 2026", "No risk flag"),
]
for invoice_id, supplier, description, amount, category, asset, subsidiary, received, note in records:
    path = OUT / f"{invoice_id}.pdf"
    c = canvas.Canvas(str(path), pagesize=A4)
    w, h = A4
    c.setFillColorRGB(.08,.19,.13)
    c.rect(0,h-115,w,115,stroke=0,fill=1)
    c.setFillColorRGB(1,1,1)
    c.setFont("Helvetica-Bold",27)
    c.drawString(48,h-65,"SUPPLIER INVOICE")
    c.setFont("Helvetica",11)
    c.drawString(49,h-88,invoice_id)
    c.setFillColorRGB(.14,.21,.16)
    c.setFont("Helvetica-Bold",15)
    c.drawString(48,h-160,supplier)
    c.setFont("Helvetica",10)
    rows=[("Invoice ID",invoice_id),( "Received",received),("Description",description),("Amount due",amount),("Category",category),("Asset number",asset),("Subsidiary",subsidiary),("Review note",note)]
    y=h-205
    for label,value in rows:
        c.setStrokeColorRGB(.87,.9,.87)
        c.line(48,y-10,w-48,y-10)
        c.setFillColorRGB(.49,.56,.5)
        c.setFont("Helvetica",10)
        c.drawString(48,y,label)
        c.setFillColorRGB(.1,.2,.14)
        c.setFont("Helvetica-Bold",10)
        c.drawString(180,y,value)
        y-=44
    c.setFillColorRGB(.48,.57,.5)
    c.setFont("Helvetica",9)
    c.drawString(48,65,"Synthetic hackathon sandbox data. No real person or company information.")
    c.save()
    print(path)
