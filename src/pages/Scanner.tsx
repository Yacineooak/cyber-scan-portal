
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { AiSuggestionDialog } from "@/components/AiSuggestionDialog";
import { ScannerMainMenu } from "@/components/scanner/ScannerMainMenu";
import { ScannerForm } from "@/components/scanner/ScannerForm";
import { ScanResultsPanel } from "@/components/scanner/ScanResultsPanel";

// Mock data for scan results
const mockPortResults = [
  { port: 22, service: "SSH", status: "open", banner: "OpenSSH 8.2p1 Ubuntu-4ubuntu0.5", cve: "CVE-2020-14145" },
  { port: 80, service: "HTTP", status: "open", banner: "Apache/2.4.41 (Ubuntu)", cve: "CVE-2021-44790" },
  { port: 443, service: "HTTPS", status: "open", banner: "Apache/2.4.41 (Ubuntu)", cve: "CVE-2021-44790" },
  { port: 3306, service: "MySQL", status: "filtered", banner: "", cve: null },
  { port: 8080, service: "HTTP-Proxy", status: "closed", banner: "", cve: null },
];

export function Scanner() {
  const [target, setTarget] = useState("");
  const [targets, setTargets] = useState<string[]>([]);
  const [portRange, setPortRange] = useState("1-1000");
  const [scanType, setScanType] = useState("tcp");
  const [timeout, setTimeout] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState("");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isLoading, suggestion, error, generateSuggestion } = useAiSuggestions();

  const handleStartScan = () => {
    // Validate inputs
    if (!target && targets.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter at least one target IP or hostname.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would connect to the backend
    setIsScanning(true);
    setResults([]);
    setScanProgress(0);
    
    // Notify scan start
    toast({
      title: "Scan Started",
      description: `Starting ${scanType} scan on ${targets.length > 0 ? `${targets.length} targets` : target}`,
    });
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResults(mockPortResults);
          
          // Notify scan completion
          toast({
            title: "Scan Completed",
            description: "The scan has completed successfully.",
            variant: "default",
          });
          
          // Check if vulnerabilities were found
          const vulns = mockPortResults.filter(r => r.cve);
          if (vulns.length > 0) {
            toast({
              title: "Vulnerabilities Detected",
              description: `${vulns.length} vulnerabilities found. AI recommendations available.`,
              variant: "destructive",
            });
          }
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "The scan was stopped by the user.",
      variant: "destructive",
    });
  };

  const handleAddTarget = () => {
    if (target && !targets.includes(target)) {
      setTargets([...targets, target]);
      setTarget("");
    }
  };

  const handleRemoveTarget = (targetToRemove: string) => {
    setTargets(targets.filter(t => t !== targetToRemove));
  };

  const generateReport = (format: "pdf" | "csv") => {
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "Please complete a scan before generating a report.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `Your ${format.toUpperCase()} report has been generated and is ready for download.`,
    });
    
    // In a real application, this would trigger the actual download
    // through a backend API endpoint
  };

  const handleGetAiSuggestion = (cve: string) => {
    setSelectedVulnerability(cve);
    setAiDialogOpen(true);
    generateSuggestion(cve);
  };

  const handleQuit = () => {
    toast({
      title: "Application Information",
      description: "In a real application, this would close the application. For this demo, it just shows this message.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Scanner</h2>
        <div className="text-sm text-muted-foreground">
          {isScanning ? "Scan in progress..." : "Ready to scan"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Menu Panel */}
        <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <ScannerMainMenu 
            scanType={scanType} 
            setScanType={setScanType}
            onQuit={handleQuit}
          />
        </Card>

        {/* Scanner Configuration Panel */}
        <Card className="lg:col-span-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg flex items-center">
              {scanType === "tcp" && "Scanner TCP"}
              {scanType === "udp" && "Scanner UDP"}
              {scanType === "local" && "Scanner Réseau Local"}
              {scanType === "os" && "Détection du système d'exploitation (OS)"}
              {scanType === "firewall" && "Détection de ports filtrés (pare-feu)"}
              {scanType === "quick" && "Scan rapide (Top 100 ports)"}
              {scanType === "syn" && "Scan SYN (admin/root)"}
              {scanType === "http" && "Scan de bannière HTTP"}
              {scanType === "multi-ip" && "Scan multiple IPs (via fichier)"}
            </h3>
          </div>
          <ScannerForm 
            scanType={scanType}
            target={target}
            setTarget={setTarget}
            targets={targets}
            setTargets={setTargets}
            portRange={portRange}
            setPortRange={setPortRange}
            timeout={timeout}
            setTimeout={setTimeout}
            advancedOptions={advancedOptions}
            setAdvancedOptions={setAdvancedOptions}
            isScanning={isScanning}
            scanProgress={scanProgress}
            handleStartScan={handleStartScan}
            handleStopScan={handleStopScan}
            handleAddTarget={handleAddTarget}
            handleRemoveTarget={handleRemoveTarget}
          />
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <ScanResultsPanel 
            results={results} 
            generateReport={generateReport} 
            handleGetAiSuggestion={handleGetAiSuggestion} 
          />
        </Card>
      </div>

      <AiSuggestionDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        vulnerability={selectedVulnerability}
        isLoading={isLoading}
        suggestion={suggestion}
        error={error}
      />
    </div>
  );
}

export default Scanner;
