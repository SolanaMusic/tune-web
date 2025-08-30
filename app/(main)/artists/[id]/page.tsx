import { ArtistView } from "@/components/views/artist-view";

export default async function ArtistPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <ArtistView id={id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
