import HighlightedText from '../components/HighlightedText';
import DetailLegend from '../components/DetailLegend';

export default function LearnStep({
  originalText,
  aiExample,
  showLegend,
  onToggleLegend,
  onNext,
  onBack,
}) {
  return (
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
        Look at the highlighted words to see WHAT makes writing vivid. When
        you're ready, you'll write YOUR own version!
      </p>

      {/* Legend */}
      <DetailLegend showLegend={showLegend} onToggle={onToggleLegend} />

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
          <HighlightedText
            text={aiExample?.vividText}
            highlights={aiExample?.highlights}
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl p-6 border border-emerald-500/30 text-center">
        <h3 className="text-xl font-bold text-emerald-300 mb-2">
          👀 Did you notice all the details?
        </h3>
        <p className="text-slate-300 mb-4">
          Tap or hover over the colored words to learn more! When you're ready,
          try writing YOUR own vivid version.
          <br />
          <span className="text-amber-400 font-semibold">
            Remember: You can't just copy — you have to write it in YOUR words!
          </span>
        </p>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <span>✍️</span>
            I'm Ready to Write My Own Version!
          </span>
        </button>
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Back to My Draft
        </button>
      </div>
    </div>
  );
}
