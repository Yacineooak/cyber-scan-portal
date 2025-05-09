
import { AlertTriangle, Check, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AiSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vulnerability: string;
  isLoading: boolean;
  suggestion: string | null;
  error: string | null;
}

export function AiSuggestionDialog({
  open,
  onOpenChange,
  vulnerability,
  isLoading,
  suggestion,
  error,
}: AiSuggestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyber-warning" />
            AI Security Suggestion
          </DialogTitle>
          <DialogDescription>
            Smart remediation for detected vulnerability: {vulnerability}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-accent" />
              <p className="text-sm text-muted-foreground">
                Analyzing vulnerability and generating recommendations...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
              <p className="text-destructive">{error}</p>
            </div>
          ) : suggestion ? (
            <div className="rounded-md bg-cyber-muted/50 p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">{suggestion}</pre>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {suggestion && (
            <Button className="bg-cyber-accent hover:bg-cyber-info">
              <Check className="mr-2 h-4 w-4" /> Apply Recommendations
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
