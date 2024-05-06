import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
//Custom imports CSS
import './style.css';

// Custom imports JS
import { initAnimations } from '$utils/animations';
import { greetUser } from '$utils/greet';
import { initMap } from '$utils/initMap';
import { initPopup } from '$utils/popup';
import { initSwiper } from '$utils/swiper';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Vaaal';
  greetUser(name);

  initMap();
  initSwiper();
  initAnimations();
  initPopup();
});
