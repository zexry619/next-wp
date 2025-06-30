export interface SongLyrics {
  hasTimestamps: boolean;
  lyrics: string;
  source: string | null;
}

export interface SongData {
  album: {
    id: string;
    name: string;
  };
  artists: {
    id: string;
    name: string;
  }[];
  duration: string;
  found: boolean;
  lyrics: SongLyrics;
  query: string;
  songArtistIds: string[];
  thumbnails: string;
  title: string;
  videoId: string;
  views: string;
}

const MUSIC_API_URL = process.env.MUSIC_API_URL;

if (!MUSIC_API_URL) {
  throw new Error("MUSIC_API_URL environment variable is not defined");
}

export async function getSongByTitle(title: string): Promise<SongData | null> {
  try {
    const response = await fetch(`${MUSIC_API_URL}/${encodeURIComponent(title)}`);
    if (!response.ok) {
      console.warn(`Music API request failed: ${response.statusText}`);
      return null;
    }
    return (await response.json()) as SongData;
  } catch (error) {
    console.warn("Failed to fetch song data", error);
    return null;
  }
}
