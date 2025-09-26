"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WhyChooseRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/why-choose/feature"); // Default to feature
  }, [router]);

  return null;
}
