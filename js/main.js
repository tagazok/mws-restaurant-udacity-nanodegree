let restaurants;
// const neighborhoods = new Set();
// const cuisines = new Set();

// var map
// var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
DBHelper.initServiceWorker();
document.addEventListener('DOMContentLoaded', (event) => {
  init();
});
async function init() {
  response = await APIHelper.fetchRestaurants();
  restaurants = await response.json();
  const restaurantsPromises = [];
  const neighborhoods = new Set();
  const cuisines = new Set();

  restaurants.forEach(restaurant => {
    neighborhoods.add(restaurant.neighborhood);
    cuisines.add(restaurant.cuisine_type);
    restaurantsPromises.push(DBHelper.add(restaurant));
  });
  fillNeighborhoodsHTML(neighborhoods);
  fillCuisinesHTML(cuisines);
  Promise.all(restaurantsPromises)
  .then(() => {
    updateRestaurants()
  })
  .catch(error => {
    console.log(error)
  });
}

/**
 * Set neighborhoods HTML.
 */
function fillNeighborhoodsHTML(neighborhoods = self.neighborhoods) {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.tabIndex = 0;
    select.append(option);
  });
}

/**
 * Set cuisines HTML.
 */
function fillCuisinesHTML(cuisines = self.cuisines) {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    option.tabIndex = 0;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */

// window.initMap = () => {
//   let loc = {
//     lat: 40.722216,
//     lng: -73.987501
//   };
//   self.map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 12,
//     center: loc,
//     scrollwheel: false
//   });
// }  

/**
 * Update page and map for current restaurants.
 */
function updateRestaurants() {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  APIHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
  .then(restaurants => {
    resetRestaurants(restaurants);
    fillRestaurantsHTML(restaurants);
  })
  .catch(error => console.error(error));
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
function resetRestaurants(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  // self.markers.forEach(m => m.setMap(null));
  // self.markers = [];
  // self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
function fillRestaurantsHTML(restaurants = self.restaurants) {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  // addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
function createRestaurantHTML(restaurant) {
  const template = `
  <li>
  <picture>
    <source srcset="img/${restaurant.id}.webp" type="image/webp">
    <img class="restaurant-img" src="img/${restaurant.id}.png" type="image/png" alt="Picture of the restaurant ${restaurant.name}">
  </picture>
    <div class="restaurant-infos">
      <h1 tabindex="0">${restaurant.name}</h1>
      <p>${restaurant.neighborhood}</p>
      <p>${restaurant.address}</p>
      <a href="./restaurant.html?id=${restaurant.id}">View Details</a>
    </div>
  </li>
  `;
  const range = document.createRange();
  const fragment = range.createContextualFragment(template);

  return fragment;
}

/**
 * Add markers for current restaurants to the map.
 */
// function addMarkersToMap(restaurants = self.restaurants) {
//   if (typeof google === "undefined") return self.makers;
//   restaurants.forEach(restaurant => {
//     // Add marker to the map
//     const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
//     google.maps.event.addListener(marker, 'click', () => {
//       window.location.href = marker.url
//     });
//     self.markers.push(marker);
//   });
// }
