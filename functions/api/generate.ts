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
  }>;
}

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
    // Parse request body
    const body: RequestBody = await context.request.json();
    const { review, goal, password } = body;

    // Validate password
    if (password !== context.env.ACCESS_PASSWORD) {
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${context.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `あなたは書道の達人です。ユーザーの2025年の振り返りと2026年の目標を深く解釈し、2026年の指針となる「漢字1文字」を選定してください。

【2025年の振り返り】
${review}

【2026年の目標】
${goal}

上記を踏まえ、ユーザーにとって最適な漢字1文字を選定し、以下のJSON形式で出力してください：

{
  "kanji": "選定した漢字1文字",
  "meaning_jp": "その漢字を選んだ理由と、ユーザーへの励ましのメッセージ（日本語、2-3文）",
  "meaning_en": "The reason for choosing this kanji and an encouraging message for the user (English, 2-3 sentences)"
}

必ずJSON形式で出力してください。`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate kanji' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const geminiData = await geminiResponse.json() as GeminiResponse;

    // Extract the generated text
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse the JSON response
    const kanjiResult: KanjiResponse = JSON.parse(generatedText);

    // Validate the result
    if (!kanjiResult.kanji || !kanjiResult.meaning_jp || !kanjiResult.meaning_en) {
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
