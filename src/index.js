import { fetchCData } from './helpers';

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('.js-btn'),
  gallary: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onBtnClick);

function onBtnClick(event) {
  event.preventDefault();
  const { searchQuery } = event.currentTarget.elements;
  const data = searchQuery.value;

  fetchCData(data)
    .then(({ hits }) => creatMarcUPGallery(hits))
    .catch(error =>
      console.log(
        `Sorry, there are no images matching your search query. Please try again.`
      )
    );
}

// webformatWidth": 640,
//             "webformatHeight": 390,

function creatMarcUPGallery(arr) {
  return (refs.gallary.innerHTML = arr
    .map(
      el => `
  <div class="photo-card">
    <img src="${el.previewURL}" alt="" width="${el.previewWidth}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        Likes:<br>${el.likes}</br>
      </p>
      <p class="info-item">
        Views:<br>${el.views}</br>
      </p>
      <p class="info-item">
        Comments:<br>${el.comments}</br>
      </p>
      <p class="info-item">
        Downloads:<br>${el.downloads}</br>
      </p>
    </div>
  </div>`
    )
    .join());
}
