import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/db";
import { sanitizeValue } from "@/lib/privacy";
export async function POST(request:NextRequest){const body=await request.json().catch(()=>null);if(!body||typeof body.id!=="string"||body.offRecord)return NextResponse.json({discarded:true});const db=database();if(!db)return NextResponse.json({persisted:false});try{const safe=sanitizeValue(body);await db`INSERT INTO sessions (id, started_at, state) VALUES (${body.id}, ${new Date(body.startedAt).toISOString()}, ${JSON.stringify(safe)}::jsonb) ON CONFLICT (id) DO UPDATE SET state=excluded.state`;return NextResponse.json({persisted:true});}catch{return NextResponse.json({error:"Persistence unavailable"},{status:503})}}
