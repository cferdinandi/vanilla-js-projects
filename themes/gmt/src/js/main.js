import '../../../../../gmt-theme/dist/js/_matches.polyfill.js';
import mailchimp from '../../../../../gmt-theme/dist/js/mailchimp.js';
// import addHeadingLinks from '../../../../../gmt-theme/dist/js/heading-links.js';
// import filterTopics from './main-components/filters.js';

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp(function (data) {
		if (data.code === 200) {
			window.location.href = 'https://gomakethings.com/newsletter-success';
		}
	});
}

// // Anchor links on posts
// if (document.body.matches('.js-anchors')) {
// 	addHeadingLinks('h2, h3, h4, h5, h6', '#', 'link-no-underline');
// }

// // Filter topics
// if (document.querySelector('[data-filter]')) {
// 	filterTopics();
// }