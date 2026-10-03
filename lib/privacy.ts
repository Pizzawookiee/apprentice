import { createHmac } from "node:crypto";
const patterns:[RegExp,string][]=[
 [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,"[EMAIL]"],
 [/\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,"[PHONE]"],
 [/\b\d{3}-\d{2}-\d{4}\b/g,"[US_SSN]"],
 [/\b(?:\d[ -]*?){13,16}\b/g,"[CARD]"],
 [/\b(?:DE|GB|FR|NL|BE|CZ)\d{2}[A-Z0-9]{11,30}\b/gi,"[IBAN]"],
 [/\b(?:employee|account)\s*(?:id|number|no\.?|#)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi,"[IDENTIFIER]"]
];
export function sanitizeText(input:string,sessionId="demo"){let text=input;for(const [pattern,replacement] of patterns)text=text.replace(pattern,replacement);text=text.replace(/\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b(?!\s*(?:GmbH|AG|Ltd|LLC|Co\.?))/g,(name)=>{if(["Czech Subsidiary","Second Approval","Asset Number"].includes(name))return name;const id=createHmac("sha256",process.env.PRIVACY_SALT||"local-demo-only").update(sessionId+":"+name).digest("hex").slice(0,6).toUpperCase();return `[PERSON_${id}]`});return text;}
export function sanitizeValue(value:unknown):unknown {if(typeof value==="string")return sanitizeText(value);if(Array.isArray(value))return value.map(sanitizeValue);if(value&&typeof value==="object")return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,sanitizeValue(v)]));return value;}
