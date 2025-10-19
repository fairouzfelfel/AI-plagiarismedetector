import { useState } from "react";
import { FileCheck2, Shield, Zap } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { SimilarityScore } from "@/components/SimilarityScore";
import { ReportHistory } from "@/components/ReportHistory";
import { ReformulateText } from "@/components/ReformulateText";
import { DetectionSummary } from "@/components/DetectionSummary";
import { TextMatches } from "@/components/TextMatches";
import { ImageMatches } from "@/components/imagematches";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [results, setResults] = useState<any>(null);

  const { toast } = useToast();

  // Mock data for report history
  const [reports] = useState([
    {
      id: "1",
      filename: "research_paper_2024.pdf",
      uploadDate: "2 hours ago",
      combinedScore: 23,
    },
    {
      id: "2",
      filename: "thesis_chapter_3.pdf",
      uploadDate: "1 day ago",
      combinedScore: 67,
    },
  ]);

  // 🔹 Upload and analyze PDF
  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setShowResults(false);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    toast({
      title: "Processing document",
      description: "Analyzing your PDF for plagiarism and AI summary...",
    });

    try {
      const response = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Upload failed",
          description: error.error || "Unknown error",
        });
        setIsUploading(false);
        return;
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
      
      toast({
        title: "Analysis complete",
        description: "Your plagiarism report and AI summary are ready",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong while analyzing the PDF",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewReport = (reportId: string) => {
    toast({
      title: "Opening report",
      description: `Loading details for report ${reportId}`,
    });
  };

  // Navigation tabs configuration
  const tabs = [
    { id: "summary", name: "📊 Résumé", icon: "📊" },
    { id: "scores", name: "🎯 Scores", icon: "🎯" },
    { id: "text", name: "📝 Texte", icon: "📝" },
    { id: "images", name: "🖼️ Images", icon: "🖼️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Detection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Plagiarism Detector
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Advanced AI analysis for text and image similarity detection. Protect
              your academic integrity with cutting-edge technology.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Text Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Deep content comparison using advanced NLP algorithms
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Image Detection</h3>
              <p className="text-muted-foreground text-sm">
                Visual similarity recognition with AI vision models
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Fast Results</h3>
              <p className="text-muted-foreground text-sm">
                Get comprehensive reports in seconds, not hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
      </section>

      {/* Results Section */}
      {showResults && results && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-foreground">Analysis Results</h2>
            <p className="text-muted-foreground">
              Comprehensive similarity analysis for your document
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card rounded-xl border border-border shadow-sm mb-6">
            <div className="border-b border-border">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "summary" && (
                <DetectionSummary summaryData={results} />
              )}

              {activeTab === "scores" && (
                <SimilarityScore
                  textScore={results.plagiarism_score_text}
                  imageScore={results.plagiarism_score_image}
                  combinedScore={results.plagiarism_score_combined}
                  riskLevel={results.risk_level}
                  totalSentences={results.total_sentences}
                  totalImages={results.total_images_checked}
                  documentsCompared={results.documents_compared}
                />
              )}

              {activeTab === "text" && (
                <TextMatches
                  matches={results.text_matches}
                  totalSentences={results.total_sentences}
                />
              )}

              {activeTab === "images" && (
                <ImageMatches
                  matches={results.image_matches}
                  totalImages={results.total_images_checked}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reformulation Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ReformulateText />
      </section>

      {/* History Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReportHistory reports={reports} onViewReport={handleViewReport} />
      </section>
    </div>
  );
};

export default Index;