import Link from "next/link";

import { SupportDialog } from "@/components/support-dialog";

export function SiteNav() {
  return (
    <nav className="site-nav wrap" aria-label="Primary">
      <Link className="site-brand" href="/">
        Memento Mori
      </Link>
      <div className="site-nav-links">
        <Link href="/#archive">Archive</Link>
        <Link href="/obituary-stories/">Stories</Link>
        <Link href="/about/">Method</Link>
        <Link href="/press/">Press</Link>
        <Link href="/newsletter/">Newsletter</Link>
        <SupportDialog />
      </div>
    </nav>
  );
}
