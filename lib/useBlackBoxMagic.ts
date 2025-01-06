"use client";

import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { preprocessText, validateUrlForMaliciousContent } from "./util";

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
  const worker = useRef<any>(null);

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

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  // Create a callback function for messages from the worker thread.
  const onMessageReceived = (e: any) => {
    switch (e.data.status) {
      case "initiate":
        setReady(false);
        break;
      case "ready":
        setReady(true);
        break;
      case "complete":
        setReady(true);
        setResult(e.data.output);
        logMessage("SUCCESS", "Result received:", e.data.output);
        break;
    }
  };

  const blackboxify = useCallback(
    async (text: string, type: "text" | "url") => {
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
        if (type === "text") {
          const preprocessed = preprocessText(text);
          logMessage("INFO", "Attempting to get result from text: ", text);
          if (worker.current) {
            worker.current.postMessage({ text: preprocessed });
          }
        } else {
          logMessage("INFO", "Attempting to get result from URL: ", text);
          //check the url for malicious content
          const maliciousError = await validateUrlForMaliciousContent(text);
          if (maliciousError) {
            throw new Error(maliciousError);
          }
          const response = await fetch("/api/grabWebArticle", {
            method: "POST",
            headers: {
              "Content-Type": "text/html",
            },
            body: JSON.stringify({ url: text }),
          });

          const data = await response.json();

          const preprocessed = preprocessText(data.content);

          if (worker.current) {
            worker.current.postMessage({ text: preprocessed });
          }
        }
      } catch (error: any) {
        logMessage("ERROR", "Error getting result:", error);
        toast({
          title: "Error getting result",
          description: error.message as string,
          variant: "destructive",
        });
        setResult(undefined);
      }
    },
    [toast]
  );

  const reset = () => {
    setResult(undefined);
    setReady(null);
  };

  return { result, ready, blackboxify, reset };
};

export default useBlackBoxMagic;
