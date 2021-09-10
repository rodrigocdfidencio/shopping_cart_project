const showItem = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');
const productPrice = document.getElementById('etiqueta');
// const searchButton = document.getElementById('search-button');
// let value = document.getElementById('search').value
/* const query = document.getElementById('search').innerText;
const count = document.querySelector('search');
console.log(query); */

function totalPrices() {
  const listItems = document.querySelectorAll('.cart__item');
  let sumOfPrices = 0;

  listItems.forEach((item) => {
    const valor = item.innerText;
    const posicaoInicial = valor.indexOf('$') + 1;
    const posicaoFinal = valor.length;
    const stringTratada = valor.substr(posicaoInicial, posicaoFinal);
    const numero = parseFloat(stringTratada);
    sumOfPrices += numero;
  });
  productPrice.innerText = sumOfPrices;
}

function salvaStorage() {
  localStorage.setItem('salvaCarrinho', cartList.innerHTML);
  localStorage.setItem('preco', productPrice.innerHTML);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrices();
  salvaStorage();
}

function showList() {
  cartList.innerHTML = localStorage.getItem('salvaCarrinho');
  productPrice.innerHTML = localStorage.getItem('preco');
  const itensDoCarrinho = document.querySelectorAll('.cart__items');
  itensDoCarrinho.forEach((item) =>
    item.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addCart(event) {
  const elementoPai = event.target.parentNode;
  const nomeProduto = elementoPai.firstChild.innerText;
  const linkApi = 'https://api.mercadolibre.com/items/';
  try {
    const retorno = await fetch(`${linkApi}${nomeProduto}`);
    const result = await retorno.json();
    cartList
      .appendChild(createCartItemElement(result))
      .addEventListener('click', cartItemClickListener);
    totalPrices();
    salvaStorage();
  } catch (error) {
    return error;
  }
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCart);
  return section;
}

const showProduct = (arrayResult) => {
  arrayResult.forEach((item) => {
    showItem.appendChild(createProductItemElement(item));
  });
};

function loading() {
  const container = document.querySelector('.container');
  const loadingSpan = document.createElement('span');
  loadingSpan.className = 'loading';
  loadingSpan.innerHTML = 'Loading..';
  container.appendChild(loadingSpan);
}
function removeLoading() {
  const loadingSpan = document.querySelector('.loading');
  loadingSpan.parentNode.removeChild(loadingSpan);
}

const clearList = () => {
  showItem.innerHTML = '';
};

async function createStandardList(value) {
  console.log(value);
  clearList();
    loading();
  try {
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${value}`);
    const { results } = await api.json();
    showProduct(results);
    removeLoading();
  } catch (error) {
    return error;
  }
  }

/* async function searchList(value) {
  console.log(value);
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${value}`);
    const { results } = await api.json();
    showProduct(results);
  }  */

function deleteAllCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const elementoFilho = document.querySelectorAll('li');
    elementoFilho.forEach((item) => item.parentNode.removeChild(item));
    totalPrices();
    localStorage.clear();
  });
}

/* const createList = (value) => {
  if (value === '') {
    createStandardList();
  } else {
    searchList(value);
  } 
}; */

deleteAllCart();

/* function counter() {
  const text = document.querySelector('search').value;
  console.log(text)
} */

/* searchButton.addEventListener('click', createStandardList);
 */
/* const busca = () => {
  let value = document.getElementById('search').value
  createStandardList(value);
} */

createStandardList('');

window.onload = function onload() {
  showList();
};
