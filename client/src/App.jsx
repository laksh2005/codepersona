import { useState } from 'react';
import axios from 'axios';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import JourneyDashboard from './components/JourneyDashboard';
import SearchBar from './components/SearchBar';
import { Card } from './components/ui/card';
import { Github, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJourney = async (username, forceRefresh = false) => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setJourney(null);

    try {
      const url = `/api/journey/${encodeURIComponent(username)}${forceRefresh ? '?force_refresh=true' : ''}`;
      const response = await axios.get(url);
      setJourney(response.data.journey);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
      console.error('Error fetching journey:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen w-full overflow-hidden text-foreground selection:bg-primary/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] animate-pulse duration-[10s]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse duration-[15s]" />
        </div>

        <div className="h-screen flex flex-col">
          {/* Glass Header */}
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 z-50"
          >
            <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-black/50 p-2 rounded-xl border border-white/10">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                    Code Journey
                  </h1>
                  <p className="text-[10px] text-blue-200/60 tracking-widest uppercase">AI-Powered Analytics</p>
                </div>
              </div>
              
              {journey && !loading && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="hidden md:block"
                 >
                   <SearchBar onSearch={fetchJourney} loading={loading} compact />
                 </motion.div>
              )}
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {!journey && !loading && (
                <motion.div 
                  key="landing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col items-center justify-center p-6 relative"
                >
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                  
                  <Card className="relative overflow-hidden p-10 max-w-xl w-full border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10 text-center">
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 mx-auto mb-8 relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-60"></div>
                        <div className="relative h-full w-full bg-black/60 rounded-3xl border border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                          <Sparkles className="h-10 w-10 text-white" />
                        </div>
                      </motion.div>

                      <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">
                        Discover Your <span className="text-gradient">Dev Story</span>
                      </h2>
                      <p className="text-base text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
                        Enter a GitHub username to generate a stunning 3D visualization of their coding legacy.
                      </p>
                      
                      <div className="relative group/input">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover/input:opacity-40 transition duration-500"></div>
                        <SearchBar onSearch={fetchJourney} loading={loading} />
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-200 backdrop-blur-sm"
                        >
                          {error}
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-t-4 border-l-4 border-purple-500 rounded-full animate-spin blur-sm absolute inset-0"></div>
                    <div className="w-24 h-24 border-r-4 border-b-4 border-blue-500 rounded-full animate-spin absolute inset-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Github className="h-8 w-8 text-white/50 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-8 text-lg font-light text-white/60 tracking-[0.2em] uppercase animate-pulse">
                    Analyzing Timeline
                  </p>
                </motion.div>
              )}

              {journey && !loading && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <JourneyDashboard journey={journey} onRefresh={() => fetchJourney(journey.profile.login, true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
