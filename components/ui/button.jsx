import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/components/ui/utils";

export const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      default: "btn",
      primary: "btn primary",
      mini: "mini-btn",
      miniPrimary: "mini-btn primary",
      miniGhost: "mini-btn ghost",
      reader: "reader-btn",
      readerPrimary: "reader-btn primary",
      nav: "nav-support",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Button = React.forwardRef(function Button({ asChild = false, className, variant, ...props }, ref) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />;
});
