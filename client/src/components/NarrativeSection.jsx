function NarrativeSection({ narrative }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Journey Story</h3>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {narrative}
        </p>
      </div>
    </div>
  );
}

export default NarrativeSection;

