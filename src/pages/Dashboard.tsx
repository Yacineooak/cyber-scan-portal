
import { AlertTriangle, CheckCircle, Activity, Shield, Server, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const StatsCard = ({ title, value, icon, className }: { title: string; value: string; icon: React.ReactNode; className?: string }) => (
  <Card className={`p-6 ${className}`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-cyber-muted p-3 rounded-full">
        {icon}
      </div>
    </div>
  </Card>
);

const RecentScanItem = ({ time, target, status }: { time: string; target: string; status: string }) => {
  const statusColor = status === 'Completed' 
    ? 'text-green-500' 
    : status === 'In Progress' 
      ? 'text-amber-500' 
      : 'text-red-500';
      
  return (
    <div className="flex items-center justify-between py-3 border-b border-cyber-muted last:border-0">
      <div className="flex items-center">
        <Clock size={16} className="text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
      <div className="font-medium">{target}</div>
      <div className={`text-sm ${statusColor}`}>{status}</div>
    </div>
  );
};

const VulnerabilityItem = ({ severity, title, count }: { severity: string; title: string; count: number }) => {
  const severityColor = 
    severity === 'Critical' ? 'bg-red-500' :
    severity === 'High' ? 'bg-amber-500' :
    severity === 'Medium' ? 'bg-yellow-500' :
    'bg-green-500';

  return (
    <div className="flex items-center justify-between py-3 border-b border-cyber-muted last:border-0">
      <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full ${severityColor} mr-2`}></span>
        <span>{severity}</span>
      </div>
      <div className="flex-1 ml-4 font-medium">{title}</div>
      <div className="bg-cyber-muted px-2 py-1 rounded text-sm">{count}</div>
    </div>
  );
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Scans" 
          value="3" 
          icon={<Activity size={24} className="text-cyber-accent" />} 
        />
        <StatsCard 
          title="Open Ports" 
          value="47" 
          icon={<Server size={24} className="text-cyber-info" />} 
        />
        <StatsCard 
          title="Vulnerabilities" 
          value="12" 
          icon={<AlertTriangle size={24} className="text-cyber-warning" />} 
        />
        <StatsCard 
          title="Protected Systems" 
          value="8" 
          icon={<Shield size={24} className="text-cyber-success" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg">Recent Scans</h3>
          </div>
          <div className="p-6">
            <RecentScanItem time="14:32" target="192.168.1.1" status="Completed" />
            <RecentScanItem time="14:15" target="10.0.0.25" status="In Progress" />
            <RecentScanItem time="13:48" target="example.com" status="Completed" />
            <RecentScanItem time="12:30" target="172.16.254.1" status="Completed" />
            <RecentScanItem time="11:15" target="192.168.0.105" status="Failed" />
          </div>
          <div className="bg-cyber-muted p-4 flex justify-center">
            <Link to="/scanner" className="text-cyber-accent hover:text-cyber-info transition-colors">
              View All Scans
            </Link>
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg">Vulnerabilities</h3>
          </div>
          <div className="p-6">
            <VulnerabilityItem severity="Critical" title="CVE-2023-1234" count={2} />
            <VulnerabilityItem severity="High" title="CVE-2023-5678" count={5} />
            <VulnerabilityItem severity="Medium" title="CVE-2023-9012" count={3} />
            <VulnerabilityItem severity="Low" title="CVE-2023-3456" count={2} />
          </div>
          <div className="bg-cyber-muted p-4 flex justify-center">
            <Link to="/cves" className="text-cyber-accent hover:text-cyber-info transition-colors">
              View All Vulnerabilities
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-cyber-muted flex justify-between items-center">
          <h3 className="font-medium text-lg">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/scanner" className="flex flex-col items-center justify-center p-4 bg-cyber-secondary rounded-md border border-cyber-muted hover:border-cyber-accent transition-all">
            <Search size={24} className="text-cyber-accent mb-2" />
            <span>New Scan</span>
          </Link>
          <Link to="/sniffer" className="flex flex-col items-center justify-center p-4 bg-cyber-secondary rounded-md border border-cyber-muted hover:border-cyber-accent transition-all">
            <Activity size={24} className="text-cyber-info mb-2" />
            <span>Start Sniffer</span>
          </Link>
          <Link to="/cves" className="flex flex-col items-center justify-center p-4 bg-cyber-secondary rounded-md border border-cyber-muted hover:border-cyber-accent transition-all">
            <AlertTriangle size={24} className="text-cyber-warning mb-2" />
            <span>Check CVEs</span>
          </Link>
          <div className="flex flex-col items-center justify-center p-4 bg-cyber-secondary rounded-md border border-cyber-muted hover:border-cyber-accent transition-all cursor-pointer">
            <Shield size={24} className="text-cyber-success mb-2" />
            <span>Firewall Check</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
