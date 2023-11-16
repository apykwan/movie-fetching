import axios from 'axios';

import createAutoComplete from './autocomplete';
import { movieObj, movieDetailObj } from './types';

export const fetchData = async (searchTerm: string):Promise<[movieObj] | []> => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '165c1035',
      s: searchTerm
    }
  });

  if (response.data.Error) return [];

  return response.data.Search;
};

createAutoComplete({
  root: document.querySelector('.autocomplete') as HTMLElement,
  rederOption(movie: movieObj): string {
    const imgSrc: string | null = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  onOptionSelect(movie: movieObj): void {
    onMovieSelect(movie)
  }
});

export const onMovieSelect = async (movie: movieObj): Promise<void> => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '165c1035',
      i: movie.imdbID
    }
  });

  const summaryEl = document.querySelector('#summary') as HTMLElement;
  summaryEl.innerHTML = movieTemplate(response.data as movieDetailObj);
};

const movieTemplate = (movieDetail: movieDetailObj): string => {
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
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};