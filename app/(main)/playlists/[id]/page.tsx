import { PlaylistView } from "@/components/views/playlist-view";

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <PlaylistView id={id} />;
}
