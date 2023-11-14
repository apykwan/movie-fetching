import axios from 'axios';

import { debounce } from './utils';

type movieObj = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

type movieDetailObj = {
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

const fetchData = async (searchTerm: string):Promise<[movieObj] | []> => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '165c1035',
      s: searchTerm
    }
  });

  if (response.data.Error) return [];

  return response.data.Search;
};

const root = document.querySelector('.autocomplete') as HTMLElement;
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector('input') as HTMLInputElement;
const dropdown = document.querySelector('.dropdown') as HTMLElement;
const resultsWrapper = document.querySelector('.results') as HTMLElement;

const onInput = async (event: { target: HTMLInputElement}) => {
  const movies: [movieObj] | [] = await fetchData((event.target.value));

  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    const option: HTMLElement = document.createElement('a');
    const imgSrc: string | null = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;

    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      onMovieSelect(movie)

    });

    resultsWrapper.appendChild(option);
  }
};

input?.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', event => {
  if (!root.contains(<Node>(event.target))) {
    dropdown.classList.remove('is-active');
  } 
  // else if (document.querySelectorAll(".dropdown-item").length > 0) {
  //   dropdown.classList.add('is-active');
  // }
});

const onMovieSelect = async (movie: movieObj): Promise<void> => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '165c1035',
      i: movie.imdbID
    }
  });

  const summaryEl = document.querySelector('#summary') as HTMLElement;
  summaryEl.innerHTML = movieTemplate(response.data as movieDetailObj);
};

// AUTOCOMPLETE #2


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