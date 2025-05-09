
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Search, Activity, Network, Laptop, Shield, Zap, Command, Globe, FileSearch } from "lucide-react";

interface MenuOption {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ScannerMainMenuProps {
  scanType: string;
  setScanType: (type: string) => void;
  onQuit: () => void;
}

export function ScannerMainMenu({ scanType, setScanType, onQuit }: ScannerMainMenuProps) {
  const menuOptions: MenuOption[] = [
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

  return (
    <>
      <div className="p-6 border-b border-cyber-muted">
        <h3 className="font-medium text-lg flex items-center">
          <Search size={18} className="mr-2 text-cyber-accent" />
          === Menu Principal ===
        </h3>
      </div>
      <div className="p-6 space-y-1">
        {menuOptions.map((option, idx) => (
          <Button
            key={option.id}
            variant={scanType === option.id ? "default" : "outline"}
            className="w-full justify-start mb-2 menu-item"
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
          className="w-full justify-start mb-2 menu-item"
          onClick={onQuit}
        >
          <div className="flex items-center">
            <span className="mr-2">0.</span>
            <X size={20} />
            <span className="ml-2">Quitter</span>
          </div>
        </Button>
      </div>
    </>
  );
}
