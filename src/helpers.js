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
