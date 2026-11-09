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

    // 0. Immediate High-Precision Conversational Greeting & Check-in Handler
    const matchedGreeting = getKnowledgeResponse(userMessage);
    const isGreeting = /^(salam|assalam|aoa|slm|hi|hello|hey|kaise|kese|how are you|how r u|kya hal|kya haal)/i.test(userMessage.trim());
    if (matchedGreeting && isGreeting) {
      return NextResponse.json({
        reply: matchedGreeting,
        source: 'knowledge-base-greeting',
      });
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
      `Thank you for contacting **The Torcia School** (*"Growing Future Leaders"*).\n\n` +
      `I would be happy to assist you! How can I help you and your child today? You can ask me about:\n\n` +
      `• **Admissions & Age Criteria** (Playgroup to Grade V)\n` +
      `• **Fee Structure** (Admission, Annual & Monthly fees)\n` +
      `• **School Timings** (Pre-Primary & Primary schedules)\n` +
      `• **Required Documents** for registration\n` +
      `• **STEM & Robotics Curriculum**\n\n` +
      `You can also reach our admissions desk directly at **0342-2049976** or visit our campus at **Plot # 20/13 Block 5C, Nazimabad, Karachi**.`;

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
