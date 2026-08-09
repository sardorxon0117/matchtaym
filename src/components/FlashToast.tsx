"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "./Toast";

/** Drop on a page a redirecting action lands on: shows a toast once if `param` is present, then strips it from the URL. */
export default function FlashToast({ param, message }: { param: string; message: string }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(param);

  useEffect(() => {
    if (!value) return;
    toast.show(message);
    const next = new URLSearchParams(searchParams);
    next.delete(param);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return null;
}
