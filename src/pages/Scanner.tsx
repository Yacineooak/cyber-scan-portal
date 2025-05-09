
import { useState } from "react";
import { 
  Search, Play, X, AlertTriangle, Download, FileText, FileJson, 
  Activity, Shield, Laptop, Command, Filter, Zap, Cpu, Globe, 
  Network, FileSearch, Lightbulb 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { AiSuggestionDialog } from "@/components/AiSuggestionDialog";

// Mock data for scan results
const mockPortResults = [
  { port: 22, service: "SSH", status: "open", banner: "OpenSSH 8.2p1 Ubuntu-4ubuntu0.5", cve: "CVE-2020-14145" },
  { port: 80, service: "HTTP", status: "open", banner: "Apache/2.4.41 (Ubuntu)", cve: "CVE-2021-44790" },
  { port: 443, service: "HTTPS", status: "open", banner: "Apache/2.4.41 (Ubuntu)", cve: "CVE-2021-44790" },
  { port: 3306, service: "MySQL", status: "filtered", banner: "", cve: null },
  { port: 8080, service: "HTTP-Proxy", status: "closed", banner: "", cve: null },
];

// Menu options
const menuOptions = [
  { id: "tcp", title: "Scanner TCP", icon: <Search size={20} /> },
  { id: "udp", title: "Scanner UDP", icon: <Activity size={20} /> },
  { id: "local", title: "Scanner Réseau Local", icon: <Network size={20} /> },
  { id: "os", title: "Détection du système d'exploitation (OS)", icon: <Laptop size={20} /> },
  { id: "firewall", title: "Détection de ports filtrés (pare-feu)", icon: <Shield size={20} /> },
  { id: "quick", title: "Scan rapide (Top 100 ports)", icon: <Zap size={20} /> },
  { id: "syn", title: "Scan SYN (admin/root)", icon: <Command size={20} /> },
  { id: "http", title: "Scan de bannière HTTP", icon: <Globe size={20} /> },
  { id: "multi-ip", title: "Scan multiple IPs (via fichier)", icon: <FileSearch size={20} /> },
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
  const [udpEnabled, setUdpEnabled] = useState(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState("");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isLoading, suggestion, error, generateSuggestion } = useAiSuggestions();

  // Options for scanner
  const scanOptions = {
    scanTypes: menuOptions.map(option => option.id),
    portPresets: ["Common (1-1000)", "All (1-65535)", "Well-known (1-1024)", "Registered (1025-49151)", "Custom"],
  };

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
      description: `Starting ${menuOptions.find(opt => opt.id === scanType)?.title || scanType} on ${targets.length > 0 ? `${targets.length} targets` : target}`,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Scanner</h2>
        <div className="text-sm text-muted-foreground">
          {isScanning ? "Scan in progress..." : "Ready to scan"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg flex items-center">
              <Search size={18} className="mr-2 text-cyber-accent" />
              Menu Principal
            </h3>
          </div>
          <div className="p-6 space-y-1">
            {menuOptions.map((option, idx) => (
              <Button
                key={option.id}
                variant={scanType === option.id ? "default" : "outline"}
                className="w-full justify-start mb-2"
                onClick={() => setScanType(option.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{idx + 1}.</span>
                  {option.icon}
                  <span className="ml-2">{option.title}</span>
                </div>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => {
                toast({
                  title: "Application fermée",
                  description: "Merci d'avoir utilisé CyberScan.",
                });
              }}
            >
              <div className="flex items-center">
                <span className="mr-2">0.</span>
                <X size={20} />
                <span className="ml-2">Quitter</span>
              </div>
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg flex items-center">
              {menuOptions.find(opt => opt.id === scanType)?.icon}
              <span className="ml-2">{menuOptions.find(opt => opt.id === scanType)?.title}</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {scanType === "multi-ip" ? (
              <div className="space-y-2">
                <Label htmlFor="targets">Target IPs/Hosts</Label>
                <div className="flex gap-2">
                  <Input
                    id="target"
                    placeholder="e.g., 192.168.1.1 or example.com"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <Button onClick={handleAddTarget} type="button" variant="outline">Add</Button>
                </div>
                {targets.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Target List:</Label>
                    <div className="bg-cyber-muted p-2 rounded-md max-h-32 overflow-y-auto">
                      <ul className="space-y-1">
                        {targets.map((t, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <span>{t}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveTarget(t)}
                              className="h-6 w-6 p-0"
                            >
                              <X size={14} />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="target">Target IP/Host</Label>
                <Input
                  id="target"
                  placeholder="e.g., 192.168.1.1 or example.com"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
            )}

            {scanType !== "quick" && (
              <div className="space-y-2">
                <Label htmlFor="port-range">Port Range</Label>
                <Input
                  id="port-range"
                  placeholder="e.g., 1-1000 or 22,80,443"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                />
              </div>
            )}

            {scanType === "udp" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="udp-fast" />
                <Label htmlFor="udp-fast">Fast UDP Scan (less accurate)</Label>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="timeout">Timeout (seconds): {timeout}</Label>
              </div>
              <Slider
                id="timeout"
                min={1}
                max={10}
                step={1}
                value={[timeout]}
                onValueChange={(value) => setTimeout(value[0])}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="advanced">Advanced Options</Label>
              <Switch 
                id="advanced" 
                checked={advancedOptions} 
                onCheckedChange={setAdvancedOptions}
              />
            </div>

            {advancedOptions && (
              <div className="space-y-3 pt-3 border-t border-cyber-muted">
                <div className="flex items-center space-x-2">
                  <Checkbox id="service-detection" defaultChecked />
                  <Label htmlFor="service-detection">Service Detection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="os-detection" />
                  <Label htmlFor="os-detection">OS Detection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="firewall-detection" />
                  <Label htmlFor="firewall-detection">Firewall Detection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-cves" defaultChecked />
                  <Label htmlFor="check-cves">Check for CVEs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="aggressive-scan" />
                  <Label htmlFor="aggressive-scan">Aggressive Scan</Label>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={isScanning ? handleStopScan : handleStartScan}
                className={isScanning ? "bg-destructive hover:bg-destructive/90 w-full" : "bg-cyber-accent hover:bg-cyber-info w-full"}
              >
                {isScanning ? (
                  <X className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isScanning ? "Stop Scan" : "Start Scan"}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-2 pt-2">
                <div className="text-sm flex justify-between">
                  <span>Scanning...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-cyber-muted rounded-full h-2.5">
                  <div 
                    className="bg-cyber-accent h-2.5 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-4">
          <Tabs defaultValue="results">
            <div className="border-b border-cyber-muted">
              <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                <TabsList className="bg-cyber-muted">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="banners">Service Banners</TabsTrigger>
                  <TabsTrigger value="os">OS Detection</TabsTrigger>
                  <TabsTrigger value="firewall">Firewall</TabsTrigger>
                </TabsList>
                
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateReport("pdf")}
                      className="flex items-center"
                    >
                      <FileText size={16} className="mr-1" />
                      PDF Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateReport("csv")}
                      className="flex items-center"
                    >
                      <FileJson size={16} className="mr-1" />
                      CSV Export
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="results" className="p-6">
              {results.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Port</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>CVE</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.port}</TableCell>
                        <TableCell>{result.service}</TableCell>
                        <TableCell>
                          <span className={`status-indicator status-${result.status}`}></span>
                          {result.status}
                        </TableCell>
                        <TableCell>
                          {result.cve ? (
                            <span className="text-cyber-warning flex items-center">
                              <AlertTriangle size={14} className="mr-1" />
                              {result.cve}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">None found</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8">
                              Details
                            </Button>
                            {result.cve && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-cyber-info flex items-center"
                                onClick={() => handleGetAiSuggestion(result.cve)}
                              >
                                <Lightbulb size={14} className="mr-1" />
                                AI Suggestion
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Search size={48} className="mb-4" />
                  <p>No scan results yet. Configure and start a scan.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="banners" className="p-6">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.filter(r => r.banner).map((result, index) => (
                    <div key={index} className="bg-cyber-muted p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">{result.service} (Port {result.port})</span>
                        <span className={`status-indicator status-${result.status} self-center`}></span>
                      </div>
                      <pre className="bg-cyber-primary p-3 rounded font-mono text-sm whitespace-pre-wrap">
                        {result.banner}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Search size={48} className="mb-4" />
                  <p>No banner information available yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="os" className="p-6">
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <AlertTriangle size={48} className="mb-4" />
                <p>OS detection module not active. Start a scan with OS detection enabled.</p>
              </div>
            </TabsContent>

            <TabsContent value="firewall" className="p-6">
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <AlertTriangle size={48} className="mb-4" />
                <p>Firewall detection module not active. Start a scan with firewall detection enabled.</p>
              </div>
            </TabsContent>
          </Tabs>
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
