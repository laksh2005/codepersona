function TechEvolution({ techEvolution, languages }) {
  if (!techEvolution || techEvolution.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Tech Evolution</h3>

      <div className="space-y-6">
        {techEvolution.map((evolution, index) => (
          <div
            key={index}
            className="bg-slate-950 border border-slate-800 p-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-lg font-light text-white">{evolution.year}</h4>
              {evolution.new_languages && evolution.new_languages.length > 0 && (
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs">
                  +{evolution.new_languages.length} New
                </span>
              )}
            </div>

            <div className="space-y-4">
              {evolution.primary_languages && evolution.primary_languages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Primary Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {evolution.primary_languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {evolution.new_languages && evolution.new_languages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Newly Learned</p>
                  <div className="flex flex-wrap gap-2">
                    {evolution.new_languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Language Distribution */}
      {languages && languages.top_5 && languages.top_5.length > 0 && (
        <div className="mt-10 pt-10 border-t border-slate-800">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Language Distribution</h4>
          <div className="space-y-3">
            {languages.top_5.map((lang, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-xs text-gray-300 font-medium">{lang.name}</div>
                <div className="flex-1 bg-slate-800 h-1 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-1000"
                    style={{ width: `${lang.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-xs text-gray-500">{lang.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TechEvolution;

