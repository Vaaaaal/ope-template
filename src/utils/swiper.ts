import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export const initSwiper = () => {
  new Swiper('.swiper.is-testimonials', {
    slidesPerView: 1,
    loop: true,

    modules: [Navigation],

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
