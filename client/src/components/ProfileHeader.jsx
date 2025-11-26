function ProfileHeader({ profile, onRefresh }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={profile.avatar_url}
          alt={profile.name || profile.login}
          className="w-24 h-24 rounded-full border border-slate-700"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-light text-white mb-2">
            {profile.name || profile.login}
          </h2>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm mb-4 inline-block transition-colors"
          >
            @{profile.login}
          </a>
          {profile.bio && (
            <p className="text-gray-300 text-sm mb-5 mt-3">{profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-xs text-gray-500 uppercase tracking-wider">
            {profile.location && (
              <span>{profile.location}</span>
            )}
            {profile.company && (
              <span>{profile.company}</span>
            )}
            <span>{profile.followers} followers</span>
            <span>{profile.following} following</span>
            <span>{profile.public_repos} repos</span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-xs hover:bg-slate-700 transition-colors uppercase tracking-wider"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;

