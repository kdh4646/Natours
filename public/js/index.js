/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout } from './login';

//DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

//DELEGATION
if (leaflet) {
  //Get locations from HTML
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

//Login w/ email and password
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

//Log Out
if (logOutBtn) logOutBtn.addEventListener('click', logout);
