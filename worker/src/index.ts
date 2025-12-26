export default {
  async fetch(request: Request): Promise<Response> {
    console.log("fetch worker");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
    };
    const message = typeof body.message === "string" ? body.message : "";

    const response = {
      reply: message
        ? `Worker received: ${message}`
        : "Worker is online. Send a message to get a reply."
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders()
      }
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
