import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50",
                className
            )}
        >
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
                <Icon className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <h3 className="mb-2 text-xl font-serif font-medium text-foreground">{title}</h3>
            <p className="max-w-sm mb-6 text-muted-foreground">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
