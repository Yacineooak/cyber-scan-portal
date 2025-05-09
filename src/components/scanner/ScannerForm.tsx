
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Play, X } from "lucide-react";

interface ScannerFormProps {
  scanType: string;
  target: string;
  setTarget: (target: string) => void;
  targets: string[];
  setTargets: (targets: string[]) => void;
  portRange: string;
  setPortRange: (range: string) => void;
  timeout: number;
  setTimeout: (timeout: number) => void;
  advancedOptions: boolean;
  setAdvancedOptions: (advanced: boolean) => void;
  isScanning: boolean;
  scanProgress: number;
  handleStartScan: () => void;
  handleStopScan: () => void;
  handleAddTarget: () => void;
  handleRemoveTarget: (target: string) => void;
}

export function ScannerForm({
  scanType,
  target,
  setTarget,
  targets,
  setTargets,
  portRange,
  setPortRange,
  timeout,
  setTimeout,
  advancedOptions,
  setAdvancedOptions,
  isScanning,
  scanProgress,
  handleStartScan,
  handleStopScan,
  handleAddTarget,
  handleRemoveTarget
}: ScannerFormProps) {
  const menuOptions = [
    { id: "tcp", title: "Scanner TCP" },
    { id: "udp", title: "Scanner UDP" },
    { id: "local", title: "Scanner Réseau Local" },
    { id: "os", title: "Détection du système d'exploitation (OS)" },
    { id: "firewall", title: "Détection de ports filtrés (pare-feu)" },
    { id: "quick", title: "Scan rapide (Top 100 ports)" },
    { id: "syn", title: "Scan SYN (admin/root)" },
    { id: "http", title: "Scan de bannière HTTP" },
    { id: "multi-ip", title: "Scan multiple IPs (via fichier)" }
  ];

  return (
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
          className={isScanning 
            ? "bg-destructive hover:bg-destructive/90 w-full scan-button" 
            : "bg-cyber-accent hover:bg-cyber-info w-full scan-button"}
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
  );
}
