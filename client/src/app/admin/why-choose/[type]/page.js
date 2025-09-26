"use client";

import AdvantageManager from "@/components/admin/advantage";
import FeatureManager from "@/components/admin/feature";
import { useParams } from "next/navigation";

export default function WhyChooseTypePage() {
  const { type } = useParams();

  if (type === "feature") return <FeatureManager />;
  if (type === "advantage") return <AdvantageManager />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Invalid section</h2>
      <p>Please check the URL. Supported: feature, advantage.</p>
    </div>
  );
}
