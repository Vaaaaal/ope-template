import { Loader } from '@googlemaps/js-api-loader';

export const initMap = (kml: string, data: { zoom: number }) => {
  const loader = new Loader({
    apiKey: 'AIzaSyCZBPIsjGCYoWa1y9E4T60tiAIWer1IjUk',
    version: 'weekly',
  });

  loader.load().then(async () => {
    const src = kml;

    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.querySelector('.map_item_wrapper') as HTMLElement, {
      zoom: data.zoom,
    });

    new google.maps.KmlLayer(src, {
      suppressInfoWindows: true,
      preserveViewport: false,
      map: map,
    });
  });
};
