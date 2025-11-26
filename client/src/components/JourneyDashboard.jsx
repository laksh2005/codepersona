import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, Star, GitFork, Calendar, Code, TrendingUp, Award, Globe, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  show: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 50 }
  }
};

function JourneyDashboard({ journey, onRefresh }) {
  if (!journey) return null;

  const stats = journey.stats || {};
  const profile = journey.profile || {};
  const timeline = stats.timeline || [];
  const techEvolution = stats.tech_evolution || [];
  const achievements = stats.achievements || [];
  const topRepos = stats.top_repos || [];
  const languages = journey.languages || {};

  return (
    <div className="h-full overflow-auto p-4 custom-scrollbar">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1600px] mx-auto space-y-6 pb-10"
      >
        {/* Profile Header Card */}
        <motion.div variants={item} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
          <Card className="relative border-0 bg-black/40 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-40 animate-pulse"></div>
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.login}
                      className="relative w-32 h-32 rounded-2xl border-2 border-white/10 shadow-2xl"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left space-y-2">
                    <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                      {profile.name || profile.login}
                    </h1>
                    <a
                      href={profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-lg text-purple-300 hover:text-purple-200 transition-colors font-medium"
                    >
                      @{profile.login}
                    </a>
                    {profile.bio && (
                      <p className="text-slate-300 max-w-2xl text-lg font-light leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                      {[
                        { label: 'Followers', value: profile.followers },
                        { label: 'Following', value: profile.following },
                        { label: 'Public Repos', value: profile.public_repos }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 px-4 py-2 rounded-full border border-white/5 text-sm text-slate-300">
                          <span className="font-bold text-white mr-2">{stat.value}</span>
                          {stat.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={onRefresh} 
                  className="shrink-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Sync Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: 'Total Stars', value: stats.total_stars, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { icon: Code, label: 'Repositories', value: stats.original_repos, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { icon: GitFork, label: 'Total Forks', value: stats.total_forks, color: 'text-green-400', bg: 'bg-green-400/10' },
            { icon: Calendar, label: 'Years Coding', value: stats.years_coding, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          ].map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className="glass-card border-0 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-500/10`}></div>
                  <div className={`p-3 rounded-xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                    {stat.value || 0}
                  </div>
                  <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Narrative - Cinematic */}
        {journey.ai_narration && (
          <motion.div variants={item}>
            <Card className="glass-card border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">The Journey So Far</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-8 text-slate-300/90 font-light whitespace-pre-line">
                    {journey.ai_narration}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bento Grid Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline - Large Vertical */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="glass-card border-0 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-white">Timeline & Evolution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 relative">
                  {/* Connecting Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-transparent"></div>
                  
                  {timeline.length > 0 ? (
                    timeline.map((yearData, index) => (
                      <div key={index} className="relative pl-12 group">
                        {/* Dot */}
                        <div className="absolute left-[11px] top-1.5 w-3 h-3 rounded-full bg-black border-2 border-purple-500 z-10 group-hover:scale-125 group-hover:bg-purple-500 transition-all duration-300"></div>
                        
                        <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                              {yearData.year}
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-slate-300 border border-white/5">
                              {yearData.repos_created} repos created
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Languages used that year */}
                            <div className="flex flex-wrap gap-2">
                              {yearData.languages_used?.slice(0, 6).map((lang, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/20"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                            
                            {/* Star count */}
                            {yearData.total_stars_earned > 0 && (
                              <div className="flex items-center gap-2 text-sm text-yellow-400/80">
                                <Star className="h-4 w-4 fill-yellow-400/20" />
                                <span>+{yearData.total_stars_earned} stars earned</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 pl-12">No timeline data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column Stack */}
          <div className="space-y-6">
            {/* Languages Radial/List */}
            <motion.div variants={item}>
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                      <Code className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-white">Top Languages</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {languages.top_5?.map((lang, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-200">{lang.name}</span>
                          <span className="text-slate-400">{lang.percentage}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={item}>
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-white">Achievements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
                      >
                        <div className="text-2xl">{achievement.icon || '🏆'}</div>
                        <div className="text-sm font-medium text-slate-200">{achievement.title}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Tech Evolution Grid */}
        {techEvolution.length > 0 && (
          <motion.div variants={item}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Technology Adoption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {techEvolution.slice(0, 3).map((evolution, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className="text-xl font-bold text-white mb-3">{evolution.year}</h4>
                      {evolution.new_languages?.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Discovered</div>
                          <div className="flex flex-wrap gap-2">
                            {evolution.new_languages.map((lang, i) => (
                              <span key={i} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 italic">Deepening existing skills</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Repositories */}
        {topRepos.length > 0 && (
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-purple-500">Top Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRepos.slice(0, 6).map((repo, index) => (
                <a
                  key={index}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  <div className="relative h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Code className="h-5 w-5 text-white" />
                      </div>
                      {repo.language && (
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-300">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {repo.name}
                    </h4>
                    
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 h-10">
                      {repo.description || "No description provided."}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default JourneyDashboard;
