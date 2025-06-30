import Image from "next/image";
import Link from "next/link";
import { Section, Container, Prose } from "@/components/craft";
import { getSongByTitle } from "@/lib/music";

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const song = await getSongByTitle(title);

  if (!song) {
    return (
      <Section>
        <Container>
          <Prose>
            <h2>Lagu tidak ditemukan</h2>
            <p>Data lagu gagal diambil.</p>
          </Prose>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="space-y-6">
        <Prose>
          <h2>{song.title}</h2>
          <p>
            Album: {" "}
            <Link href={`/album/${song.album.id}`}>{song.album.name}</Link>
          </p>
          <p>
            Artist: {" "}
            {song.artists.map((artist, idx) => (
              <span key={artist.id}>
                {idx > 0 && ", "}
                <Link href={`/artist/${artist.id}`}>{artist.name}</Link>
              </span>
            ))}
          </p>
          <p>Durasi: {song.duration}</p>
          <p>Ditonton: {song.views}</p>
        </Prose>

        <div className="w-full h-96 relative overflow-hidden rounded-lg">
          <Image
            src={song.thumbnails}
            alt={song.title}
            fill
            className="object-cover"
          />
        </div>

        <Prose>
          <h3>Lirik</h3>
          <pre className="whitespace-pre-wrap font-sans">{song.lyrics.lyrics}</pre>
        </Prose>
      </Container>
    </Section>
  );
}
