import axios from 'axios';

import createAutoComplete from './autocomplete';
import { movieObj, movieDetailObj, rootObj, autoCompleteObj } from './types';

const autoCompleteConfig: autoCompleteObj = {
  rederOption(movie: movieObj): string {
    const imgSrc: string | null = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie: movieObj): string  {
    return movie.Title
  },
  async fetchData (searchTerm: string): Promise<[movieObj] | []>  {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '165c1035',
        s: searchTerm
      }
    });

    if (response.data.Error) return [];
    return response.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete') as HTMLElement,
  onOptionSelect(movie: movieObj): void {
    document.querySelector('.tutorial')?.classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary') as HTMLElement, 'left');
  }
} as rootObj);

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete') as HTMLElement,
  onOptionSelect(movie: movieObj): void {
    document.querySelector('.tutorial')?.classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary') as HTMLElement, 'right');
  },
} as rootObj);

let leftMovie: movieObj;
let rightMovie: movieObj;

export const onMovieSelect = async (movie: movieObj, summaryEl: HTMLElement, side: string): Promise<void> => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '165c1035',
      i: movie.imdbID
    }
  });

  summaryEl.innerHTML = movieTemplate(response.data as movieDetailObj);

  side === 'left' 
    ? leftMovie = response.data 
    : rightMovie = response.data;

  if (leftMovie && rightMovie) runComparison();
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll<HTMLElement>('#left-summary .notification');
  const rightSideStats = document.querySelectorAll<HTMLElement>('#right-summary .notification');

  leftSideStats.forEach((leftStat, index: number) => {
    const rightStat = rightSideStats[index];

    const leftSideValue: number = parseFloat(leftStat.dataset.value as string);
    const rightSideValue:number = parseFloat(rightStat.dataset.value as string);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail: movieDetailObj): string => {
  const dollar: string = movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
  const metascore:string = movieDetail.Metascore;
  const imdbRating:string = movieDetail.imdbRating;
  const imdbVotes: string = movieDetail.imdbVotes.replace(/,/g, '');
  const awards: number = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) return prev;
    return prev + value;
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollar}" class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};