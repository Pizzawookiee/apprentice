"""Optional Vercel Python endpoint for fuller Presidio redaction.

The Next /api/privacy route is the stable entry point and uses this endpoint when
PRESIDIO_URL is configured. A small regex fallback keeps the demo functional if
the NLP bundle cannot load; production should verify provider=Presidio.
"""
import json
import re
from http.server import BaseHTTPRequestHandler


def redact(text: str):
    entities = []
    try:
        from presidio_analyzer import AnalyzerEngine
        from presidio_anonymizer import AnonymizerEngine
        analyzer = AnalyzerEngine()
        found = analyzer.analyze(
            text=text,
            language="en",
            entities=["PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", "CREDIT_CARD", "US_SSN", "IP_ADDRESS", "IBAN_CODE"],
        )
        entities = [{"type": item.entity_type, "start": item.start, "end": item.end} for item in found]
        text = AnonymizerEngine().anonymize(text=text, analyzer_results=found).text
        provider = "Presidio"
    except Exception:
        provider = "fallback recognizers"
    for pattern, replacement in [
        (r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[EMAIL]"),
        (r"\b\d{3}-\d{2}-\d{4}\b", "[US_SSN]"),
        (r"\b(?:DE|GB|FR|NL|BE|CZ)\d{2}[A-Z0-9]{11,30}\b", "[IBAN]"),
    ]:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return {"sanitizedText": text, "entities": entities, "provider": provider}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            size = int(self.headers.get("content-length", "0"))
            if size > 20000:
                raise ValueError("Request too large")
            body = json.loads(self.rfile.read(size))
            if not isinstance(body.get("text"), str):
                raise ValueError("text required")
            result = redact(body["text"])
            payload = json.dumps(result).encode()
            self.send_response(200)
        except Exception as exc:
            payload = json.dumps({"error": str(exc)}).encode()
            self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
