"use client";

import * as React from "react";
import { track } from "@vercel/analytics";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DocsCodeBlockProps = {
  code: string;
  index: number;
  language?: string;
  type?: string;
  className?: string;
};

export function DocsCodeBlock({
  code,
  index,
  language = "tsx",
  type = "code",
  className,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);

    track("code_copied", {
      type,
      snippet_index: index,
    });
  }, [code, index, type]);

  return (
    <div className={cn("relative group", className)}>
      <pre
        data-language={language}
        className={cn(
          "bg-muted border border-primary/10 rounded-lg p-4 overflow-x-auto text-sm",
          `language-${language}`
        )}
        aria-label={`${language} code snippet`}
      >
        <code className="text-foreground">{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
