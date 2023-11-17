import { debounce } from './utils';
import { movieObj, rootObj } from './types';

const createAutoComplete = ({ 
    root, 
    rederOption, 
    onOptionSelect, 
    inputValue,
    fetchData 
}: rootObj): void => {
  root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  const input = root.querySelector('input') as HTMLInputElement;
  const dropdown = root.querySelector('.dropdown') as HTMLElement;
  const resultsWrapper = root.querySelector('.results') as HTMLElement;

  const onInput = async (event: { target: HTMLInputElement}) => {
    const items: [movieObj] | [] = await fetchData((event.target.value));

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let item of items) {
      const option = document.createElement('a') as HTMLElement;
      
      option.classList.add('dropdown-item');
      option.innerHTML = rederOption(item);

      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
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
};

export default createAutoComplete;