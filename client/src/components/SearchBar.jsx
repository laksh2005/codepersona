import { useState } from 'react';
import { Button } from './ui/button';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

function SearchBar({ onSearch, loading, compact = false }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && !loading) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full relative group", compact ? "max-w-md" : "")}>
      <div className="relative flex items-center">
        <Search className={cn("absolute left-4 text-white/40 transition-colors group-hover:text-white/70", compact ? "h-4 w-4" : "h-5 w-5")} />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={compact ? "Search user..." : "Enter GitHub username..."}
          className={cn(
            "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all duration-300",
            compact ? "py-2 pl-10 pr-4 rounded-full text-sm" : "py-4 pl-12 pr-32 rounded-xl text-lg"
          )}
          disabled={loading}
        />
        {!compact && (
          <div className="absolute right-2">
            <Button 
              type="submit" 
              disabled={loading || !username.trim()}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 rounded-lg px-4 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Analyze <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
