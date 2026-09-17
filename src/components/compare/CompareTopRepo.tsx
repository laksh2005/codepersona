import { Star, GitFork, Trophy } from "lucide-react";
import type { Repo } from "@/lib/topRepo";

interface CompareTopRepoProps {
  nameA: string;
  nameB: string;
  usernameA: string;
  usernameB: string;
  repoA: Repo | null;
  repoB: Repo | null;
}

function RepoCard({ ownerName, username, repo }: { ownerName: string; username: string; repo: Repo | null }) {
  if (!repo) {
    return (
      <div className="card-cinematic shadow-soft h-full flex items-center justify-center text-center">
        <p className="text-sm text-muted-foreground italic">{ownerName} has no public repos yet.</p>
      </div>
    );
  }

  return (
    <a
      href={`https://github.com/${username}/${repo.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="card-cinematic shadow-soft h-full flex flex-col hover:border-primary/40 transition-colors group"
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{ownerName}'s top repo</p>
      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition mb-2 break-all">
        {repo.name}
      </h3>
      {repo.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{repo.description}</p>
      )}
      <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground pt-2">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {repo.forks_count}
        </span>
      </div>
    </a>
  );
}

const CompareTopRepo = ({ nameA, nameB, usernameA, usernameB, repoA, repoB }: CompareTopRepoProps) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Best Repo Showdown</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Each person's highest-starred project</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <RepoCard ownerName={nameA} username={usernameA} repo={repoA} />
        <RepoCard ownerName={nameB} username={usernameB} repo={repoB} />
      </div>
    </section>
  );
};

export default CompareTopRepo;
