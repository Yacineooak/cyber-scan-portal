
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-primary">
      <div className="text-center p-6 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-cyber-muted p-4">
            <AlertTriangle size={48} className="text-cyber-warning" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-cyber-info mb-6">Access Denied</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        
        <Link to="/">
          <Button className="bg-cyber-accent hover:bg-cyber-info">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
