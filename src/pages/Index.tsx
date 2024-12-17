import Generator from "@/components/Generator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Random Value Generator
        </h1>
        <Generator />
      </div>
    </div>
  );
};

export default Index;