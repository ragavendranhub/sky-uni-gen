import { Generator } from "@/components/Generator";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#F97316] via-[#9b87f5] to-[#0EA5E9] overflow-hidden">
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative container py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Random Value Generator
        </h1>
        <Generator />
      </div>
    </div>
  );
};

export default Index;