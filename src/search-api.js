//функція відправки і отримання відповідні на запрос до бекенду сайта
import getRefs from '../src/get-refs.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = getRefs();

const STORAGE_COUNTER_PAGE = 'search-query-page';
const STORAGE_REQUEST = 'request-value';
const STORAGE_COUNTER_ITEMS = 'search-count-items';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29435432-2b9256c27d33109c1c0a135be';

let savedCounterItems = 0;
let savedPage = 0;

const axios = require('axios');

const config = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

//Функція очищення значень минулого пошуку в localStorage при перезавантаженні вікна браузера
export function onClearStorage() {
  localStorage.removeItem(STORAGE_REQUEST);
  localStorage.removeItem(STORAGE_COUNTER_PAGE);
  localStorage.removeItem(STORAGE_COUNTER_ITEMS);
}

// Функція перевіряє чи виконується новий запит, чи потрібно надати наступні 40 результатів попереднього запиту
function searchQueryCheck(name) {
  const savedRequest = localStorage.getItem(STORAGE_REQUEST);
  savedPage = Number(localStorage.getItem(STORAGE_COUNTER_PAGE));
  savedCounterItems = Number(localStorage.getItem(STORAGE_COUNTER_ITEMS));

  if (savedPage === 'undefined') {
    config.page = 1;
  }

  // Перевірка запиту на унікальність
  if (savedRequest === name) {
    savedCounterItems += config.per_page;
    config.page = savedPage + 1;
    localStorage.setItem(STORAGE_COUNTER_PAGE, config.page);
    localStorage.setItem(STORAGE_COUNTER_ITEMS, savedCounterItems);
  } else if (savedRequest != name || savedRequest === 'undefined') {
    refs.gallery.innerHTML = '';
    clearVarRequest(name);
  }
  console.log('config.page :>> ', config.page);
  return config.page;
}

// Функція при новому запиті, обнулює змінні лічільників та задає нові значення змінних в localStorage
function clearVarRequest(name) {
  config.page = 1;
  localStorage.setItem(STORAGE_REQUEST, name);
  localStorage.setItem(STORAGE_COUNTER_PAGE, config.page);
  localStorage.setItem(STORAGE_COUNTER_ITEMS, config.per_page);
  return config.page;
}

export async function imageSearchApi(name) {
  try {
    searchQueryCheck(name);
    config.q = name;
    console.log('config.q :>> ', config.q);
    let res = await axios.get(BASE_URL, { params: config });

    if (config.page === 1) {
      Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    }

    if (savedCounterItems > res.data.totalHits) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }

    //  console.log('res.request :>> ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

// Функція виконує компонування url-строки для функції запиту
// function composeUrl(name) {
//   const { key, image_type, orientation, safesearch, page, per_page } = options;
//   return `${BASE_URL}/?key=${key}&q=${name}&$image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;
// }

// Функція виконує запит на сервер
// export function imageSearchApi(name) {
//   searchQueryCheck(name);

//   return fetch(composeUrl(name)).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
