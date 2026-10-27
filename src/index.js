
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      };

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders
        });
      }

      if (request.method !== "POST") {
        return Response.json(
          { error: "Usa el método POST." },
          { status: 405, headers: corsHeaders }
        );
      }

      try {
        const body = await request.json();
        const message = body.message;

        if (typeof message !== "string" || !message.trim()) {
          return Response.json(
            { error: "Escribe un mensaje." },
            { status: 400, headers: corsHeaders }
          );
        }

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{
                  text: "Eres MISSAEL AI, un asistente inteligente, amigable, útil y creativo. Responde en el idioma del usuario. Sé claro y honesto."
                }]
              },
              contents: [{
                role: "user",
                parts: [{ text: message.trim() }]
              }],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7
              }
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
  const detail = data?.error?.message || "Sin detalles";

  return Response.json(
    {
      error: `Gemini API (${response.status}): ${detail}`
    },
    { status: 502, headers: corsHeaders }
  );
        }

        const reply =
          data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("") || "No pude generar una respuesta.";

        return Response.json(
          { reply },
          { headers: corsHeaders }
        );
      } catch (error) {
        return Response.json(
          { error: "Ocurrió un error al procesar tu mensaje." },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
                    
