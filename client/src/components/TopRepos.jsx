function TopRepos({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Top Repositories</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.slice(0, 6).map((repo, index) => (
          <a
            key={index}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-950 border border-slate-800 p-5 hover:border-slate-700 hover:bg-slate-900 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-light text-white group-hover:text-white transition-colors">
                {repo.name}
              </h4>
              {repo.language && (
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs">
                  {repo.language}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-gray-400 text-xs mb-4 line-clamp-2">{repo.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{repo.stars || 0} stars</span>
              <span>{repo.forks || 0} forks</span>
              {repo.created_at && (
                <span>
                  {new Date(repo.created_at).getFullYear()}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default TopRepos;

