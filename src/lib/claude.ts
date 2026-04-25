/**
 * 🤖 CLAUDE ADAPTER — edge-runtime safe (raw fetch, matches deepseek.ts pattern)
 *
 * Uses Claude Haiku 4.5 ($1/$5 per 1M input/output tokens, 200K context).
 * JSON output is forced via assistant-turn prefill: the model continues from `{`
 * so the response is guaranteed parseable as JSON.
 *
 * cache_control on the system prompt silently no-ops below Haiku 4.5's
 * 4096-token minimum cacheable prefix; it activates automatically once the
 * prompt grows past that threshold.
 */
export async function generateWithClaude(prompt: string, systemPrompt: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 8192,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '{' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (typeof text !== 'string') throw new Error('Claude returned empty content');

  return JSON.parse('{' + text);
}
