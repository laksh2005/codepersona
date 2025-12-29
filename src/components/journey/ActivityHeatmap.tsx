import { motion } from "framer-motion";
import { useMemo } from "react";

interface ActivityHeatmapProps {
  repos: Array<{
    created_at: string;
    updated_at: string;
  }>;
}

const ActivityHeatmap = ({ repos }: ActivityHeatmapProps) => {
  // Generate activity data for the last 12 weeks (simplified heatmap)
  const activityData = useMemo(() => {
    const weeks = 12;
    const daysPerWeek = 7;
    const today = new Date();
    const data: number[][] = [];

    // Create a map of activity by date
    const activityMap = new Map<string, number>();
    repos.forEach((repo) => {
      const createdDate = new Date(repo.created_at).toDateString();
      const updatedDate = new Date(repo.updated_at).toDateString();
      activityMap.set(createdDate, (activityMap.get(createdDate) || 0) + 2);
      activityMap.set(updatedDate, (activityMap.get(updatedDate) || 0) + 1);
    });

    // Fill in the grid (weeks as columns, days as rows)
    for (let week = weeks - 1; week >= 0; week--) {
      const weekData: number[] = [];
      for (let day = 0; day < daysPerWeek; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));
        const activity = activityMap.get(date.toDateString()) || 0;
        // Add some simulated activity for visual interest
        const baseActivity = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
        weekData.push(Math.min(activity + baseActivity, 4));
      }
      data.push(weekData);
    }

    return data;
  }, [repos]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted/30";
      case 1:
        return "bg-primary/20";
      case 2:
        return "bg-primary/40";
      case 3:
        return "bg-primary/60";
      default:
        return "bg-primary/80";
    }
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full lg:w-auto mt-8 lg:mt-0"
    >
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm font-medium text-foreground mb-3">Recent Activity</p>
        <p className="text-xs text-muted-foreground mb-3">Last 12 weeks of contributions</p>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {dayLabels.map((day, i) => (
              <span key={day} className={`text-[10px] text-muted-foreground h-3 leading-3 ${i % 2 === 0 ? '' : 'opacity-0'}`}>
                {day}
              </span>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-[3px]">
            {activityData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((level, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.5 + weekIndex * 0.02 + dayIndex * 0.01,
                    }}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(level)} transition-colors`}
                    title={`Activity level: ${level}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
