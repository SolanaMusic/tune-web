import { AlbumView } from "@/components/views/album-view";

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <AlbumView id={id} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
