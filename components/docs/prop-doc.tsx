import { Badge } from "@/components/ui/badge";

type PropDocProps = {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
};

export function PropDoc({
  name,
  type,
  description,
  defaultValue,
}: PropDocProps) {
  return (
    <div className="pb-4 border-b border-primary/10 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="font-mono text-sm font-semibold">{name}</div>
        {defaultValue ? (
          <Badge
            variant="secondary"
            className="text-xs"
          >
            {defaultValue}
          </Badge>
        ) : null}
      </div>
      <div className="font-mono text-xs text-primary mb-2">{type}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}
