import { ArtistView } from "@/components/views/artist-view";

export default function ArtistPage({ params }: { params: { id: string } }) {
  return <ArtistView id={params.id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
