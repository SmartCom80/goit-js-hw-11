import throttle from 'lodash.throttle';
import { imageSearchApi } from '../src/search-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

import imageCardTpl from '../src/templates/photo-cards.hbs';
// document.body.innerHTML = templateFunction();

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const formData = new FormData();

refs.form = addEventListener('submit', onFormSubmit);
refs.form = addEventListener('input', throttle(onFormInput, 2000));

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
  if (request === null) {
    Notify.warning(
      'Attention, empty request. The result will be random photos'
    );
  }

  console.log('event :>> ', formData.get('searchQuery'));
  imageSearchApi(request).then(renderMarkup).catch(onSearchError);
}
//  Функція виконання розмітки
function renderMarkup(searchResult) {
  console.log('searchResult.length :>> ', searchResult.total);
  const sizeArray = searchResult.total;

  if (sizeArray === 0) {
    throw new Error();
  }
  refs.gallery.innerHTML = imageCardTpl(searchResult);
  //   } else if (sizeArray > 1 && sizeArray < 10) {
  //     refs.countryInfo.innerHTML = '';
  //     refs.countryList.innerHTML = templCountryListMarkup(fetchCountry);
  //   } else if (sizeArray === 1) {
  //     refs.countryList.innerHTML = '';
  //     refs.countryInfo.innerHTML = templCountryInfoMarkup(fetchCountry);
  //   }
}

function onSearchError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
