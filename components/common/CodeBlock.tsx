"use client";
import { cn } from "@/lib/utils";
import { CopyBlock, dracula } from "react-code-blocks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  title?: string;
  classNames?: string;
  language?: string;
  highLight?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  title,
  classNames,
  language,
  highLight,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "m-8 rounded-md shadow-md shadow-slate-800 overflow-hidden",
        classNames
      )}
    >
      <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger className="w-full" asChild>
          <>
            <div
              className="flex justify-between items-stretch w-full cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <h4 className="text-lg font-bold p-2 bg-slate-800 text-blue-300 -mb-1">
                {title}
              </h4>
              <div className="p-2 bg-slate-800 text-blue-300 text-sm">
                {!isCollapsed ? "Show Code ↓" : "Hide Code ↑"}
              </div>
            </div>
            {
              // a shadowed code block ith a blur layer
              !isCollapsed && (
                <div className="relative h-[200px] overflow-hidden">
                  <CopyBlock
                    text={code}
                    language={language || "python"}
                    showLineNumbers={true}
                    theme={dracula}
                    wrapLongLines={true}
                    customStyle={{
                      fontSize: ".7rem", // font size
                    }}
                    highlight={highLight}
                  />
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50
                backdrop-blur-[1px] z-10"
                  ></div>
                </div>
              )
            }
          </>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {" "}
          <CopyBlock
            text={code}
            language={language || "python"}
            showLineNumbers={true}
            theme={dracula}
            wrapLongLines={true}
            customStyle={{ fontSize: ".7rem" }}
            highlight={highLight}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export { CodeBlock };
