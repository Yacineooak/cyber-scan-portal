
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
      // For demonstration purposes, we're using a mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock suggestions based on vulnerability type
      let suggestion;
      if (vulnerability.includes("CVE-2021-44790")) {
        suggestion = "This vulnerability affects Apache HTTP Server. Recommended actions:\n1. Upgrade to Apache version 2.4.52 or later\n2. Apply the available security patch\n3. Implement a Web Application Firewall (WAF) as a temporary mitigation";
      } else if (vulnerability.includes("CVE-2020-14145")) {
        suggestion = "This vulnerability affects OpenSSH. Recommended actions:\n1. Update to the latest OpenSSH version\n2. Configure proper SSH key management\n3. Implement IP filtering for SSH access";
      } else {
        suggestion = "General recommendations:\n1. Update the affected service to the latest version\n2. Apply security patches as they become available\n3. Consider implementing network segmentation to limit exposure";
      }
      
      setState({ isLoading: false, suggestion, error: null });
      toast({
        title: "AI Suggestion Generated",
        description: "Security remediation recommendations are available",
      });
      return suggestion;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate AI suggestion";
      setState({ isLoading: false, suggestion: null, error: errorMessage });
      toast({
        title: "Error",
        description: "Failed to generate AI suggestion",
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
