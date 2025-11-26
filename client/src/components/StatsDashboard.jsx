function StatsDashboard({ stats }) {
  const statCards = [
    { label: 'Total Stars', value: stats.total_stars || 0 },
    { label: 'Repositories', value: stats.original_repos || 0 },
    { label: 'Forks', value: stats.total_forks || 0 },
    { label: 'Years Coding', value: stats.years_coding || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-colors"
        >
          <div className="text-3xl font-light text-white mb-2">
            {stat.value.toLocaleString()}
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsDashboard;

