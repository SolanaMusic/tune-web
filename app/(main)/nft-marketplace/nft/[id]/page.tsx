import { NFTDetailView } from "@/components/views/nft-detail-view";

export default async function NFTDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <NFTDetailView id={id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
