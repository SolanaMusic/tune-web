import { NFTDetailView } from "@/components/views/nft-detail-view";

export default async function NFTDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <NFTDetailView id={id} />;
}
