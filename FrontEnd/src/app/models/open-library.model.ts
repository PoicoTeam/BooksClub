export interface OpenLibraryDoc {
  key?: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  has_fulltext?: boolean;
  [key: string]: any;
}

export interface OpenLibrarySearchResult {
  numFound: number;
  docs: OpenLibraryDoc[];
}
