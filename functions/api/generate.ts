interface Env {
  GEMINI_API_KEY: string;
  ACCESS_PASSWORD: string;
}

interface RequestBody {
  review: string;
  goal: string;
  password: string;
}

interface KanjiResponse {
  kanji: string;
  meaning_jp: string;
  meaning_en: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
    code?: number;
  };
  modelVersion?: string;
}

// JSON Schema for structured output
const responseSchema = {
  type: "object",
  properties: {
    kanji: {
      type: "string",
      description: "選定した漢字1文字"
    },
    meaning_jp: {
      type: "string",
      description: "その漢字を選んだ理由と、ユーザーへの励ましのメッセージ（日本語、2-3文）"
    },
    meaning_en: {
      type: "string",
      description: "The reason for choosing this kanji and an encouraging message (English, 2-3 sentences)"
    }
  },
  required: ["kanji", "meaning_jp", "meaning_en"]
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if environment variables are set
    if (!context.env.ACCESS_PASSWORD || !context.env.GEMINI_API_KEY) {
      console.error('Environment variables not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse request body
    const body: RequestBody = await context.request.json();
    const { review, goal, password } = body;

    // Validate password
    if (!password || password !== context.env.ACCESS_PASSWORD) {
      console.error('Password validation failed');
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Validate inputs
    if (!review || !goal) {
      return new Response(
        JSON.stringify({ error: 'Review and goal are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': context.env.GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: 'あなたは書道の達人です。ユーザーの2025年の振り返りと2026年の目標を深く解釈し、2026年の指針となる「漢字1文字」を選定してください。'
              }
            ]
          },
          contents: [
            {
              parts: [
                {
                  text: `【2025年の振り返り】
${review}

【2026年の目標】
${goal}

上記を踏まえ、ユーザーにとって最適な漢字1文字を選定してください。`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 1.0,
            top_k: 40,
            top_p: 0.95,
            max_output_tokens: 8192,
            response_mime_type: 'application/json',
            response_schema: responseSchema
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => null) as GeminiResponse | null;
      console.error('Gemini API error:', {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to generate kanji',
          details: errorData?.error?.message || 'Unknown error'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const geminiData = await geminiResponse.json() as GeminiResponse;

    // Extract the generated text
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('No response from Gemini API:', JSON.stringify(geminiData, null, 2));
      return new Response(
        JSON.stringify({
          error: 'No response from AI',
          finishReason: geminiData.candidates?.[0]?.finishReason,
          modelVersion: geminiData.modelVersion
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse the JSON response
    let kanjiResult: KanjiResponse;
    try {
      kanjiResult = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', generatedText, parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON response from AI',
          rawText: generatedText,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Validate the result
    if (!kanjiResult.kanji || !kanjiResult.meaning_jp || !kanjiResult.meaning_en) {
      console.error('Invalid response format:', kanjiResult);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from AI' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify(kanjiResult),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in generate function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
