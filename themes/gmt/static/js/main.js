/*! guides v2.0.0 | (c) 2023 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/vanilla-js-guides */
(function () {
	'use strict';

	// Variables
	let buyNow = document.querySelectorAll('.edd-buy-now-button');

	// Handle "buy now" clicks
	// Don't run if right-click or command/control + click
	function buyNowHandler (event) {
		if (!event.target.classList.contains('edd-buy-now-button')) return;
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
		event.target.innerHTML = 'Adding to cart...';
		event.target.classList.add('disabled');
	}

	// Listen for "buy now" clicks
	if (buyNow.length > 0) {
		document.addEventListener('click', buyNowHandler);
	}

	function convertkit (callback) {

		//
		// Variables
		//

		// Fields
		let form = document.querySelector('[data-form="convertkit"]');
		if (!form) return;
		let email = form.querySelector('#email');
		if (!email) return;
		let status = form.querySelector('[data-status]');
		let btn = form.querySelector('[data-processing]');

		// Messages
		let messages = {
			empty: 'Please provide an email address.',
			notEmail: 'Please use a valid email address.'
		};


		//
		// Methods
		//

		/**
		 * Show a status message
		 * @param  {String}  msg     The message to show
		 * @param  {Boolean} success If true, the status was successful
		 */
		function showStatus (msg, success) {

			// Bail if there's no status container
			if (!status) return;

			// Update the status message
			status.textContent = msg;

			// Set status classes
			if (success) {
				status.classList.add('success-message');
				status.classList.remove('error-message');
				email.classList.remove('error');
			} else {
				status.classList.add('error-message');
				status.classList.remove('success-message');
				email.classList.add('error');
			}

		}

		/**
		 * Send data to the API
		 */
		function sendData () {
			fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: {
					'Accept': 'application/json'
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				}
				throw response;
			}).then(function (data) {
				showStatus(data.msg, true);
				if (data.redirect) {
					window.location.href = data.redirect;
				}
			}).catch(function (error) {
				error.json().then(function (err) {
					showStatus(err.msg);
				});
			}).finally(function () {
				form.removeAttribute('data-submitting');
			});
		}

		/**
		 * Validate the email address
		 * @return {Boolean} If true, email is valid
		 */
		function isEmail () {
			return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email.value);
		}

		/**
		 * Validate the form fields
		 * @return {Boolean} If true, form is valid
		 */
		function validate () {

			// If no email is provided
			if (email.value.length < 1) {
				showStatus(messages.empty);
				return false;
			}

			// If email is not valid
			if (!isEmail()) {
				showStatus(messages.notEmail);
				return false;
			}

			return true;

		}

		/**
		 * Handle submit events
		 * @param  {Event} event The event object
		 */
		function submitHandler (event) {

			// Stop form from submitting
			event.preventDefault();

			// Don't run again if form currently submitting
			if (form.hasAttribute('data-submitting')) return;

			// Show submitting status
			showStatus(btn.getAttribute('data-processing'), true);

			// Validate email
			if (!validate()) return;

			// Add submitting state
			form.setAttribute('data-submitting', '');

			// Send the data to the MailChimp API
			sendData();

		}


		//
		// Event Listeners & Inits
		//

		form.addEventListener('submit', submitHandler);
		form.setAttribute('novalidate', '');

	}

	// Product URLs

	/**
	 * Get the value of a cookie
	 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
	 * @return {String}       The cookie value
	 */
	function getCookie () {
		let value = '; ' + document.cookie;
		let parts = value.split(`; gmt_aff=`);
		if (parts.length == 2) return parts.pop().split(';').shift();
	}

	/**
	 * Get affiliate from URL and set cookie
	 */
	function getAffiliate () {
		let url = new URL(window.location.href);
		let aff = url.searchParams.get('friend');
		if (!aff) return;
		url.searchParams.delete('friend');
		history.replaceState(history.state, '', url.href);
		document.cookie = `gmt_aff=${aff}; path=/; max-age=${60 * 60 * 24 * 28};`;
	}

	/**
	 * Add affiliate code to each purchase link
	 * @param {String} selector The selector string for links
	 */
	function setAffiliate (selector = '.edd-buy-now-button') {
		let aff = getCookie();
		if (!aff) return;
		let links = document.querySelectorAll(selector);
		for (let link of links) {
			let url = new URL(link);
			url.searchParams.set('friend', aff);
			link.href = url.href;
		}
	}

	// ConvertKit form
	convertkit();

	// Affiliate marketing
	getAffiliate();
	setAffiliate();

}());
