import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';

const KEY = '38330111-6d0efda7f4a8d995231e14698';

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('.js-btn'),
  gallary: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
refs.btnLoadMore.hidden = true;

refs.form.addEventListener('submit', onBtnClick);

let dataqery = ' ';
let countPage = 1;

function onBtnClick(event) {
  event.preventDefault();

  dataqery = event.currentTarget.elements.searchQuery.value;

  fetchCData(dataqery)
    .then(({ hits }) => {
      console.log(hits);
      if (!hits.length) {
        Report.failure(
          'Unsuccessfully',
          '"Sorry, there are no images matching your search query. Please try again" <br/><br/' >
            'Try again'
        );
      }
      creatMarcUPGallery(hits);
    })
    .catch(error =>
      Report.failure(
        'ERROR',
        '"Sorry, there are no images matching your search query. Please try again" <br/><br/>',
        'Try againe'
      )
    );
}

function fetchCData(dataqery, page = 1) {
  return axios
    .get(`https://pixabay.com/api/`, {
      params: {
        key: KEY,
        q: `${dataqery}`,
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${countPage}`,
        per_page: '40',
      },
    })
    .then(resp => {
      if (!resp.status === 200) {
        throw new Error(
          Report.failure(
            'ERROR',
            '"Sorry, there are no images matching your search query. Please try again" <br/><br/>',
            'Try againe'
          )
        );
      }
      console.log(resp.data);
      return resp.data;
    });

  // const API_KEY = 'key=38330111-6d0efda7f4a8d995231e14698&';
  // const API_BASE_URL = `https://pixabay.com/api/`;
  // const endPoinds = `?${API_KEY}&q=${data}}&orientation=horizontal&safesearch=true&page=${countPage}&per_page=40`;

  // return fetch(`${API_BASE_URL}${endPoinds}`).then(resp => {
  //   if (!resp.ok) {
  //     throw new Error(
  //       Report.failure(
  //         'ERROR',
  //         '"Sorry, there are no images matching your search query. Please try again" <br/><br/>',
  //         'Try againe'
  //       )
  //     );
  //   }

  //   return resp.json();
  // });
}
let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
function creatMarcUPGallery(arr) {
  refs.btnLoadMore.hidden = false;
  let markUp = arr
    .map(el => {
      return `<div class="photo-card">
    <a href="${el.largeImageURL}"><img class= "img"src="${el.previewURL}" alt="${el.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item"> 
        Likes:<br>${el.likes}</br>
      </p>
      <p class="info-item">
        Views:<br>${el.views}</br></p>
      <p class="info-item">
        Comments:<br>${el.comments}</br></p>
      <p class="info-item">
        Downloads:<br>${el.downloads}</br></p>
    </div>
  </div>`;
    })
    .join(' ');

  refs.gallary.insertAdjacentHTML('beforeend', markUp);
  gallery.refresh();
}
refs.btnLoadMore.addEventListener('click', onbtnLoadMoreClick);

function onbtnLoadMoreClick(event) {
  console.log(event);
  countPage += 1;
  fetchCData(dataqery, countPage)
    .then(({ hits }) => {
      creatMarcUPGallery(hits);
    })

    .catch(error =>
      Report.failure(
        'ERROR',
        '"Sorry, there are no images matching your search query. Please try again" <br/><br/>',
        'Try againe'
      )
    );
}
