"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      duration={3000}
      expand={true}
      richColors
    />
  );
}
