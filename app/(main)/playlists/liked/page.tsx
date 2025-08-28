import { PlaylistView } from "@/components/views/playlist-view";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  return <PlaylistView id={params.id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
