
import { useState } from "react";
import { Search, Play, X, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// Mock data for scan results
const mockPortResults = [
  { port: 22, service: "SSH", status: "open", banner: "OpenSSH 8.2p1 Ubuntu-4ubuntu0.5" },
  { port: 80, service: "HTTP", status: "open", banner: "Apache/2.4.41 (Ubuntu)" },
  { port: 443, service: "HTTPS", status: "open", banner: "Apache/2.4.41 (Ubuntu)" },
  { port: 3306, service: "MySQL", status: "filtered", banner: "" },
  { port: 8080, service: "HTTP-Proxy", status: "closed", banner: "" },
];

export function Scanner() {
  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("1-1000");
  const [scanType, setScanType] = useState("tcp");
  const [timeout, setTimeout] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Options for scanner
  const scanOptions = {
    scanTypes: ["tcp", "udp", "syn", "quick", "multi-ip"],
    portPresets: ["Common (1-1000)", "All (1-65535)", "Well-known (1-1024)", "Registered (1025-49151)", "Custom"],
  };

  const handleStartScan = () => {
    // In a real app, this would connect to the backend
    setIsScanning(true);
    setResults([]);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResults(mockPortResults);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Scanner</h2>
        <div className="text-sm text-muted-foreground">
          {isScanning ? "Scan in progress..." : "Ready to scan"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg flex items-center">
              <Search size={18} className="mr-2 text-cyber-accent" />
              Scan Configuration
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target IP/Host</Label>
              <Input
                id="target"
                placeholder="e.g., 192.168.1.1 or example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <select 
                  id="scan-type"
                  className="w-full bg-cyber-muted border border-cyber-accent/20 rounded p-2"
                >
                  {scanOptions.scanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()} Scan
                    </option>
                  ))}
                </select>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="port-range">Port Range</Label>
              <Input
                id="port-range"
                placeholder="e.g., 1-1000 or 22,80,443"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
              />
            </div>

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
              <Switch id="advanced" />
            </div>

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

        <Card className="lg:col-span-2">
          <Tabs defaultValue="results">
            <div className="border-b border-cyber-muted">
              <div className="px-6 pt-6 pb-2">
                <TabsList className="bg-cyber-muted">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="banners">Service Banners</TabsTrigger>
                  <TabsTrigger value="os">OS Detection</TabsTrigger>
                  <TabsTrigger value="firewall">Firewall</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="results" className="p-6">
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead>
                      <tr>
                        <th>Port</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index}>
                          <td>{result.port}</td>
                          <td>{result.service}</td>
                          <td>
                            <span className={`status-indicator status-${result.status}`}></span>
                            {result.status}
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <button className="text-xs bg-cyber-muted px-2 py-1 rounded hover:bg-cyber-accent/20">
                                Details
                              </button>
                              <button className="text-xs bg-cyber-muted px-2 py-1 rounded hover:bg-cyber-accent/20 flex items-center">
                                <AlertTriangle size={12} className="mr-1" />
                                CVEs
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    </div>
  );
}

export default Scanner;
