
import { useState } from "react";
import { Bell, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const [notifications] = useState(3);
  const { toast } = useToast();

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new security alerts to review.",
    });
  };

  return (
    <header className="bg-cyber-primary border-b border-cyber-muted h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Link to="/" className="flex items-center hover:text-cyber-accent transition-colors">
          <Shield className="h-8 w-8 text-cyber-accent mr-2" />
          <h1 className="text-xl font-bold">CyberScan Portal</h1>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer" onClick={handleNotificationsClick}>
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-full hover:bg-cyber-muted">
          <div className="bg-cyber-accent rounded-full p-1">
            <User className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
