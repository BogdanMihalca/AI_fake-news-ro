import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

// Define types for result and API response
interface Result {
  label: string;
  score: number;
}

interface APIResponse {
  results: Result[];
  text: string;
}

const useBlackBoxMagic = () => {
  const [result, setResult] = useState<APIResponse>();
  const [ready, setReady] = useState<boolean | null>(null);
  const { toast } = useToast();

  const logMessage = (
    type: "INFO" | "ERROR" | "SUCCESS",
    message: string,
    data?: any
  ) => {
    const color =
      type === "INFO" ? "yellow" : type === "ERROR" ? "red" : "green";
    console.log(
      `%c Blackboxify [${type}]: ${message}`,
      `color: ${color}`,
      data
    );
  };

  const blackboxify = async (text: string, type: "text" | "url") => {
    if (!text) {
      logMessage("ERROR", "Text missing");
      toast({
        title: "Text missing",
        description: "Please enter some text or a URL",
        variant: "destructive",
      });
      return;
    }

    setReady(false);

    try {
      let response = null;
      if (type === "text") {
        logMessage("INFO", "Attempting to get result from text: ", text);
        response = await fetch(`/api/blackboxmagic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
      } else {
        logMessage("INFO", "Attempting to get result from URL: ", text);
        response = await fetch(`/api/blackboxmagic`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: text }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json: APIResponse = await response.json();
      setResult(json);
      logMessage("SUCCESS", "Result success:", json);
    } catch (error: any) {
      logMessage("ERROR", "Error getting result:", error);
      toast({
        title: "Error getting result",
        description: error.message as string,
        variant: "destructive",
      });
    } finally {
      setReady(true);
    }
  };

  return { result, ready, blackboxify };
};

export default useBlackBoxMagic;
