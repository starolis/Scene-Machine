import React, { useState } from 'react';

// ============================================
// DETAIL CATEGORIES FOR HIGHLIGHTING
// ============================================

const DETAIL_TYPES = {
  sensory: {
    label: 'Sensory Details',
    icon: '👁️',
    color: '#ec4899',
    bgColor: '#ec489930',
    description: 'What you see, hear, smell, taste, or feel'
  },
  emotional: {
    label: 'Emotional Details',
    icon: '💜',
    color: '#8b5cf6',
    bgColor: '#8b5cf630',
    description: 'Feelings, thoughts, and reactions'
  },
  setting: {
    label: 'Setting Details',
    icon: '🏔️',
    color: '#06b6d4',
    bgColor: '#06b6d430',
    description: 'Where and when things happen'
  },
  action: {
    label: 'Action Details',
    icon: '⚡',
    color: '#22c55e',
    bgColor: '#22c55e30',
    description: 'Specific movements and what happens'
  }
};

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function SceneMachine() {
  // App State
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'learn', 'practice', 'feedback'
  const [originalText, setOriginalText] = useState('');
  const [aiExample, setAiExample] = useState(null); // { text, highlights }
  const [userRewrite, setUserRewrite] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // ============================================
  // AI FUNCTIONS
  // ============================================

  const generateVividExample = async () => {
    if (!originalText.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are a creative writing teacher helping young writers (ages 9-12) learn to write vividly.

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

Return ONLY the JSON, no other text.`
          }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
     
      // Parse JSON response
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);
     
      setAiExample(parsed);
      setCurrentStep('learn');
    } catch (error) {
      console.error('Error:', error);
      alert('Oops! Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const checkUserRewrite = async () => {
    if (!userRewrite.trim()) {
      alert('Write your own version first!');
      return;
    }

    if (userRewrite.trim().length < 50) {
      alert('Your rewrite is too short! Try adding more details.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `You are a friendly, encouraging writing teacher for young writers (ages 9-12).

ORIGINAL ROUGH DRAFT:
"""
${originalText}
"""

AI EXAMPLE (what the student studied):
"""
${aiExample.vividText}
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
Return ONLY JSON.`
          }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      setFeedback(parsed);
      setCurrentStep('feedback');
    } catch (error) {
      console.error('Error:', error);
      alert('Oops! Something went wrong checking your work.');
    }

    setIsLoading(false);
  };

  const startOver = () => {
    setCurrentStep('input');
    setOriginalText('');
    setAiExample(null);
    setUserRewrite('');
    setFeedback(null);
  };

  const tryAgain = () => {
    setUserRewrite('');
    setFeedback(null);
    setCurrentStep('practice');
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderHighlightedText = () => {
    if (!aiExample) return null;

    let text = aiExample.vividText;
    const highlights = [...aiExample.highlights].sort((a, b) => {
      const posA = text.indexOf(a.text);
      const posB = text.indexOf(b.text);
      return posA - posB;
    });

    const parts = [];
    let lastIndex = 0;

    highlights.forEach((highlight, i) => {
      const startIndex = text.indexOf(highlight.text, lastIndex);
      if (startIndex === -1) return;

      // Add text before highlight
      if (startIndex > lastIndex) {
        parts.push({
          type: 'normal',
          text: text.slice(lastIndex, startIndex),
          key: `normal-${i}`
        });
      }

      // Add highlighted text
      parts.push({
        type: highlight.type,
        text: highlight.text,
        key: `highlight-${i}`
      });

      lastIndex = startIndex + highlight.text.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'normal',
        text: text.slice(lastIndex),
        key: 'normal-end'
      });
    }

    return (
      <div className="leading-relaxed text-lg">
        {parts.map(part => {
          if (part.type === 'normal') {
            return <span key={part.key}>{part.text}</span>;
          }
          const detail = DETAIL_TYPES[part.type];
          return (
            <span
              key={part.key}
              className="px-1 py-0.5 rounded mx-0.5 cursor-help transition-all hover:scale-105 inline-block"
              style={{
                backgroundColor: detail.bgColor,
                borderBottom: `2px solid ${detail.color}`,
                color: detail.color
              }}
              title={`${detail.label}: ${detail.description}`}
            >
              {part.text}
            </span>
          );
        })}
      </div>
    );
  };

  // ============================================
  // INPUT STEP
  // ============================================

  if (currentStep === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Nunito', sans-serif; }
        `}</style>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <span className="text-3xl">✨</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Scene Machine
              </span>
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Make Your Ideas Come Alive!
            </h1>
            <p className="text-xl text-slate-300">
              Learn to write stories that jump off the page 🚀
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🎯</span> How It Works
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <p className="font-semibold text-cyan-300">Share Your Idea</p>
                <p className="text-sm text-slate-400 mt-1">Write your rough draft</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <p className="font-semibold text-purple-300">Learn from an Example</p>
                <p className="text-sm text-slate-400 mt-1">See how to make it vivid</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <p className="font-semibold text-pink-300">Write YOUR Version</p>
                <p className="text-sm text-slate-400 mt-1">Practice & get feedback!</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold">Your Rough Draft or Idea</h2>
            </div>
           
            <p className="text-slate-400 mb-4">
              Write a basic version of your scene. Don't worry if it's short or simple — that's the point!
              We'll help you learn to make it amazing. ✨
            </p>

            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Example: The cat walked into the room and looked around. It was hungry and wanted food."
              className="w-full h-48 bg-slate-800/50 rounded-2xl p-5 text-lg text-slate-200 placeholder-slate-500 resize-none border-2 border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-500">
                {originalText.split(/\s+/).filter(w => w).length} words
              </span>
             
              <button
                onClick={generateVividExample}
                disabled={!originalText.trim() || isLoading}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 ${
                  !originalText.trim()
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Example...
                  </>
                ) : (
                  <>
                    <span>🪄</span>
                    Show Me How to Make It Vivid!
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
              <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-2">
                <span>💡</span> Great Ideas to Try:
              </h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• A scene from your story</li>
                <li>• A character meeting someone</li>
                <li>• An exciting moment or chase</li>
                <li>• A discovery or surprise</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
              <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-2">
                <span>🎓</span> You'll Learn:
              </h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Sensory details (see, hear, smell)</li>
                <li>• Emotional depth (feelings)</li>
                <li>• Setting atmosphere (where/when)</li>
                <li>• Specific actions (how things move)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // LEARN STEP (View Example)
  // ============================================

  if (currentStep === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Nunito', sans-serif; }
        `}</style>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-xl font-bold">Scene Machine</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
              <span className="text-purple-400 font-semibold">Step 2 of 3</span>
              <span>🎓</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Study the Example! 📚
          </h1>
          <p className="text-center text-slate-400 mb-6">
            Look at the highlighted words to see WHAT makes writing vivid. When you're ready, you'll write YOUR own version!
          </p>

          {/* Legend */}
          <div className="bg-slate-900/80 rounded-2xl p-4 mb-6 border border-slate-700/50">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-bold flex items-center gap-2">
                <span>🎨</span> Color Guide (What Each Color Means)
              </h3>
              <span className="text-slate-400">{showLegend ? '▲' : '▼'}</span>
            </button>
           
            {showLegend && (
              <div className="grid sm:grid-cols-4 gap-3 mt-4">
                {Object.entries(DETAIL_TYPES).map(([key, detail]) => (
                  <div
                    key={key}
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: detail.bgColor, borderLeft: `4px solid ${detail.color}` }}
                  >
                    <div className="text-2xl mb-1">{detail.icon}</div>
                    <div className="font-semibold text-sm" style={{ color: detail.color }}>{detail.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{detail.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-slate-400">
                <span>📝</span> Your Original
              </h3>
              <p className="text-slate-300 leading-relaxed">{originalText}</p>
            </div>

            {/* Vivid Example */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-purple-300">
                <span>✨</span> Vivid Example (Study This!)
              </h3>
              {renderHighlightedText()}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl p-6 border border-emerald-500/30 text-center">
            <h3 className="text-xl font-bold text-emerald-300 mb-2">
              👀 Did you notice all the details?
            </h3>
            <p className="text-slate-300 mb-4">
              Hover over the colored words to learn more! When you're ready, try writing YOUR own vivid version.
              <br />
              <span className="text-amber-400 font-semibold">Remember: You can't just copy — you have to write it in YOUR words!</span>
            </p>
            <button
              onClick={() => setCurrentStep('practice')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>✍️</span>
                I'm Ready to Write My Own Version!
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PRACTICE STEP (Side by Side)
  // ============================================

  if (currentStep === 'practice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Nunito', sans-serif; }
        `}</style>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-xl font-bold">Scene Machine</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full">
              <span className="text-emerald-400 font-semibold">Step 3 of 3</span>
              <span>✍️</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Now Write YOUR Version! ✍️
          </h1>
          <p className="text-center text-slate-400 mb-6">
            Use the example as inspiration, but write it in YOUR own words with YOUR own ideas!
          </p>

          {/* Warning Banner */}
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-amber-300">Don't Just Copy!</p>
              <p className="text-sm text-slate-300">The tool will check if you wrote YOUR own version. Use the example to LEARN, then create something original!</p>
            </div>
          </div>

          {/* Side by Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Example (Reference) */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 max-h-[600px] overflow-y-auto">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-purple-300 sticky top-0 bg-slate-800/90 py-2 -mt-2">
                <span>📖</span> Example to Learn From
              </h3>
              <div className="text-slate-300 leading-relaxed">
                {renderHighlightedText()}
              </div>
             
              {/* Mini Legend */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700">
                {Object.entries(DETAIL_TYPES).map(([key, detail]) => (
                  <span
                    key={key}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: detail.bgColor, color: detail.color }}
                  >
                    {detail.icon} {detail.label}
                  </span>
                ))}
              </div>
            </div>

            {/* User Writing Area */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 rounded-2xl p-6 border border-emerald-500/30">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-emerald-300">
                <span>✍️</span> Your Version (Write Here!)
              </h3>
             
              <textarea
                value={userRewrite}
                onChange={(e) => setUserRewrite(e.target.value)}
                placeholder="Write YOUR vivid version here!

Remember to include:
👁️ What do you SEE, HEAR, SMELL?
💜 What FEELINGS are there?
🏔️ What's the SETTING like?
⚡ What specific ACTIONS happen?

Make it YOUR story!"
                className="w-full h-80 bg-slate-800/50 rounded-2xl p-5 text-lg text-slate-200 placeholder-slate-500 resize-none border-2 border-emerald-700/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-500">
                  {userRewrite.split(/\s+/).filter(w => w).length} words
                </span>
               
                <button
                  onClick={checkUserRewrite}
                  disabled={userRewrite.trim().length < 50 || isLoading}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 ${
                    userRewrite.trim().length < 50
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25 hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      Check My Writing!
                    </>
                  )}
                </button>
              </div>

              {userRewrite.trim().length > 0 && userRewrite.trim().length < 50 && (
                <p className="text-amber-400 text-sm mt-2">
                  ✏️ Keep writing! You need at least 50 characters.
                </p>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep('learn')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Go back to study the example
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // FEEDBACK STEP
  // ============================================

  if (currentStep === 'feedback') {
    const getRatingEmoji = () => {
      switch (feedback?.overallRating) {
        case 'amazing': return '🌟';
        case 'great': return '🎉';
        case 'good': return '👍';
        case 'needs_work': return '💪';
        case 'too_similar': return '🔄';
        default: return '📝';
      }
    };

    const getRatingColor = () => {
      switch (feedback?.overallRating) {
        case 'amazing': return 'from-yellow-500 to-orange-500';
        case 'great': return 'from-emerald-500 to-cyan-500';
        case 'good': return 'from-blue-500 to-indigo-500';
        case 'needs_work': return 'from-purple-500 to-pink-500';
        case 'too_similar': return 'from-amber-500 to-red-500';
        default: return 'from-slate-500 to-slate-600';
      }
    };

    const getRatingText = () => {
      switch (feedback?.overallRating) {
        case 'amazing': return 'AMAZING WORK!';
        case 'great': return 'GREAT JOB!';
        case 'good': return 'GOOD EFFORT!';
        case 'needs_work': return 'KEEP PRACTICING!';
        case 'too_similar': return 'TRY AGAIN!';
        default: return 'RESULTS';
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Nunito', sans-serif; }
          @keyframes pop-in {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          .pop-in { animation: pop-in 0.4s ease-out; }
        `}</style>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-xl font-bold">Scene Machine</span>
            </div>
            <span className="text-2xl">{getRatingEmoji()}</span>
          </div>

          {/* Rating Card */}
          <div className={`pop-in bg-gradient-to-r ${getRatingColor()} rounded-3xl p-8 mb-6 text-center shadow-2xl`}>
            <div className="text-6xl mb-4">{getRatingEmoji()}</div>
            <h1 className="text-4xl font-extrabold mb-2">{getRatingText()}</h1>
            {feedback?.isTooSimilar ? (
              <p className="text-xl opacity-90">Your writing was too similar to the example. Let's try again with YOUR ideas!</p>
            ) : (
              <p className="text-xl opacity-90">Vividness Score: {feedback?.vividnessScore}/100</p>
            )}
          </div>

          {feedback?.isTooSimilar ? (
            /* Too Similar Feedback */
            <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-700/50 text-center">
              <h2 className="text-2xl font-bold mb-4">🎯 The Challenge</h2>
              <p className="text-lg text-slate-300 mb-6">
                The goal isn't to copy the example — it's to LEARN from it and write YOUR own vivid version!
                Try using different words, different details, and YOUR unique imagination.
              </p>
             
              <div className="bg-amber-500/20 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-amber-400 mb-2">💡 Tips for Your Next Try:</h3>
                <ul className="text-slate-300 text-left max-w-md mx-auto space-y-1">
                  <li>• Use different describing words</li>
                  <li>• Add YOUR favorite details</li>
                  <li>• Imagine the scene in YOUR way</li>
                  <li>• What would YOU notice if you were there?</li>
                </ul>
              </div>

              <button
                onClick={tryAgain}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <span>✍️</span>
                  Try Again With My Own Ideas!
                </span>
              </button>
            </div>
          ) : (
            /* Success Feedback */
            <>
              {/* Praise & Suggestion */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-emerald-500/20 rounded-2xl p-6 border border-emerald-500/30">
                  <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-3">
                    <span>🌟</span> What You Did Great
                  </h3>
                  <p className="text-slate-200">{feedback?.praise}</p>
                </div>
                <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-500/30">
                  <h3 className="font-bold text-purple-400 flex items-center gap-2 mb-3">
                    <span>💡</span> Try This Next Time
                  </h3>
                  <p className="text-slate-200">{feedback?.suggestion}</p>
                </div>
              </div>

              {/* Details Found */}
              <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-700/50 mb-6">
                <h3 className="font-bold text-lg mb-4">📊 Details I Found in Your Writing:</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(DETAIL_TYPES).map(([key, detail]) => {
                    const detailList = feedback?.[`${key}Details`] || [];
                    return (
                      <div
                        key={key}
                        className="rounded-xl p-4"
                        style={{ backgroundColor: detail.bgColor }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span>{detail.icon}</span>
                          <span className="font-semibold" style={{ color: detail.color }}>{detail.label}</span>
                          <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
                            {detailList.length}
                          </span>
                        </div>
                        {detailList.length > 0 ? (
                          <ul className="text-sm text-slate-300 space-y-1">
                            {detailList.slice(0, 3).map((d, i) => (
                              <li key={i}>• {d}</li>
                            ))}
                            {detailList.length > 3 && (
                              <li className="text-slate-500">+{detailList.length - 3} more!</li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">Try adding some next time!</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Encouragement */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-6 border border-cyan-500/30 text-center mb-6">
                <p className="text-xl text-cyan-300 font-semibold">
                  {feedback?.encouragement}
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!feedback?.isTooSimilar && (
              <button
                onClick={tryAgain}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
              >
                ✍️ Try This Scene Again
              </button>
            )}
            <button
              onClick={startOver}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              🚀 Start a New Scene!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}