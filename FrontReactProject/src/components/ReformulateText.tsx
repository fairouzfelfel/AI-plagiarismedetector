import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// URL du backend Flask (stockée dans .env pour flexibilité)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const ReformulateText = () => {
  const [inputText, setInputText] = useState("");
  const [reformulations, setReformulations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReformulate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to reformulate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setReformulations([]);

    try {
      // ✅ Appel à ton API Flask
      const response = await fetch(`${API_URL}/reformulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: inputText }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reformulate text");
      }

      const data = await response.json();

      // 🔹 Si ton backend renvoie un seul texte
      // setReformulations([data.reformulated]);

      // 🔹 Si ton backend renvoie plusieurs reformulations
      setReformulations(data.reformulations || [data.reformulated]);

      toast({
        title: "Reformulation complete",
        description: "The text was successfully reformulated.",
      });
    } catch (error) {
      console.error("Reformulation error:", error);
      toast({
        title: "Reformulation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Text Reformulation
        </CardTitle>
        <CardDescription>
          AI-powered text reformulation to help avoid plagiarism
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Enter text to reformulate
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type the text you want to reformulate..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleReformulate}
          disabled={isLoading || !inputText.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Reformulating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Reformulate Text
            </>
          )}
        </Button>

        {reformulations.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-semibold text-foreground">
              Reformulated Versions:
            </h3>
            {reformulations.map((text, index) => (
              <Card key={index} className="bg-secondary/30">
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
