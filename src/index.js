import debounce from 'lodash.debounce';
import imageApi from '../src/search-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import getRefs from '../src/get-refs.js';
import imageCardTpl from '../src/templates/photo-cards.hbs';
import debounce from 'lodash.debounce';

const searchImage = new imageApi();
const formData = new FormData();
const refs = getRefs();
let gallery = {};

refs.form = addEventListener('submit', onFormSubmit);
refs.form = addEventListener('input', onFormInput);
refs.scroll = addEventListener('scroll', debounce(onInfiniteScroll, 300));

// Функція отримує значення з поля input, виконує форматування значення та записує його в об'єкт типу FormData для подальшого використання в скрипті
function onFormInput(event) {
  const data = event.target.value.trim();
  formData.set('searchQuery', data);
  //   console.log('formData :>> ', formData.get('searchQuery'));
  return formData;
}

// Функція формує змінні для виклику функції запиту на сайт. Перевіряє коректність значення запиту
function onFormSubmit(event) {
  event.preventDefault();
  let request = formData.get('searchQuery');

  if (request === null) {
    request = '';
    Notify.info(`Request is empty. Random search results will be shown`);
  }

  if (searchImage.query !== request) {
    onClearGallery();
    searchImage.query = request;
    searchImage.resetPage();
  }
  searchImage.loadedHits = 0;
  onSearchData();
  onScrollToTop();
}

// Асинхронна функція запиту та рендеру розмітки галереї.
async function onSearchData() {
  try {
    await searchImage.search().then(onRenderGalleryMarkup);
    if (searchImage.page === 1) {
      Notify.success(`Hooray! We found ${searchImage.totalHits} images.`);
    }
  } catch (error) {
    console.log(error);
  }
}
//  Функція виконання розмітки
function onRenderGalleryMarkup(searchResult) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTpl(searchResult.hits));
  gallery = new SimpleLightbox('.gallery a');
}

// Функція "безкінечного скроллу" та підвантаження наступної сторінки для поточного значення запиту
function onInfiniteScroll() {
  const documentClientRect = document.documentElement.getBoundingClientRect();

  if (documentClientRect.bottom < document.documentElement.clientHeight + 200) {
    if (searchImage.loadedHits < searchImage.totalHits) {
      searchImage.incrementPage();
      onSearchData();
      gallery.refresh();
      return;
    } else if (searchImage.totalHits > 0) {
      console.log('object :>> ', 'error');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      return;
    }
  }
  return;
}

// Функція очищення поточної розмітки галереї
function onClearGallery() {
  refs.gallery.innerHTML = '';
}

// Функція повертання до початку сторінки після завантаження результатів нового пошук
function onScrollToTop() {
  const { top: cardTop } = refs.gallery.getBoundingClientRect();
  window.scrollBy({
    top: cardTop - 150,
    behavior: 'smooth',
  });
}

// Функція попередження про помилку в разі отримання пустого массиву.
export function onSearchError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
