import { CollectionDetailView } from "@/components/views/collection-details-view";

export default async function NFTDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <CollectionDetailView id={id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
