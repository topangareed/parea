import { onRequestPost, onRequest } from "./functions/api/newsletter.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/newsletter") {
      if (request.method === "POST") {
        return onRequestPost({ request, env, ctx });
      }
      return onRequest({ request, env, ctx });
    }
    return env.ASSETS.fetch(request);
  }
};
