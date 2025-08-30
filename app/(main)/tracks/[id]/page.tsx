import { TrackView } from "@/components/views/track-view";

export default async function TrackPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <TrackView id={id} />;
}
