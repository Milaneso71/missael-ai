export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      return new Response(
        JSON.stringify({
          reply: "¡Hola! Soy MISSAEL AI. Mi cerebro está en preparación."
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
