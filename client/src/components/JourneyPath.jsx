import { useEffect, useRef, useState } from 'react';

function JourneyPath({ timeline, techEvolution }) {
  const pathRef = useRef(null);
  const [visibleYears, setVisibleYears] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = entry.target.dataset.year;
            setVisibleYears((prev) => new Set([...prev, year]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const yearElements = pathRef.current?.querySelectorAll('[data-year]');
    yearElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Coding Journey</h3>
        <p className="text-gray-500 text-sm">No timeline data available</p>
      </div>
    );
  }

  const maxRepos = Math.max(...timeline.map((t) => t.repos_created || 0));

  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Timeline</h3>

      <div ref={pathRef} className="relative">
        {/* Path Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700"></div>

        {/* Timeline Items */}
        <div className="space-y-10">
          {timeline.map((yearData, index) => {
            const isVisible = visibleYears.has(yearData.year.toString());
            const barWidth = maxRepos > 0 ? (yearData.repos_created / maxRepos) * 100 : 0;

            return (
              <div
                key={yearData.year}
                data-year={yearData.year}
                className={`relative pl-12 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                {/* Year Marker */}
                <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-slate-700 flex items-center justify-center text-slate-950 text-xs font-medium">
                  {yearData.year}
                </div>

                {/* Content Card */}
                <div className="bg-slate-950 border border-slate-800 p-6 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-light text-white mb-3">
                        {yearData.repos_created} {yearData.repos_created === 1 ? 'Repository' : 'Repositories'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {yearData.languages_used?.slice(0, 5).map((lang, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-white mb-1">
                        {yearData.total_stars_earned || 0}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Stars</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-1000 ease-out"
                      style={{ width: isVisible ? `${barWidth}%` : '0%' }}
                    ></div>
                  </div>

                  {/* Notable Repos */}
                  {yearData.notable_repos && yearData.notable_repos.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-slate-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Notable Projects</p>
                      <div className="flex flex-wrap gap-2">
                        {yearData.notable_repos.slice(0, 3).map((repo, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-800 text-gray-400 text-xs"
                          >
                            {repo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Year Marker */}
        <div className="relative pl-12 mt-10 pt-10 border-t border-slate-800">
          <div className="absolute left-0 top-10 w-8 h-8 bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-white text-xs font-medium">
            Now
          </div>
          <div className="text-gray-500 text-sm">Continuing</div>
        </div>
      </div>
    </div>
  );
}

export default JourneyPath;

