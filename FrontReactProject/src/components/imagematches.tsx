import { Card } from "@/components/ui/card";
import { Image } from "lucide-react";

interface ImageMatch {
  image: string;
  matched_with: string;
  similarity: number;
  image_index?: number;
  matched_with_index?: number;
}

interface ImageMatchesProps {
  matches: ImageMatch[];
  totalImages: number;
}

export const ImageMatches = ({ matches, totalImages }: ImageMatchesProps) => {
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return "bg-destructive/10 text-destructive border-destructive/20";
    if (similarity >= 0.8) return "bg-accent/10 text-accent border-accent/20";
    if (similarity >= 0.7) return "bg-primary/10 text-primary border-primary/20";
    return "bg-secondary text-secondary-foreground border-border";
  };

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Image Matches Found</h3>
          <p className="text-muted-foreground">No similar images were detected in your document.</p>
        </div>
      </Card>
    );
  }

  // Group matches by similarity level
  const highSimilarity = matches.filter(m => m.similarity >= 0.8);
  const mediumSimilarity = matches.filter(m => m.similarity >= 0.7 && m.similarity < 0.8);
  const lowSimilarity = matches.filter(m => m.similarity < 0.7);

  return (
    <Card className="p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Image Similarity Analysis</h3>
          <p className="text-muted-foreground">
            {matches.length} matches found in {totalImages} images
          </p>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {matches.length} matches
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="text-xl font-bold text-destructive">{highSimilarity.length}</div>
          <div className="text-xs text-destructive">High Similarity</div>
        </div>
        <div className="text-center p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="text-xl font-bold text-accent">{mediumSimilarity.length}</div>
          <div className="text-xs text-accent">Medium Similarity</div>
        </div>
        <div className="text-center p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-xl font-bold text-primary">{lowSimilarity.length}</div>
          <div className="text-xs text-primary">Low Similarity</div>
        </div>
      </div>

      <div className="space-y-4">
        {matches.slice(0, 10).map((match, index) => (
          <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span className="font-medium text-foreground">Image Match #{index + 1}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSimilarityColor(match.similarity)}`}>
                {Math.round(match.similarity * 100)}% similar
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground mb-1">Source Image</div>
                <div className="p-2 bg-background rounded border text-foreground">
                  {match.image_index !== undefined 
                    ? `Image ${match.image_index + 1}`
                    : match.image
                  }
                </div>
              </div>
              
              <div>
                <div className="font-medium text-muted-foreground mb-1">Reference Image</div>
                <div className="p-2 bg-background rounded border text-foreground">
                  {match.matched_with_index !== undefined
                    ? `Image ${match.matched_with_index + 1}`
                    : match.matched_with
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches.length > 10 && (
        <div className="text-center mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            +{matches.length - 10} more image matches not shown
          </p>
        </div>
      )}
    </Card>
  );
};
