import { ArtistNFTCollectionsView } from "@/components/views/artist-nft-collections-view";

export default async function AdminNFTCollectionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <ArtistNFTCollectionsView id={id} />;
}
