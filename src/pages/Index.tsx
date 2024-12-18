const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-slate-900/20 to-blue-900/20">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white/90">
          Random Value Generator
        </h1>
        <Generator />
      </div>
    </div>
  );
};

export default Index;