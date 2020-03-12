var filterTopics = function () {

	'use strict';

	//
	// Variables
	//

	var checkboxes = document.querySelectorAll('[data-filter]');
	var projects = document.querySelectorAll('.project');


	//
	// Methods
	//

	var hideProjects = function () {
		Array.prototype.forEach.call(projects, function (project) {
			project.setAttribute('hidden', '');
		});
	};

	var showProjects = function () {
		Array.prototype.forEach.call(checkboxes, function (checkbox) {

			// If not checked, ignore
			if (!checkbox.checked) return;

			// Show projects for this topic
			var filteredProjects = document.querySelectorAll(checkbox.getAttribute('data-filter'));
			Array.prototype.forEach.call(filteredProjects, function (project) {
				project.removeAttribute('hidden');
			});

		});
	};

	var filterProjects = function () {
		hideProjects();
		showProjects();
	};

	var clickHandler = function (event) {

		// Get the filter class
		if (!event.target.hasAttribute('data-filter')) return;

		// Filter projects
		filterProjects();

	};


	//
	// Event Handlers
	//

	document.addEventListener('click', clickHandler, false);

};