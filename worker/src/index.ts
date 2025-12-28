type Env = {
  OPENAI_API_KEY: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    console.log("fetch worker");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
      model?: string;
    };
    const message = typeof body.message === "string" ? body.message : "";
    const model = typeof body.model === "string" ? body.model : "gpt-4o-mini";

    if (!env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ reply: "Missing OPENAI_API_KEY in Worker secrets." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(),
          },
        }
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({
          reply: "Worker is online. Send a message to get a reply.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(),
          },
        }
      );
    }

    const openAiResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      return new Response(
        JSON.stringify({
          reply: `OpenAI error: ${openAiResponse.status} ${errorText}`,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(),
          },
        }
      );
    }

    const data = (await openAiResponse.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(),
      },
    });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
