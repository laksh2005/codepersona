import { useEffect, useRef } from 'react';
import ProfileHeader from './ProfileHeader';
import JourneyPath from './JourneyPath';
import TechEvolution from './TechEvolution';
import AchievementsShowcase from './AchievementsShowcase';
import StatsDashboard from './StatsDashboard';
import NarrativeSection from './NarrativeSection';
import TopRepos from './TopRepos';

function JourneyVisualization({ journey, onRefresh }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Smooth scroll animations on mount
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll('.scroll-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [journey]);

  if (!journey) return null;

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Profile Header */}
      <div className="scroll-animate">
        <ProfileHeader profile={journey.profile} onRefresh={onRefresh} />
      </div>

      {/* AI Narrative */}
      {journey.ai_narration && (
        <div className="scroll-animate">
          <NarrativeSection narrative={journey.ai_narration} />
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="scroll-animate">
        <StatsDashboard stats={journey.stats} />
      </div>

      {/* Journey Path - The Unique Visualization */}
      <div className="scroll-animate">
        <JourneyPath timeline={journey.stats.timeline} techEvolution={journey.stats.tech_evolution} />
      </div>

      {/* Tech Evolution */}
      <div className="scroll-animate">
        <TechEvolution techEvolution={journey.stats.tech_evolution} languages={journey.languages} />
      </div>

      {/* Achievements */}
      {journey.stats.achievements && journey.stats.achievements.length > 0 && (
        <div className="scroll-animate">
          <AchievementsShowcase achievements={journey.stats.achievements} />
        </div>
      )}

      {/* Top Repositories */}
      {journey.stats.top_repos && journey.stats.top_repos.length > 0 && (
        <div className="scroll-animate">
          <TopRepos repos={journey.stats.top_repos} />
        </div>
      )}
    </div>
  );
}

export default JourneyVisualization;

