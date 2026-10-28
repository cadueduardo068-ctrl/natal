import { ArrowRight } from "lucide-react";
import type { ReactNode, MouseEvent } from "react";
type Props = {
  href: string;
  placement: string;
  onPurchase: (placement: string) => void;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};
export function PurchaseLink({
  href,
  placement,
  onPurchase,
  children = "QUERO MINHAS RECEITAS DE NATAL",
  className = "",
  compact = false,
}: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button === 0) onPurchase(placement);
  }
  return (
    <a
      href={href}
      className={`purchase ${compact ? "purchase-compact" : ""} ${className}`}
      data-cta={placement}
      onClick={handleClick}
    >
      <span>{children}</span>
      <ArrowRight size={20} aria-hidden="true" />
    </a>
  );
}
