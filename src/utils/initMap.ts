import { Loader } from '@googlemaps/js-api-loader';

export const initMap = () => {
  const loader = new Loader({
    apiKey: 'AIzaSyCZBPIsjGCYoWa1y9E4T60tiAIWer1IjUk',
    version: 'weekly',
  });

  loader.load().then(async () => {
    // const src = url_de_la_source_du_fichier_kml;

    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.querySelector('.map_item_wrapper') as HTMLElement, {
      center: { lat: 47.97101541036518, lng: 6.438309914386212 },
      zoom: 13,
    });

    // new google.maps.KmlLayer(src, {
    //   suppressInfoWindows: true,
    //   preserveViewport: false,
    //   map: map,
    // });
  });
};
