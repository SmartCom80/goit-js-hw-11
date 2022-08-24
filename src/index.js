import throttle from 'lodash.throttle';
import { imageSearchApi } from '../src/search-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from '../src/get-refs.js';
import imageCardTpl from '../src/templates/photo-cards.hbs';
import { onClearStorage } from '../src/search-api.js';

const formData = new FormData();
const refs = getRefs();

window.addEventListener('pageshow', onClearStorage);
refs.form = addEventListener('submit', onFormSubmit);
refs.form = addEventListener('input', throttle(onFormInput, 1000));

// Функція отримує значення з поля input, виконує форматування значення та записує його в об'єкт типу FormData для подальшого використання в скрипті
function onFormInput(event) {
  const data = event.target.value.trim();
  formData.set('searchQuery', data);
  //   console.log('formData :>> ', formData.get('searchQuery'));
  return formData;
}

// Функція формує та викликає функцію запиту на сайт.
function onFormSubmit(event) {
  event.preventDefault();
  const request = formData.get('searchQuery');

  console.log('event :>> ', formData.get('searchQuery'));
  imageSearchApi(request).then(renderMarkup).catch(onSearchError);
}

//  Функція виконання розмітки
function renderMarkup(searchResult) {
  console.log('searchResult.length :>> ', searchResult.hits);

  refs.gallery.insertAdjacentHTML('beforeend', imageCardTpl(searchResult.hits));
}

function onSearchError() {
  Notify.failure(
    '1Sorry, there are no images matching your search query. Please try again.'
  );
}
