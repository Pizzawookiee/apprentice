import { NextResponse } from "next/server";
import { database } from "@/lib/db";
export async function GET(){const db=database();let databaseStatus="not configured";if(db){try{await db`SELECT 1`;databaseStatus="connected"}catch{databaseStatus="unavailable"}}return NextResponse.json({ok:true,database:databaseStatus,elevenlabs:!!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,anthropic:!!process.env.ANTHROPIC_API_KEY,jev:!!process.env.JEV_API_KEY,mcp:!!process.env.MCP_SHARED_SECRET});}
