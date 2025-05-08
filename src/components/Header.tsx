
import { useState } from "react";
import { Bell, User, Shield, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [notifications] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new security alerts to review.",
    });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: "Logged In",
      description: "You have successfully logged in as Admin.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
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
        
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-full hover:bg-cyber-muted">
                <div className="bg-cyber-accent rounded-full p-1">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} variant="outline" size="sm" className="flex items-center">
            <LogIn className="h-4 w-4 mr-1" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
