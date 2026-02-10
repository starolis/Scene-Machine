import { DETAIL_TYPES } from '../constants';

export default function DetailLegend({ showLegend, onToggle }) {
  return (
    <div className="bg-slate-900/80 rounded-2xl p-4 mb-6 border border-slate-700/50">
      <button
        onClick={onToggle}
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
              style={{
                backgroundColor: detail.bgColor,
                borderLeft: `4px solid ${detail.color}`,
              }}
            >
              <div className="text-2xl mb-1">{detail.icon}</div>
              <div
                className="font-semibold text-sm"
                style={{ color: detail.color }}
              >
                {detail.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {detail.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
