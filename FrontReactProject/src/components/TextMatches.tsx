import { Card } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

interface TextMatch {
  type: string;
  sentence: string;
  similarity: number;
  matched_with: string;
}

interface TextMatchesProps {
  matches: TextMatch[];
  totalSentences: number;
}

export const TextMatches = ({ matches, totalSentences }: TextMatchesProps) => {
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return "bg-destructive/10 text-destructive border-destructive/20";
    if (similarity >= 0.8) return "bg-accent/10 text-accent border-accent/20";
    if (similarity >= 0.7) return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-secondary-foreground border-border";
  };

  const getSimilarityIcon = (similarity: number) => {
    if (similarity >= 0.8) return <AlertTriangle className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Text Matches Found</h3>
          <p className="text-muted-foreground">No similar text content was detected in your document.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Text Similarity Analysis</h3>
          <p className="text-muted-foreground">
            {matches.length} matches found in {totalSentences} sentences
          </p>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {matches.length} matches
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSimilarityIcon(match.similarity)}
                <span className="font-medium text-foreground">Match #{index + 1}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSimilarityColor(match.similarity)}`}>
                {Math.round(match.similarity * 100)}% similar
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Original Text</div>
                <div className="p-3 bg-background rounded border text-sm text-foreground">
                  "{match.sentence}"
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Matched With</div>
                <div className="p-3 bg-background rounded border text-sm text-foreground">
                  "{match.matched_with}"
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
