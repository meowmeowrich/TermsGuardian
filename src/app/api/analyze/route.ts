import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://terms-guardian.vercel.app',
    'X-Title': 'Terms Guardian',
  }
});

const SYSTEM_PROMPT = `You are "Terms Guardian", an aggressive consumer protection analyst, privacy investigator, and legal risk detector.
Your goal is NOT to summarize, but to actively search for hidden risks, dangerous clauses, and anti-consumer wording.

Assume companies may exploit every loophole. Highlight potential abuse possibilities and explain realistic consequences in plain human language.
You must be thorough, skeptical, and prioritize the user's safety.

Analyze for:
- Hidden risks and dangerous clauses
- Data harvesting and third-party sharing
- Account termination abuse
- Arbitration and forced waivers
- Auto-renewals and subscription traps
- Ownership/license traps
- Vague wording and suspicious loopholes
- Dark patterns and liability shifting

You MUST return your response in the following structured JSON format:
{
  "title": "Document Title",
  "summary": "Brief aggressive overview of the document's consumer impact",
  "scores": {
    "privacy": 0-100 (high is better for consumer),
    "danger": 0-100 (low is better for consumer),
    "friendliness": 0-100 (high is better for consumer)
  },
  "findings": [
    {
      "category": "e.g., Privacy, Financial, Termination, Liability",
      "severity": "high" | "medium" | "low",
      "title": "Finding Title",
      "description": "Clear explanation of the clause",
      "consequence": "What this really means for the user and what could go wrong",
      "recommendation": "What the user should do"
    }
  ],
  "verdict": "Should the user avoid this? (Aggressive recommendation)",
  "redFlags": ["List of biggest red flags"],
  "bestClauses": ["List of any consumer-friendly clauses if they exist"]
}

Be direct, slightly alarmist (if justified), and extremely detailed. Do not be polite to the company.`;

export async function POST(req: NextRequest) {
  try {
    const { content, title, sourceType, sourceUrl } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this document: \n\n${content.substring(0, 30000)}` } // Cap length for safety
      ],
      response_format: { type: 'json_object' }
    });

    const aiOutput = response.choices[0].message.content;
    if (!aiOutput) throw new Error('Empty AI response');

    const parsedOutput = JSON.parse(aiOutput);

    // Save to database
    const analysis = await prisma.analysis.create({
      data: {
        title: title || parsedOutput.title || 'Untitled Document',
        content: content.substring(0, 5000), // Store preview of content
        summary: parsedOutput.summary,
        privacyScore: parsedOutput.scores.privacy,
        dangerScore: parsedOutput.scores.danger,
        friendlinessScore: parsedOutput.scores.friendliness,
        riskAnalysis: JSON.stringify(parsedOutput.findings),
        fullResponse: aiOutput,
        sourceType,
        sourceUrl
      }
    });

    return NextResponse.json({ ...parsedOutput, id: analysis.id });
  } catch (error: any) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze document' }, { status: 500 });
  }
}
