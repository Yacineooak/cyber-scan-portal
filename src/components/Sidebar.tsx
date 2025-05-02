
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Search, 
  Shield, 
  Activity, 
  FileJson, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  AlertTriangle,
  Terminal,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
};

const NavItem = ({ to, icon, label, collapsed, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 rounded-md mb-1 transition-all",
        isActive 
          ? "bg-cyber-accent text-white" 
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

type NavSection = {
  title: string;
  items: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }[];
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const navSections: NavSection[] = [
    {
      title: "Main",
      items: [
        {
          to: "/",
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard"
        },
        {
          to: "/scanner",
          icon: <Search size={20} />,
          label: "Scanner"
        },
        {
          to: "/sniffer",
          icon: <Activity size={20} />,
          label: "Sniffer"
        },
        {
          to: "/cves",
          icon: <AlertTriangle size={20} />,
          label: "CVEs"
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          to: "/os-detection",
          icon: <Terminal size={20} />,
          label: "OS Detection"
        },
        {
          to: "/firewall",
          icon: <Shield size={20} />,
          label: "Firewall"
        }
      ]
    },
    {
      title: "Data",
      items: [
        {
          to: "/logs",
          icon: <FileText size={20} />,
          label: "Logs"
        },
        {
          to: "/export",
          icon: <FileJson size={20} />,
          label: "Export"
        },
        {
          to: "/database",
          icon: <Database size={20} />,
          label: "Database"
        }
      ]
    }
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold text-cyber-accent">
            CyberScan
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className="text-xs uppercase text-muted-foreground mb-2 px-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                isActive={activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavItem
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          collapsed={collapsed}
          isActive={activeItem === "/settings"}
          onClick={() => setActiveItem("/settings")}
        />
      </div>
    </div>
  );
}

export default Sidebar;
