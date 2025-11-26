function AchievementsShowcase({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Achievements</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="bg-slate-950 border border-slate-800 p-5 hover:border-slate-700 transition-colors"
          >
            <h4 className="text-sm font-light text-white mb-2">{achievement.title}</h4>
            {achievement.achieved_at && (
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {new Date(achievement.achieved_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsShowcase;

