import { ExternalLink } from "lucide-react";
import { accountDisplayName, accountSalesforceUrl } from "@/lib/copy/overrides";

interface Props {
  accountId: string | null | undefined;
  accountName?: string | null;
  className?: string;
  /** Hide the trailing external-link glyph (e.g. in tight pill badges). */
  noIcon?: boolean;
}

/**
 * Account name that opens the corresponding Salesforce record in a new
 * tab when we have the SF account id. Falls back to plain text so
 * non-account rows (opportunities, contacts) don't 404 into SF.
 *
 * Server-safe — uses a bare anchor, no client state.
 */
export function AccountLink({
  accountId,
  accountName,
  className = "",
  noIcon = false,
}: Props) {
  const display = accountDisplayName(accountName ?? accountId ?? "");
  const url = accountSalesforceUrl(accountId);
  if (!url) {
    return <span className={className}>{display}</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} inline-flex items-baseline gap-s1 decoration-foreground/30 underline-offset-2 hover:underline`}
    >
      {display}
      {!noIcon && (
        <ExternalLink
          className="h-[12px] w-[12px] translate-y-[1px] opacity-60"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </a>
  );
}
