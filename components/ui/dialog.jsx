"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/components/ui/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogOverlay({ className, ...props }) {
  return <DialogPrimitive.Overlay className={cn("support-modal-overlay", className)} {...props} />;
}

export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content className={cn("support-dialog", className)} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
