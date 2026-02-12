export default function InputStep({
  originalText,
  onOriginalTextChange,
  onGenerate,
  isLoading,
}) {
  const MAX_WORDS = 150;
  const wordCount = originalText.split(/\s+/).filter((w) => w).length;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleTextChange = (value) => {
    const words = value.split(/\s+/).filter((w) => w);
    if (words.length <= MAX_WORDS) {
      onOriginalTextChange(value);
    } else {
      const trimmed = words.slice(0, MAX_WORDS).join(' ');
      onOriginalTextChange(trimmed);
    }
  };

  return (
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
          Write a basic version of your scene. Don't worry if it's short or
          simple — that's the point! We'll help you learn to make it amazing. ✨
        </p>

        <textarea
          value={originalText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Example: The cat walked into the room and looked around. It was hungry and wanted food."
          className="w-full h-48 bg-slate-800/50 rounded-2xl p-5 text-lg text-slate-200 placeholder-slate-500 resize-none border-2 border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
        />

        <div className="flex items-center justify-between mt-4">
          <span className={`text-sm ${wordCount >= MAX_WORDS ? 'text-amber-400' : 'text-slate-500'}`}>
            {wordCount}/{MAX_WORDS} words
          </span>

          <button
            onClick={onGenerate}
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
  );
}
