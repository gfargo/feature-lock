"use client";

import * as React from "react";
import { track } from "@vercel/analytics";
import { Check, Copy, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DocsInstallCommandProps = {
  command: string;
  index: number;
  className?: string;
};

export function DocsInstallCommand({
  command,
  index,
  className,
}: DocsInstallCommandProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);

    track("code_copied", {
      type: "install_command",
      snippet_index: index,
    });

    track("install_command_copied", {
      command,
      timestamp: new Date().toISOString(),
    });
  }, [command, index]);

  return (
    <div className={cn("relative group", className)}>
      <div className="flex items-center gap-3 bg-muted border border-primary/10 rounded-lg p-4">
        <Terminal className="size-4 text-primary flex-shrink-0" />
        <code className="text-sm text-foreground flex-1 overflow-x-auto">
          {command}
        </code>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
