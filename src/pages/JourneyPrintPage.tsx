import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import html2pdf from "html2pdf.js";
import { supabase } from "@/integrations/supabase/client";
import type { JourneyData } from "./JourneyPage";
import LoadingState from "@/components/journey/LoadingState";
import ErrorState from "@/components/journey/ErrorState";

const JourneyPrintPage = () => {
  const { username } = useParams<{ username: string }>();

  const { data: journey, isLoading, error, refetch } = useQuery({
    queryKey: ["journey-print", username],
    queryFn: async (): Promise<JourneyData> => {
      const { data, error } = await supabase.functions.invoke("github-journey", {
        body: { username },
      });

      if (error) throw error;
      if (data?.error) {
        const customError = new Error(data.error);
        (customError as any).errorType = data.errorType;
        throw customError;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  useEffect(() => {
    if (journey) {
      setTimeout(() => {
        const element = document.getElementById("print-content");
        if (element) {
          html2pdf()
            .set({
              margin: 0,
              filename: `${journey.github_username}-code-persona.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
              html2canvas: { scale: 2, useCORS: true },
            })
            .from(element)
            .toPdf()
            .get('pdf')
            .then(pdf => {
              // Scale to fit one page
              const totalPages = pdf.internal.getNumberOfPages();
              if (totalPages > 1) {
                pdf.deletePage(2);
              }
            })
            .save();
        }
      }, 500);
    }
  }, [journey]);

  if (isLoading) return <LoadingState username={username || ""} />;
  if (error) return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  if (!journey) return <ErrorState error={new Error("No data found")} onRetry={() => refetch()} />;

  const { github_data, ai_persona, ai_skills, ai_achievements, ai_career_projection } = journey;
  const { user, repos, contributions, languages } = github_data;

  const primaryLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);

  const topSkills = ai_skills.skills.slice(0, 5);
  const keyBadges = ai_achievements.badges.slice(0, 3);

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalRepos = repos.length;

  return (
    <div className="min-h-screen bg-white text-black flex justify-center items-start py-8">
      <style>{`
        #print-content {
          font-size: 12px !important;
          line-height: 1.5 !important;
          color: #111 !important;
          background: #fafbfc !important;
          border: 1.5px solid #e0e0e0 !important;
          border-radius: 12px !important;
          margin: 0 auto !important;
          padding: 32px 32px 24px 32px !important;
          box-sizing: border-box !important;
          text-align: left !important;
          box-shadow: 0 2px 12px 0 #0001 !important;
        }
        #print-content h1, #print-content h2, #print-content h3, #print-content h4 {
          color: #000 !important;
          font-weight: bold !important;
          margin-top: 1.2em !important;
          margin-bottom: 0.5em !important;
        }
        #print-content h1 { font-size: 1.6rem !important; text-align: center !important; margin-bottom: 0.7rem; }
        #print-content h2 { font-size: 1.15rem !important; margin-bottom: 0.4rem; }
        #print-content p { margin-bottom: 0.35rem !important; }
        #print-content section { margin-bottom: 1.1rem !important; }
        #print-content header { margin-bottom: 1.2rem !important; border-bottom: 1px solid #e0e0e0 !important; padding-bottom: 0.7rem !important; }
        #print-content .section-title { margin-top: 1.2em !important; }
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: #fff !important;
          }
          #print-content {
            width: 190mm;
            min-height: 277mm;
            box-sizing: border-box;
            page-break-after: avoid;
          }
          .no-print { display: none !important; }
        }
      `}</style>
      <div id="print-content" className="w-full max-w-[800px] text-sm leading-relaxed">
        <header className="mb-4 border-b pb-3">
          <h1 className="text-2xl font-semibold mb-1">Code Persona Report</h1>
          <p className="text-xs text-gray-600">
            GitHub user: <span className="font-mono">{journey.github_username}</span>
          </p>
        </header>

        <section className="mb-4">
          <h2 className="text-base font-semibold mb-1">Profile</h2>
          <p className="font-medium">
            {user.name || journey.github_username}{" "}
            <span className="font-normal text-gray-700">(@{journey.github_username})</span>
          </p>
          {user.bio && <p className="text-gray-800 mt-1">{user.bio}</p>}
          <p className="text-gray-700 mt-1">
            Location: {user.location || "Not specified"} | Company: {user.company || "Not specified"} | Active since:{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold mb-1">Repository Overview</h2>
          <p className="text-gray-800">
            Total repositories: {totalRepos}. Total stars across public repositories: {totalStars}. Total recorded
            contributions: {contributions.total}.
          </p>
          {primaryLanguages.length > 0 && (
            <p className="text-gray-800 mt-1">
              Primary languages: {primaryLanguages.join(", ")}.
            </p>
          )}
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold mb-1">Developer Persona</h2>
          <p className="font-medium text-gray-900 mb-1">{ai_persona.title}</p>
          {ai_persona.insights.slice(0, 3).map((insight, index) => (
            <p key={index} className="text-gray-800">
              • {insight}
            </p>
          ))}
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold mb-1">Key Skills</h2>
          {topSkills.map((skill) => (
            <p key={skill.name} className="text-gray-800">
              {skill.name}: {skill.score}/100 – {skill.reasoning}
            </p>
          ))}
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold mb-1">Notable Achievements</h2>
          {keyBadges.map((badge) => (
            <p key={badge.name} className="text-gray-800">
              {badge.name}: {badge.description} (evidence: {badge.reasoning})
            </p>
          ))}
        </section>

        <section>
          <h2 className="text-base font-semibold mb-1">Career Outlook</h2>
          <p className="text-gray-800">
            Ideal role: {ai_career_projection.roleAlignment}.
          </p>
          <p className="text-gray-800 mt-1">
            Future focus areas: {ai_career_projection.futureSkills.join(", ")}.
          </p>
          <p className="text-gray-800 mt-1">{ai_career_projection.prediction}</p>
        </section>
      </div>
    </div>
  );
};

export default JourneyPrintPage;


