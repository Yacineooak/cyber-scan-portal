
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, FileJson, AlertTriangle, Lightbulb } from "lucide-react";

interface ScanResult {
  port: number;
  service: string;
  status: string;
  banner: string;
  cve: string | null;
}

interface ScanResultsPanelProps {
  results: ScanResult[];
  generateReport: (format: "pdf" | "csv") => void;
  handleGetAiSuggestion: (cve: string) => void;
}

export function ScanResultsPanel({ results, generateReport, handleGetAiSuggestion }: ScanResultsPanelProps) {
  return (
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
          <Table className="results-container">
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
                <TableRow key={index} className="hover:bg-cyber-muted/30 transition-colors">
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
  );
}
