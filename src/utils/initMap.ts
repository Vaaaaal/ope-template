import { Loader } from '@googlemaps/js-api-loader';

export const initMap = () => {
  const loader = new Loader({
    apiKey: 'AIzaSyCZBPIsjGCYoWa1y9E4T60tiAIWer1IjUk',
    version: 'weekly',
  });

  loader.load().then(async () => {
    const src = 'https://www.vivantes.fr/KML-OP/contour_plombieres.kml';

    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.querySelector('.map_item_wrapper') as HTMLElement, {
      center: { lat: 47.97101541036518, lng: 6.438309914386212 }, // Changer les coordonnées pour celles voulues
      zoom: 13,
    });

    new google.maps.KmlLayer(src, {
      suppressInfoWindows: true,
      preserveViewport: false,
      map: map,
    });
  });
};
