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

export interface autoCompleteObj {
  rederOption: <T extends movieObj>(obj: T) => string;
  inputValue: <T extends movieObj>(obj: T) => string;
  fetchData: (arg: string) => Promise<[movieObj] | []>;  
}

export interface rootObj extends autoCompleteObj {
  root: HTMLElement;
  onOptionSelect: <T extends movieObj>(obj: T) => void;
}