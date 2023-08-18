import Pagination from 'tui-pagination'; /* ES6 */
import { Notify } from 'notiflix';
import 'tui-pagination/dist/tui-pagination.min.css';
import { UnsplashAPI } from "./UnsplashAPi";
import { createGalleryCard } from "./createGalleryCard";

const unsplashApiInstance = new UnsplashAPI();

const container = document.getElementById('tui-pagination-container');
const formSearch = document.querySelector('.js-search-form');
const options = {
    totalItems: 0,
    itemsPerPage: 12,
    visiblePages: 5,
    page: 1,
    template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
}

const pagination = new Pagination(container, options);

const page = pagination.getCurrentPage();// викликається, щоб отримати поточну сторінку, яка открита

const galleryRef = document.querySelector('.js-gallery');

formSearch.addEventListener('submit', onSubmitForm);

unsplashApiInstance.getPopularImage(page).then(({ results, total }) => {
    pagination.reset(total);
    const markup = createGalleryCard(results);
    galleryRef.innerHTML = markup;
});

pagination.on('afterMove', getPopular);

function onSubmitForm(event) {

    event.preventDefault();

    const { query } = event.target.elements;
    const searchQuery = query.value.trim();
    if (!searchQuery) {
        return Notify.failure('Enter something');
    }
    unsplashApiInstance.query = searchQuery;

    pagination.off('afterMove', getPopular);
    pagination.off('afterMove', getByQuery);

    unsplashApiInstance.getImagesByQuery(page).then(({ results, total }) => {
        pagination.reset(total);
        const markup = createGalleryCard(results);
        galleryRef.innerHTML = markup;
    });

    pagination.on('afterMove', getByQuery);
}

function getPopular(event) {
    const currentPage = event.page;
    unsplashApiInstance.getPopularImage(currentPage).then(({ results, total }) => {
    const markup = createGalleryCard(results);
        galleryRef.innerHTML = markup;
    });
}

function getByQuery(event) {
    const currentPage = event.page;
    unsplashApiInstance.getImagesByQuery(currentPage).then(({ results, total }) => {
    const markup = createGalleryCard(results);
        galleryRef.innerHTML = markup;
    });
}