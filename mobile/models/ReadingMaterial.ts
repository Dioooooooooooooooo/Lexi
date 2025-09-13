export interface ReadingMaterial {
  id: string;
  type?: string;
  title: string;
  author?: string;
  description: string;
  cover: string;
  content: string;
  genres: string[];
  difficulty: number;
}
