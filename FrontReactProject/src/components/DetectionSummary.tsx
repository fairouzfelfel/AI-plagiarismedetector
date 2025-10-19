import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Info
} from "lucide-react";

interface SummaryData {
  summary: string;
  recommendations: string[];
  key_findings: {
    overall_score: number;
    text_score: number;
    image_score: number;
    text_matches_count: number;
    image_matches_count: number;
    risk_level: string;
    documents_compared: number;
  };
}

interface DetectionSummaryProps {
  summaryData: SummaryData;
}

export const DetectionSummary = ({ summaryData }: DetectionSummaryProps) => {
  const { summary, recommendations, key_findings } = summaryData;

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Aucun risque':
      case 'Très faible':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'Faible':
        return <Info className="w-5 h-5 text-primary" />;
      case 'Modéré':
        return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'Élevé':
      case 'Critique':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Aucun risque':
      case 'Très faible':
        return "bg-primary/10 text-primary border-primary/20";
      case 'Faible':
        return "bg-primary/10 text-primary border-primary/20";
      case 'Modéré':
        return "bg-accent/10 text-accent border-accent/20";
      case 'Élevé':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'Critique':
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {getRiskIcon(key_findings?.risk_level)}
          <div>
            <h3 className="text-xl font-semibold text-foreground">Detection Summary</h3>
            <p className="text-muted-foreground">AI-powered analysis overview</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center">
            <div className="text-4xl font-bold text-foreground mb-2">
              {key_findings?.overall_score}%
            </div>
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskColor(key_findings?.risk_level)}`}>
              {key_findings?.risk_level}
            </div>
          </div>
          <Progress 
            value={key_findings?.overall_score} 
            className="mt-4"
          />
        </div>

        {/* AI Summary */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">AI Summary</h4>
              <p className="text-foreground text-sm">{summary}</p>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-foreground">{key_findings?.text_score}%</div>
            <div className="text-xs text-muted-foreground">Text Score</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-foreground">{key_findings?.image_score}%</div>
            <div className="text-xs text-muted-foreground">Image Score</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-foreground">{key_findings?.text_matches_count}</div>
            <div className="text-xs text-muted-foreground">Text Matches</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-foreground">{key_findings?.image_matches_count}</div>
            <div className="text-xs text-muted-foreground">Image Matches</div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: rec }} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
