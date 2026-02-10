export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
          <span className="text-3xl">✨</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Scene Machine
          </span>
          <span className="text-3xl">📝</span>
        </div>

        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          Learn to Write Vivid Scenes
        </h1>

        <p className="text-lg text-slate-300 mb-4">
          Turn your rough ideas into stories that jump off the page! Write a
          quick draft, study an AI-powered example with color-coded details,
          then craft your own vivid version and get instant feedback.
        </p>

        <p className="text-slate-400 mb-10">
          Perfect for young writers learning to add sensory details, emotions,
          and action to their stories.
        </p>

        <button
          onClick={onStart}
          className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 hover:scale-105"
        >
          <span className="flex items-center gap-3">
            <span>🚀</span>
            Start Writing
          </span>
        </button>

        <p className="text-sm text-slate-500 mt-10">
          Built by a student writer
        </p>
      </div>
    </div>
  );
}
