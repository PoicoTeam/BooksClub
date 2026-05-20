export type BookCategory =
  | 'Narrativa'
  | 'Saggistica'
  | 'Fantasy'
  | 'Tecnologia'
  | 'Classici'
  | 'Bambini';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number; // EUR
  description: string;
  rating: number; // 0..5
  coverUrl: string; // in assenza di immagini reali: data URL placeholder
  pages?: number;
  language?: string;
}

const coverSvg = (bg: string, fg: string, label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="320" viewBox="0 0 240 320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="240" height="320" rx="16" fill="url(#g)"/>
  <rect x="14" y="14" width="212" height="292" rx="12" fill="${bg}" fill-opacity="0.18" stroke="${fg}" stroke-opacity="0.35"/>
  <text x="120" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="${fg}" fill-opacity="0.95" font-weight="700">${label}</text>
  <text x="120" y="170" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="${fg}" fill-opacity="0.75">Book Club</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Il Giardino delle Ombre',
    author: 'L. Moretti',
    category: 'Narrativa',
    price: 14.9,
    description:
      'Un romanzo avvincente tra mistero e redenzione. Un segreto custodito nel tempo ritorna a chiedere verità.',
    rating: 4.6,
    coverUrl: coverSvg('#7C3AED', '#ffffff', 'Ombre'),
    pages: 352,
    language: 'Italiano',
  },
  {
    id: 'b2',
    title: 'Manuale Pratico di Produttività',
    author: 'A. Rossi',
    category: 'Tecnologia',
    price: 19.5,
    description:
      'Tecniche concrete per organizzare tempo, obiettivi e attenzione. Dalla pianificazione quotidiana al focus profondo.',
    rating: 4.3,
    coverUrl: coverSvg('#06B6D4', '#ffffff', 'Focus'),
    pages: 284,
    language: 'Italiano',
  },
  {
    id: 'b3',
    title: 'Cronache del Regno Incantato',
    author: 'S. De Luca',
    category: 'Fantasy',
    price: 16.2,
    description:
      'Avventure epiche, magia e alleanze improbabili. Un viaggio che cambia chi lo intraprende.',
    rating: 4.8,
    coverUrl: coverSvg('#F59E0B', '#1F2937', 'Regno'),
    pages: 418,
    language: 'Italiano',
  },
  {
    id: 'b4',
    title: 'Le Idee che Cambiano il Mondo',
    author: 'M. Bianchi',
    category: 'Saggistica',
    price: 12.9,
    description:
      'Un saggio accessibile che esplora come le idee trasformano società, economia e scelte individuali.',
    rating: 4.1,
    coverUrl: coverSvg('#22C55E', '#ffffff', 'Idee'),
    pages: 256,
    language: 'Italiano',
  },
  {
    id: 'b5',
    title: 'Classici: Racconti Senza Tempo',
    author: 'R. Conti',
    category: 'Classici',
    price: 9.9,
    description:
      'Una selezione di racconti fondamentali: letture brevi, profonde, capaci di restare nella memoria.',
    rating: 4.4,
    coverUrl: coverSvg('#EF4444', '#ffffff', 'Classici'),
    pages: 312,
    language: 'Italiano',
  },
  {
    id: 'b6',
    title: 'Stelle e Magie per Piccoli Esploratori',
    author: 'C. Gallo',
    category: 'Bambini',
    price: 11.4,
    description:
      'Una storia luminosa e delicata: fantasia, amicizia e piccoli grandi insegnamenti per i più giovani.',
    rating: 4.7,
    coverUrl: coverSvg('#38BDF8', '#0B1220', 'Bimbi'),
    pages: 96,
    language: 'Italiano',
  },
];

