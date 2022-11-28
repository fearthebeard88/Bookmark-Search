import {save, get} from './storage.js';

var saveTimeout;
document.getElementById('search_type_options').addEventListener('change', (event) => {
	var searchTypeElement = document.getElementById('search_type_options');
	var selectedSearchType = searchTypeElement.options[searchTypeElement.selectedIndex];
	var searchTypeValue = searchTypeElement.value;
	save('searchType', searchTypeValue).then(() => {
		var statusElement = document.getElementById('status');
		statusElement.textContent = `Search Type (${selectedSearchType.text}) Saved`;
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			statusElement.textContent = '';
		}, 5000);
	});
});

var existingOptionValue = await get('searchType', 'contains');
existingOptionValue = existingOptionValue.searchType;
var searchTypeElement = document.getElementById('search_type_options');
for(let i = 0, count = searchTypeElement.options.length; i < count; ++i) {
	if(searchTypeElement.options[i].value === existingOptionValue) {
		searchTypeElement.value = searchTypeElement.options[i].value;
		break;
	}
}