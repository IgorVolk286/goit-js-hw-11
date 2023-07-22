// import axios from 'axios';

// export function fetchCData() {
//   const API_KEY = 'key=38330111-6d0efda7f4a8d995231e14698&';
//   const API_BASE_URL = `https://pixabay.com/api/`;
//   const endPoinds = `?${API_KEY}&q=${data}}&orientation=horizontal&safesearch=true`;

//   return fetch(`${API_BASE_URL}${endPoinds}`).then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }
//     return resp.json();
//   });
// }

// export function fetchCData(data) {
//   const API_KEY = 'key=38330111-6d0efda7f4a8d995231e14698&';
//   const API_BASE_URL = `https://pixabay.com/api/`;
//   const endPoinds = `?${API_KEY}&q=${data}}&orientation=horizontal&safesearch=true`;

//   return fetch(`${API_BASE_URL}${endPoinds}`).then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }
//     return resp.json();
//   });
// }

export function creatMarcUPGallery(arr) {
  return (refs.gallary.innerHTML = arr
    .map(
      el => `
  <div class="photo-card">
    <img src="${el.previewURL}" alt="" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes:${el.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${el.view}</b>
      </p>
      <p class="info-item">
        <b>Comments:${el.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads:${el.downloads}</b>
      </p>
    </div>
  </div>;`
    )
    .join());
}
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true&';
const API_KEY = 'key=38382365-2ce894cbac0e5297650bdbdb4';
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.loadMoreBtn.classList.add('js-hide');
refs.form.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onImgClick);
refs.loadMoreBtn.addEventListener('click', () => getImg(searchQuery));

let counter = 0;
let totalPageCounter = 0;
let searchQuery = '';
let showFindAndScroll = true;

function onSearch(e) {
  e.preventDefault();
  showFindAndScroll = true;
  counter = 0;
  totalPageCounter = 0;
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('js-hide');
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  getImg(searchQuery);
}

async function getImg(query) {
  counter += 1;
  totalPageCounter += 40;
  try {
    const data = await axios.get(
      `${API_URL}${API_KEY}&q=${query}&per_page=40&page=${counter}`
    );
    if (data.status !== 200) {
      throw new Error(data.status);
    }
    if (data.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    galleryMarkup(data);
    if (showFindAndScroll) {
      Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
      showFindAndScroll = false;
    }

    if (totalPageCounter > data.data.totalHits) {
      refs.loadMoreBtn.classList.add('js-hide');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
}

const option = {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};
let imgGallery = new SimpleLightbox('.gallery .photo-card .img-link', option);

function galleryMarkup(imgData) {
  const markup = imgData.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = {}) => {
        return `<div class="photo-card">
        <a class="img-link" href="${largeImageURL}">
        <img width="320" class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
        </div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  imgGallery.refresh();
  refs.loadMoreBtn.classList.remove('js-hide');

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  if (!showFindAndScroll) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function onImgClick(e) {
  e.preventDefault();

  if (e.target.classList.contains('gallery-image')) {
    imgGallery.on('show .simplelightbox');
  }
}
