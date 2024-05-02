import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
//Custom imports CSS
import './style.css';

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

// Custom imports JS
import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Vaaal';
  greetUser(name);

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
});
