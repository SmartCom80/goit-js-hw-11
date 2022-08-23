//функція відправки і отримання відповідні на запрос до бекенду сайта
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29435432-2b9256c27d33109c1c0a135be';
const options = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export function imageSearchApi(name) {
  console.log('name :>> ', name);
  return fetch(
    `${BASE_URL}/?key=${options.key}&q=${name}&$image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
