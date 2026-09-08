import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
//Custom imports CSS
import './beaurepaire.css';

// Custom imports JS
import { initAnimations } from '$utils/animations';
import { greetUser } from '$utils/greet';
import { initMap } from '$utils/initMap';
import { initPopups } from '$utils/popup';
import { initSwiper } from '$utils/swiper';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Vaaal';
  greetUser(name);

  initMap('https://bimby.pays-de-vitre.fr/KML-OP/beaurepaire.kml', {
    zoom: 13,
  });
  initSwiper();
  initAnimations('plombieres');
  initPopups();
});
