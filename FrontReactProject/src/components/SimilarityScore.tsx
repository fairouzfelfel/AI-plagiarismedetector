import { FileText, Image, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SimilarityScoreProps {
  textScore: number;
  imageScore: number;
  combinedScore: number;
  riskLevel?: string;
  totalSentences?: number;
  totalImages?: number;
  documentsCompared?: number;
}

export const SimilarityScore = ({
  textScore,
  imageScore,
  combinedScore,
  riskLevel,
  totalSentences,
  totalImages,
  documentsCompared,
}: SimilarityScoreProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Aucun risque":
      case "Très faible":
        return "bg-primary/10 text-primary border-primary/20";
      case "Faible":
        return "bg-primary/10 text-primary border-primary/20";
      case "Modéré":
        return "bg-accent/10 text-accent border-accent/20";
      case "Élevé":
      case "Critique":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-destructive";
    if (score >= 40) return "text-accent";
    return "text-primary";
  };

  const getProgressColor = (score: number): string => {
    if (score >= 70) return "[&>div]:bg-destructive";
    if (score >= 40) return "[&>div]:bg-accent";
    return "[&>div]:bg-primary";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-6">📊 Scores de Similarité Détaillés</h3>
        
        {/* Overall Score */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - combinedScore / 100)}`}
                  className={combinedScore >= 70 ? "text-destructive" : combinedScore >= 40 ? "text-accent" : "text-primary"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-foreground">{combinedScore}%</div>
                <div className="text-sm text-muted-foreground">Global</div>
              </div>
            </div>
          </div>
          {riskLevel && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getRiskColor(riskLevel)}`}>
              <Shield className="w-4 h-4" />
              Niveau de risque: {riskLevel}
            </div>
          )}
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Text Score */}
          <Card className="p-4 bg-secondary border-border">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Similarité Texte</h4>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(textScore)}`}>
              {textScore}%
            </div>
            <Progress value={textScore} className={`h-2 mb-2 ${getProgressColor(textScore)}`} />
            {totalSentences !== undefined && (
              <div className="text-sm text-muted-foreground">
                {totalSentences} phrases analysées
              </div>
            )}
          </Card>

          {/* Image Score */}
          <Card className="p-4 bg-secondary border-border">
            <div className="flex items-center gap-3 mb-3">
              <Image className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-foreground">Similarité Images</h4>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(imageScore)}`}>
              {imageScore}%
            </div>
            <Progress value={imageScore} className={`h-2 mb-2 ${getProgressColor(imageScore)}`} />
            {totalImages !== undefined && (
              <div className="text-sm text-muted-foreground">
                {totalImages} images analysées
              </div>
            )}
          </Card>
        </div>

        {/* Metadata */}
        {documentsCompared !== undefined && (
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Documents comparés:</span>
                <span className="ml-2 text-muted-foreground">{documentsCompared}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Score combiné:</span>
                <span className="ml-2 text-muted-foreground">{combinedScore}%</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
