import {save, get} from './storage.js';

document.getElementById('save_button').addEventListener('click', (event) => {
	var searchTypeValue = document.getElementById('search_type_options').value;
	save('searchType', searchTypeValue).then(() => {
		var statusElement = document.getElementById('status')
		statusElement.textContent = 'Search Type Saved';
		setTimeout(() => {
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