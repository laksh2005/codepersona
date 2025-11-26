function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-slate-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent border-t-white rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-500 text-xs uppercase tracking-wider">Loading</p>
    </div>
  );
}

export default LoadingSpinner;

