import Homefinder from './containers/Homefinder';
import Collections from './containers/Collections';
import Amenities from './containers/Amenities';
import NeighborhoodMap from './containers/NeighborhoodMap';
import AreaMap from './containers/AreaMap';

import Logo from './img/lantana-at-beach-logo.svg';

const routes = [
  { path: '/',
    exact: true,
    image: Logo,
    title: 'Home',
    component: Homefinder
  },
  { path: '/homefinder',
    exact: true,
    title: 'HomeFinder',
    component: Homefinder
  },
  { path: '/collections',
    title: 'The Collections',
    component: Collections
  },
  { path: '/neighborhood-maps',
    title: 'Neighborhood Map',
    component: NeighborhoodMap
  },
  { path: '/amenities',
    title: 'Amenities',
    component: Amenities
  },
  { path: '/area',
    title: 'The Area',
    component: AreaMap
  }
];

export default routes;
