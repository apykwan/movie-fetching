export type movieObj = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export type movieDetailObj = {
  Title: string;
  Genre: string;
  Plot: string;
  Poster: string;
  Awards: string;
  BoxOffice: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
}

export type rootObj = {
  root: HTMLElement;
  rederOption: <T extends movieObj>(obj: T) => string;
  onOptionSelect: <T extends movieObj>(obj: T) => void;
  inputValue: <T extends movieObj>(obj: T) => string;
}