"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubstackForm } from "@/components/substack-subscribe";

export function ComicSubscribeDialog({ comic }) {
  const headingId = `reader-subscribe-${comic.slug}`;

  return (
    <section className="reader-subscribe-cta" aria-labelledby={headingId}>
      <div className="reader-subscribe-copy">
        <div className="kicker">Newsletter</div>
        <h2 id={headingId}>Finished this comic?</h2>
        <p>Get the next obituary comic, source notes, and quiet dispatches from Final Notes by email.</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="miniPrimary" type="button">
            Subscribe
          </Button>
        </DialogTrigger>
        <DialogContent className="newsletter-dialog">
          <DialogClose className="support-close" aria-label="Close newsletter modal">
            x
          </DialogClose>
          <div className="kicker">Final Notes</div>
          <DialogTitle>Borrowed Time Dispatch</DialogTitle>
          <DialogDescription>Subscribe for the next obituary comic, short source notes, and one useful reflection for the week.</DialogDescription>
          <SubstackForm />
        </DialogContent>
      </Dialog>
    </section>
  );
}
