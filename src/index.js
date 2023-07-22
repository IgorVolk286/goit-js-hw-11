import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '38330111-6d0efda7f4a8d995231e14698';

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('.js-btn'),
  gallary: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.btnLoadMore.classList.add('js-hidden');

refs.form.addEventListener('submit', onBtnSearchClick);
refs.btnLoadMore.addEventListener('click', onbtnLoadMoreClick);

let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

let dataqery = ' ';
let countPage = 1;
let totalHitsCount = 40;

function onBtnSearchClick(event) {
  refs.gallary.innerHTML = '';
  event.preventDefault();
  dataqery = event.currentTarget.elements.searchQuery.value.trim();

  fetchCData(dataqery)
    .then(({ totalHits, hits }) => {
      if (!hits.length) {
        Notify.failure('Qui timide rogat docet negare');
        return;
      } else {
        Notify.success(`"Hooray! We found ${totalHits} images.`);
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

async function fetchCData(dataqery, page = 1) {
  const options = {
    params: {
      key: KEY,
      q: `${dataqery}`,
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${countPage}`,
      per_page: '40',
    },
  };
  const response = await axios.get(`https://pixabay.com/api/`, options);
  const data = await response.data;
  return data;
}

function creatMarcUPGallery(arr) {
  refs.btnLoadMore.classList.remove('js-hidden');

  let markUp = arr
    .map(
      ({
        largeImageURL,
        previewURL,
        tags,
        likes,
        comments,
        downloads,
        views,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}"><img class= "img"src="${previewURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        Likes:<br>${likes}</br>
      </p>
      <p class="info-item">
        Views:<br>${views}</br></p>
      <p class="info-item">
        Comments:<br>${comments}</br></p>
      <p class="info-item">
        Downloads:<br>${downloads}</br></p>
    </div>
  </div>`;
      }
    )
    .join(' ');

  refs.gallary.insertAdjacentHTML('beforeend', markUp);
  gallery.refresh();
}

function onbtnLoadMoreClick(event) {
  totalHitsCount += 40;
  countPage += 1;
  console.log(totalHitsCount);

  fetchCData(dataqery, countPage)
    .then(({ totalHits, hits }) => {
      creatMarcUPGallery(hits);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (totalHitsCount > totalHits) {
        Notify.info(
          ' "We are sorry, but you have reached the end of search results."'
        );
        refs.btnLoadMore.classList.add('js-hidden');
      }
    })
    .catch(error =>
      Report.failure(
        'ERROR',
        '"Sorry, there are no images matching your search query. Please try again" <br/><br/>',
        'Try againe'
      )
    );
}
