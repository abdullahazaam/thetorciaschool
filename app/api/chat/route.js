import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, KNOWLEDGE_BASE, getKnowledgeResponse } from '@/lib/chatbot-context';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, messages, history = [] } = body;

    // Determine the latest user message
    const userMessage =
      message ||
      (Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1].content || messages[messages.length - 1].text
        : '');

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Valid user message is required' },
        { status: 400 }
      );
    }

    // 1. Check if Gemini API is configured
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        
        // Prepare chat history payload
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease strictly answer the following query using ONLY the verified school data above.\n\nUser Question: ${userMessage}` }],
          },
        ];

        const aiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            },
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText =
            aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              source: 'gemini-llm',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local knowledge engine:', geminiErr.message);
      }
    }

    // 2. Check if OpenAI API is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...history.slice(-4).map((h) => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.text,
              })),
              { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText = aiData?.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              source: 'openai-llm',
            });
          }
        }
      } catch (openaiErr) {
        console.warn('OpenAI API call failed, falling back to local knowledge engine:', openaiErr.message);
      }
    }

    // 3. High-Fidelity Context Matcher (Strict Knowledge Base Grounding)
    const matchedResponse = getKnowledgeResponse(userMessage);
    if (matchedResponse) {
      return NextResponse.json({
        reply: matchedResponse,
        source: 'knowledge-base',
      });
    }

    // 4. Default Intelligent Fallback
    const defaultReply =
      `Thank you for reaching out to **The Torcia School** (*"Growing Future Leaders"*).\n\n` +
      `Here is a quick summary of our admissions & programs:\n` +
      `• **Programs:** Early Years (Playgroup & Montessori with sensory activities), Primary (Grade I–V), and our flagship **STEM Programme** (Robotics, AI, Coding, IoT).\n` +
      `• **Fee Structure:** Admission Fee: Rs. 15,000 | Annual Charges: Rs. 4,000 | Monthly Tuition: Rs. 5,000.\n` +
      `• **School Timings:** Pre-Primary (8:30 am–12:30 pm, Fri 12:00 noon) | Primary (7:45 am–1:30 pm, Fri 12:30 pm).\n\n` +
      `Would you like to know more about our **Admission Criteria**, **Required Documents**, or schedule a campus visit at our Nazimabad branch? You can also contact our desk directly at **0342-2049976**.`;

    return NextResponse.json({
      reply: defaultReply,
      source: 'knowledge-base-default',
    });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        reply:
          'Our admissions counseling desk is currently online. For immediate assistance with admissions or fee schedules, please call us at 0342-2049976 or visit our campus in Nazimabad.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    school: KNOWLEDGE_BASE.schoolName,
    slogan: KNOWLEDGE_BASE.slogan,
    programs: KNOWLEDGE_BASE.programs,
    admissionCriteria: KNOWLEDGE_BASE.admissionCriteria,
    requiredDocuments: KNOWLEDGE_BASE.requiredDocuments,
    schoolTimings: KNOWLEDGE_BASE.schoolTimings,
    feeStructure: KNOWLEDGE_BASE.feeStructure,
  });
}
