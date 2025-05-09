
import { AlertTriangle, Check, Lightbulb, Loader2, ShieldAlert, Shield } from "lucide-react";
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
      <DialogContent className="sm:max-w-[550px] border border-cyber-accent/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-cyber-accent" />
            AI Security Remediation
          </DialogTitle>
          <DialogDescription className="text-sm">
            Smart remediation for detected vulnerability: <span className="font-mono text-cyber-warning">{vulnerability}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-8">
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-cyber-accent" />
                <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-cyber-accent opacity-20"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Analyzing vulnerability and generating recommendations...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
              <p className="text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">Please try again or check your network connection.</p>
            </div>
          ) : suggestion ? (
            <div className="space-y-4">
              <div className="rounded-md bg-cyber-muted/50 p-4 border border-cyber-accent/20">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{suggestion}</pre>
              </div>
              <div className="flex items-center p-3 bg-cyber-primary/20 rounded-md border border-cyber-accent/10">
                <Shield className="h-5 w-5 text-cyber-info mr-3" />
                <p className="text-xs">
                  These remediation steps are generated using AI analysis of known CVE databases and security best practices.
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-cyber-muted">
            Close
          </Button>
          {suggestion && (
            <Button className="bg-cyber-accent hover:bg-cyber-info glow">
              <Check className="mr-2 h-4 w-4" /> Apply Recommendations
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
