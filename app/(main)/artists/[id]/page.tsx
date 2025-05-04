import { ArtistView } from "@/components/views/artist-view"

export default function ArtistPage({ params }: { params: { id: string } }) {
  return <ArtistView id={params.id} />
}
