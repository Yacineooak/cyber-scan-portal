
import { useState } from "react";
import { useToast } from "./use-toast";

type SuggestionState = {
  isLoading: boolean;
  suggestion: string | null;
  error: string | null;
};

export function useAiSuggestions() {
  const [state, setState] = useState<SuggestionState>({
    isLoading: false,
    suggestion: null,
    error: null,
  });
  const { toast } = useToast();

  const generateSuggestion = async (vulnerability: string) => {
    setState({ isLoading: true, suggestion: null, error: null });
    
    try {
      // In a real application, this would be an API call to an AI service
      // For demonstration purposes, we're using a mock response with a simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced mock suggestions based on vulnerability type
      let suggestion;
      if (vulnerability.includes("CVE-2021-44790")) {
        suggestion = "# Apache HTTP Server Vulnerability (CVE-2021-44790)\n\n## Risk Assessment\n- **Severity**: HIGH\n- **Impact**: Remote code execution\n- **CVSS Score**: 8.2/10\n\n## Recommended Actions\n1. Upgrade to Apache version 2.4.52 or later immediately\n2. Apply the available security patch from Apache\n3. Implement a Web Application Firewall (WAF) rule to filter malicious requests\n4. Temporarily consider limiting access to the affected server if upgrade is not possible\n\n## Technical Details\nThis vulnerability affects the mod_lua component of Apache HTTP Server, where a malicious script could use a buffer overflow to execute arbitrary code with the privileges of the HTTP server.";
      } else if (vulnerability.includes("CVE-2020-14145")) {
        suggestion = "# OpenSSH Client Vulnerability (CVE-2020-14145)\n\n## Risk Assessment\n- **Severity**: MEDIUM\n- **Impact**: Information disclosure\n- **CVSS Score**: 5.9/10\n\n## Recommended Actions\n1. Update to the latest OpenSSH version (8.4 or later)\n2. Enforce proper SSH key management policies\n3. Implement IP filtering for SSH access\n4. Consider implementing multi-factor authentication for SSH access\n\n## Technical Details\nThis vulnerability affects the initial connection behavior of OpenSSH clients, potentially leaking client information to malicious servers. While not critical, this could be used in reconnaissance activities before more severe attacks.";
      } else {
        suggestion = "# Generic Vulnerability Response\n\n## Risk Assessment\n- **Severity**: TO BE DETERMINED\n- **Impact**: Potential system compromise\n\n## Recommended Actions\n1. Update the affected service to the latest version\n2. Apply available security patches immediately\n3. Implement network segmentation to limit exposure\n4. Monitor system logs for suspicious activity\n5. Consider using a Web Application Firewall if applicable\n\n## Technical Details\nInsufficient information available for this specific CVE. Please consult the National Vulnerability Database for more details.";
      }
      
      setState({ isLoading: false, suggestion, error: null });
      toast({
        title: "AI Remediation Ready",
        description: "Security recommendations have been generated for review",
      });
      return suggestion;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate AI remediation suggestion";
      setState({ isLoading: false, suggestion: null, error: errorMessage });
      toast({
        title: "Error",
        description: "Failed to generate AI security recommendations",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    ...state,
    generateSuggestion,
  };
}
