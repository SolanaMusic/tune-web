import { CollectionDetailView } from "@/components/views/collection-details-view";

export default async function NFTDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <CollectionDetailView id={id} />;
}
