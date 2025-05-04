import { PlaylistView } from "@/components/views/playlist-view"

export default function PlaylistPage({ params }: { params: { id: string } }) {
  return <PlaylistView id={params.id} />
}
