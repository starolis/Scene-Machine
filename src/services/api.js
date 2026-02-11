const API_URL = '/.netlify/functions/chat';

async function callApi(messages, max_tokens) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, max_tokens }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Something went wrong. Please try again.');
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  if (!content) {
    console.error('Unexpected API response:', JSON.stringify(data));
    throw new Error('Unexpected response from AI. Please try again.');
  }
  const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse JSON. Raw content:', content);
    throw new Error('Could not parse AI response. Please try again.');
  }
}

export async function generateVividExample(originalText) {
  const prompt = `You are a creative writing teacher helping young writers (ages 9-12) learn to write vividly.

A student wrote this rough draft or idea:
"""
${originalText}
"""

Your job:
1. Rewrite this into EXACTLY 3 vivid, engaging sentences
2. Add sensory details (sight, sound, smell, taste, touch)
3. Add emotional details (feelings, thoughts, reactions)
4. Add setting details (where/when, atmosphere)
5. Add specific action details (precise movements)

IMPORTANT: Return your response as JSON in this exact format:
{
  "vividText": "The full vivid rewrite as exactly 3 sentences",
  "highlights": [
    {"text": "exact phrase from vividText", "type": "sensory"},
    {"text": "another exact phrase", "type": "emotional"},
    {"text": "another phrase", "type": "setting"},
    {"text": "another phrase", "type": "action"}
  ]
}

Include 4-6 highlights total, spread across all 4 types. The "text" must be EXACT substrings from vividText.
Keep the tone fun and age-appropriate. Make it exciting! Remember: EXACTLY 3 sentences.

Return ONLY the JSON, no other text.`;

  try {
    return await callApi([{ role: 'user', content: prompt }], 2000);
  } catch (error) {
    console.error('Error generating example:', error);
    throw new Error('Oops! Something went wrong. Please try again.');
  }
}

export async function checkUserRewrite(originalText, aiExampleText, userRewrite) {
  const prompt = `You are a friendly, encouraging writing teacher for young writers (ages 9-12).

ORIGINAL ROUGH DRAFT:
"""
${originalText}
"""

AI EXAMPLE (what the student studied):
"""
${aiExampleText}
"""

STUDENT'S OWN REWRITE:
"""
${userRewrite}
"""

Analyze the student's rewrite. IMPORTANT: The student is SUPPOSED to write about the same story/scene - that's the assignment!

Only mark as "too similar" if they COPIED exact phrases word-for-word from the AI example. Using the same plot, characters, or story events is FINE and expected. We want them to tell the SAME story in THEIR OWN WORDS.

Examples of GOOD (not too similar):
- AI says "heart pounding like a drum" → Student says "heart pounding so fast" ✓ GOOD
- AI says "darted around the corner" → Student says "zoomed towards" ✓ GOOD
- AI says "trembling hand" → Student says "slammed his hand down" ✓ GOOD
- Using their own slang like "sus" instead of "suspicious" ✓ GREAT!

Examples of ACTUAL copying (too similar):
- Student uses "fingers flew across the glowing tablet" exactly
- Student copies whole sentences word-for-word

Return JSON:
{
  "similarityScore": <0-100, only high if they copied exact phrases>,
  "vividnessScore": <0-100, how vivid their writing is>,
  "overallRating": "<'amazing' | 'great' | 'good' | 'needs_work' | 'too_similar'>",
  "isTooSimilar": <true ONLY if they copied exact phrases, NOT for same story>,
  "sensoryDetails": ["list", "of", "sensory", "details", "they", "used"],
  "emotionalDetails": ["list", "of", "emotional", "details"],
  "settingDetails": ["list", "of", "setting", "details"],
  "actionDetails": ["list", "of", "action", "details"],
  "praise": "A specific, encouraging comment about what they did well - notice their unique word choices! (1-2 sentences)",
  "suggestion": "One friendly suggestion to make it even better (1-2 sentences)",
  "encouragement": "A fun, motivating closing message (1 sentence)"
}

Be encouraging! If they rewrote it in their own words (even if the story is the same), that's SUCCESS!
Return ONLY JSON.`;

  try {
    return await callApi([{ role: 'user', content: prompt }], 1500);
  } catch (error) {
    console.error('Error checking rewrite:', error);
    throw new Error('Oops! Something went wrong checking your work.');
  }
}
