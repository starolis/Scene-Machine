import HighlightedText from '../components/HighlightedText';
import { DETAIL_TYPES } from '../constants';

export default function PracticeStep({
  aiExample,
  userRewrite,
  onUserRewriteChange,
  onCheck,
  onBack,
  isLoading,
}) {
  const wordCount = userRewrite.split(/\s+/).filter((w) => w).length;

  return (
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
        Use the example as inspiration, but write it in YOUR own words with YOUR
        own ideas!
      </p>

      {/* Warning Banner */}
      <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl">⚠️</span>
        <div>
          <p className="font-bold text-amber-300">Don't Just Copy!</p>
          <p className="text-sm text-slate-300">
            The tool will check if you wrote YOUR own version. Use the example to
            LEARN, then create something original!
          </p>
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
            <HighlightedText
              text={aiExample?.vividText}
              highlights={aiExample?.highlights}
            />
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
            onChange={(e) => onUserRewriteChange(e.target.value)}
            placeholder={`Write YOUR vivid version here!\n\nRemember to include:\n👁️ What do you SEE, HEAR, SMELL?\n💜 What FEELINGS are there?\n🏔️ What's the SETTING like?\n⚡ What specific ACTIONS happen?\n\nMake it YOUR story!`}
            className="w-full h-80 bg-slate-800/50 rounded-2xl p-5 text-lg text-slate-200 placeholder-slate-500 resize-none border-2 border-emerald-700/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-slate-500">{wordCount} words</span>

            <button
              onClick={onCheck}
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
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Go back to study the example
        </button>
      </div>
    </div>
  );
}
