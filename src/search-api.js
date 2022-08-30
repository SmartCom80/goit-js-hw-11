//функція відправки і отримання відповіді на запрос до бекенду сайта
import { onSearchError } from './index';
const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29435432-2b9256c27d33109c1c0a135be';

export default class imageApi {
  // Експортуємо клас для використання з інших файлів
  constructor() {
    // Конструктор класса
    this.searchQuery = ''; // Поисковый запрос
    this.perPage = 40;
    this.page = 1;
    this.totalHits = 0;
    this.hitsPerPage = 0;
  }
  async search() {
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    };

    console.log('params.q :>> ', params.q);
    let response = await axios(BASE_URL, { params });

    this.totalHits = response.data.totalHits;

    this.hitsPerPage += response.data.hits.length;

    if (!response.data.totalHits) {
      // Викликаємо помилку, якщо отримуємо пустий массив та виводимо попередження
      onSearchError();
      throw new Error('Error');
    }
    return response.data;
  }

  incrementPage() {
    // Інкрементуємо номер завантаженої сторінки
    this.page += 1;
  }

  resetPage() {
    // Скидаємо номер сторінки на значення по замовчуванню
    this.page = 1;
  }

  get query() {
    // Геттер, отримуємо поточне значення запиту
    return this.searchQuery;
  }

  set query(newQuery) {
    // Сеттер, встановлюємо нове значення запиту з поля інпут.
    this.searchQuery = newQuery;
  }
}

// Функція виконує компонування url-строки для функції запиту
// function composeUrl(name) {
//   const { key, image_type, orientation, safesearch, page, per_page } = options;
//   return `${BASE_URL}/?key=${key}&q=${name}&$image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;
// }
