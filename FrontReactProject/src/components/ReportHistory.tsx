import { FileText, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Report {
  id: string;
  filename: string;
  uploadDate: string;
  combinedScore: number;
}

interface ReportHistoryProps {
  reports: Report[];
  onViewReport: (reportId: string) => void;
}

export const ReportHistory = ({ reports, onViewReport }: ReportHistoryProps) => {
  if (reports.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">No reports yet</h3>
        <p className="text-muted-foreground">Upload your first PDF to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Recent Reports</h2>
      {reports.map((report) => (
        <Card key={report.id} className="p-6 hover:shadow-lg transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{report.filename}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {report.uploadDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {report.combinedScore}% similarity
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onViewReport(report.id)}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
