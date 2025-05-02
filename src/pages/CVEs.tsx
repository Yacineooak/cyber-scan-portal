
import { useState } from "react";
import { AlertTriangle, Search, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock CVE data
const mockCVEs = [
  {
    id: "CVE-2023-1234",
    title: "Buffer Overflow in OpenSSH Server",
    severity: "Critical",
    cvssScore: 9.8,
    description: "A buffer overflow vulnerability in OpenSSH server allows remote attackers to execute arbitrary code.",
    affected: "OpenSSH versions prior to 8.8",
    published: "2023-02-15",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-1234"]
  },
  {
    id: "CVE-2023-5678",
    title: "SQL Injection in MySQL Connector",
    severity: "High",
    cvssScore: 8.2,
    description: "A SQL injection vulnerability in MySQL Connector allows remote attackers to execute arbitrary SQL commands.",
    affected: "MySQL Connector versions prior to 8.0.28",
    published: "2023-03-22",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-5678"]
  },
  {
    id: "CVE-2023-9012",
    title: "Cross-site Scripting in Apache HTTP Server",
    severity: "Medium",
    cvssScore: 6.5,
    description: "A cross-site scripting vulnerability in Apache HTTP Server allows remote attackers to inject arbitrary web script.",
    affected: "Apache HTTP Server versions prior to 2.4.55",
    published: "2023-04-10",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-9012"]
  }
];

const CVEItem = ({ cve }: { cve: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  const severityColor = 
    cve.severity === "Critical" ? "bg-red-500" :
    cve.severity === "High" ? "bg-amber-500" :
    cve.severity === "Medium" ? "bg-yellow-500" :
    "bg-green-500";
    
  return (
    <div className="bg-cyber-secondary p-4 rounded-md mb-4 border border-cyber-muted">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className={`w-3 h-3 rounded-full ${severityColor} mr-2`}></span>
            <h3 className="text-lg font-medium">{cve.id}</h3>
            <span className="bg-cyber-muted text-xs px-2 py-1 rounded ml-2">
              CVSS: {cve.cvssScore}
            </span>
          </div>
          <p className="text-sm mb-2">{cve.title}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Less" : "More"}
        </Button>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <h4 className="text-cyber-accent font-medium mb-1">Description</h4>
            <p>{cve.description}</p>
          </div>
          <div>
            <h4 className="text-cyber-accent font-medium mb-1">Affected</h4>
            <p>{cve.affected}</p>
          </div>
          <div>
            <h4 className="text-cyber-accent font-medium mb-1">Published</h4>
            <p>{cve.published}</p>
          </div>
          <div>
            <h4 className="text-cyber-accent font-medium mb-1">References</h4>
            <ul className="list-disc list-inside">
              {cve.references.map((ref: string, index: number) => (
                <li key={index} className="flex items-center">
                  <a 
                    href={ref} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyber-info hover:underline flex items-center"
                  >
                    {ref}
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export function CVEs() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      setSearchResults(mockCVEs.filter(cve => 
        cve.id.toLowerCase().includes(query.toLowerCase()) ||
        cve.title.toLowerCase().includes(query.toLowerCase()) ||
        cve.description.toLowerCase().includes(query.toLowerCase())
      ));
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">CVE Database</h2>
      </div>

      <Card>
        <div className="p-6 border-b border-cyber-muted">
          <h3 className="font-medium text-lg flex items-center">
            <AlertTriangle size={18} className="mr-2 text-cyber-accent" />
            Search Vulnerabilities
          </h3>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search by CVE ID, service name, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="bg-cyber-accent hover:bg-cyber-info"
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>

          <div>
            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-pulse-glow inline-block bg-cyber-accent h-8 w-8 rounded-full mb-4"></div>
                <p>Searching CVE database...</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div>
                <h4 className="text-sm text-muted-foreground mb-4">
                  Found {searchResults.length} vulnerabilities matching your query
                </h4>
                
                {searchResults.map((cve, index) => (
                  <CVEItem key={index} cve={cve} />
                ))}
              </div>
            )}

            {!isSearching && query && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle size={48} className="mx-auto mb-4" />
                <p>No vulnerabilities found matching "{query}"</p>
              </div>
            )}

            {!query && !searchResults.length && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle size={48} className="mx-auto mb-4" />
                <p>Enter a search term to find vulnerabilities</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CVEs;
