import ready from 'domready';

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import App from './App';

ready(() => {
	window.app = new App();
	window.app.init();
});
