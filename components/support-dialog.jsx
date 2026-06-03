"use client";

import { useState } from "react";

import { trackActivity } from "@/components/mixpanel-analytics";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SUPPORT_ZEC_ADDRESS } from "@/lib/site";

export function SupportDialog({ triggerClass = "nav", triggerLabel = "Support" }) {
  const [copyStatus, setCopyStatus] = useState("");

  function handleOpenChange(open) {
    setCopyStatus("");
    if (open) trackActivity("support_dialog_opened", { trigger_surface: triggerClass });
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(SUPPORT_ZEC_ADDRESS);
      setCopyStatus("ZEC address copied.");
      trackActivity("support_zec_copied", { trigger_surface: triggerClass, copy_result: "clipboard" });
    } catch (_error) {
      setCopyStatus(SUPPORT_ZEC_ADDRESS);
      trackActivity("support_zec_copied", { trigger_surface: triggerClass, copy_result: "fallback_text" });
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerClass}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogClose className="support-close" aria-label="Close support modal">
          x
        </DialogClose>
        <div className="kicker">Support development</div>
        <DialogTitle>Support development</DialogTitle>
        <img className="support-qr-image" src="/assets/zec-qr.png" alt="ZEC donation QR code" />
        <DialogDescription>Help keep new obituary comics, source work, and reader tooling moving. Send ZEC to this shielded address:</DialogDescription>
        <code className="support-address" id="supportZecAddress">
          {SUPPORT_ZEC_ADDRESS}
        </code>
        <div className="support-actions">
          <Button variant="miniPrimary" type="button" onClick={copyAddress}>
            Copy ZEC address
          </Button>
          <DialogClose asChild>
            <Button variant="miniGhost" type="button">
              Close
            </Button>
          </DialogClose>
        </div>
        <p className="support-copy-status" aria-live="polite">
          {copyStatus}
        </p>
      </DialogContent>
    </Dialog>
  );
}
