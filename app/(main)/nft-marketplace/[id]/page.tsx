"use client";

import { useEffect, useState } from "react";
import { NFTDetailView } from "@/components/views/nft-detail-view";
import { Loader2 } from "lucide-react";

export default function NFTDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      if (unwrappedParams?.id) {
        setId(unwrappedParams.id);
      }
    };

    fetchParams();
  }, [params]);

  if (!id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return <NFTDetailView id={id} />;
}
