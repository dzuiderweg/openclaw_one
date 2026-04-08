// Central place to initialize OpenClaw once you have credentials.
// Replace the console log with the real client setup when you're ready.
export async function initOpenClaw() {
  if (import.meta.env.DEV) {
    console.info("[openclaw] Stub init called – add your real client here.");
  }

  // Example integration outline:
  // const client = new OpenClaw({ apiKey: import.meta.env.VITE_OPENCLAW_KEY });
  // await client.connect();
  // return client;
}
