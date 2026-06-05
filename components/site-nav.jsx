import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { SupportDialog } from "@/components/support-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const moreLinks = [
  { href: "/obituary-stories/", label: "Stories" },
  { href: "/obituary-articles/", label: "Articles" },
  { href: "/obituary-examples/", label: "Examples" },
  { href: "/free-obituary-generator/", label: "Generator" },
  { href: "/obituary-checklist/", label: "Checklist" },
  { href: "/obituary-wording/", label: "Wording" },
  { href: "/obituary-writing-prompts/", label: "Prompts" },
  { href: "/what-are-obituary-comics/", label: "Obituary Comics" },
  { href: "/educators-libraries/", label: "Educators" },
  { href: "/about/", label: "Method" },
  { href: "/press/", label: "Press" },
];

export function SiteNav() {
  return (
    <nav className="site-nav wrap" aria-label="Primary">
      <Link className="site-brand" href="/">
        Memento Mori
      </Link>
      <div className="site-nav-links">
        <Link href="/#archive">Archive</Link>
        <Link href="/newsletter/">Newsletter</Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="site-nav-more-trigger" aria-label="Open more navigation links">
            <span>More</span>
            <ChevronDown className="site-nav-more-chevron" aria-hidden="true" size={14} strokeWidth={2.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="site-nav-more-content" align="end" sideOffset={14}>
            {moreLinks.map((link) => (
              <DropdownMenuItem asChild key={link.href}>
                <Link className="site-nav-more-item" href={link.href}>
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <SupportDialog />
      </div>
    </nav>
  );
}
