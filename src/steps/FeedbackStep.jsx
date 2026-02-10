import { DETAIL_TYPES } from '../constants';

export default function FeedbackStep({
  feedback,
  onTryAgain,
  onStartOver,
}) {
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
      <div
        className={`pop-in bg-gradient-to-r ${getRatingColor()} rounded-3xl p-8 mb-6 text-center shadow-2xl`}
      >
        <div className="text-6xl mb-4">{getRatingEmoji()}</div>
        <h1 className="text-4xl font-extrabold mb-2">{getRatingText()}</h1>
        {feedback?.isTooSimilar ? (
          <p className="text-xl opacity-90">
            Your writing was too similar to the example. Let's try again with
            YOUR ideas!
          </p>
        ) : (
          <p className="text-xl opacity-90">
            Vividness Score: {feedback?.vividnessScore}/100
          </p>
        )}
      </div>

      {feedback?.isTooSimilar ? (
        /* Too Similar Feedback */
        <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-700/50 text-center">
          <h2 className="text-2xl font-bold mb-4">🎯 The Challenge</h2>
          <p className="text-lg text-slate-300 mb-6">
            The goal isn't to copy the example — it's to LEARN from it and write
            YOUR own vivid version! Try using different words, different details,
            and YOUR unique imagination.
          </p>

          <div className="bg-amber-500/20 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-amber-400 mb-2">
              💡 Tips for Your Next Try:
            </h3>
            <ul className="text-slate-300 text-left max-w-md mx-auto space-y-1">
              <li>• Use different describing words</li>
              <li>• Add YOUR favorite details</li>
              <li>• Imagine the scene in YOUR way</li>
              <li>• What would YOU notice if you were there?</li>
            </ul>
          </div>

          <button
            onClick={onTryAgain}
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
            <h3 className="font-bold text-lg mb-4">
              📊 Details I Found in Your Writing:
            </h3>
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
                      <span
                        className="font-semibold"
                        style={{ color: detail.color }}
                      >
                        {detail.label}
                      </span>
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
                          <li className="text-slate-500">
                            +{detailList.length - 3} more!
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Try adding some next time!
                      </p>
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
            onClick={onTryAgain}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
          >
            ✍️ Try This Scene Again
          </button>
        )}
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          🚀 Start a New Scene!
        </button>
      </div>
    </div>
  );
}
