import {get} from './storage.js';

async function getBookmarks() {
	let bookmarksCollection  = await chrome.bookmarks.getTree();
	if(bookmarksCollection.length <= 0) {
		return null;
	}

	let rootBookmark = bookmarksCollection[0];
	let rootBookmarkCollection = rootBookmark.children;
	if(rootBookmarkCollection.length <= 0) {
		return null;
	}

	let bookmarkBarCollection = rootBookmarkCollection[0];
	if(bookmarkBarCollection.children.length <= 0) {
		return null;
	}

	return bookmarkBarCollection.children;
}

function getBookmarkFragment(bookmark, renderSpecific = false) {
	if(renderSpecific) {
		if(bookmark.render != true) {
			return null;
		}
	}

	const template = document.getElementById('bookmark_list_template');
	const content = template.content;
	var fragment = content.firstElementChild.cloneNode(true);

	fragment.querySelector('a').href = bookmark.url;
	fragment.querySelector('a').title = bookmark.url;
	fragment.querySelector('h3').textContent = bookmark.title;
	return fragment;
}

function getBookmarkContainerFragment(parentBookmark, renderSpecific = false) {
	if(parentBookmark.children == null || parentBookmark.children.length <= 0) {
		return getBookmarkFragment(parentBookmark, renderSpecific);
	}

	const template = document.getElementById('bookmark_list_folder_template');
	const content = template.content;
	var fragment = content.firstElementChild.cloneNode(true);
	var bookmarks = parentBookmark.children;
	var bookmarkFragments = [];
	for(let bookmark of bookmarks) {
		var childFragment = getBookmarkContainerFragment(bookmark, renderSpecific);
		if(childFragment !== null) {
			bookmarkFragments.push(childFragment);
		}
	}

	if(bookmarkFragments.length <= 0) {
		return null;
	}

	fragment.querySelector('.bookmark-folder-title').textContent = parentBookmark.title;
	fragment.querySelector('.bookmark-folder-list').append(...bookmarkFragments);
	return fragment;
}

function addBookmarkToSet(bookmarkFragments, fragment) {
	if(Array.isArray(fragment)) {
		for(let fragmentInstance of fragment) {
			addBookmarkToSet(bookmarkFragments, fragmentInstance);
		}

		return bookmarkFragments;
	} else {
		bookmarkFragments.push(fragment);
		return bookmarkFragments;
	}
}

function getBookmarkMap(bookmark) {
	var bookmarkMap = [];
	if(bookmark.children == null || bookmark.children.length <= 0) {
		bookmarkMap.push(bookmark);
	} else {
		var childBookmarkMap = getBookmarkMappings(bookmark.children);
		bookmarkMap.push(...childBookmarkMap);
	}

	return bookmarkMap;
}

function getBookmarkMappings(bookmarks) {
	var bookmarkMappings = []
	for(let bookmark of bookmarks) {
		var bookmarkMap = getBookmarkMap(bookmark);
		bookmarkMappings.push(...bookmarkMap);
	}

	return bookmarkMappings;
}

function renderBookmarks(bookmarks, renderSpecific = false) {
	if(bookmarks == null) {
		return;
	}

	var bookmarkFragments = [];
	for(let bookmark of bookmarks) {
		var fragment = getBookmarkContainerFragment(bookmark, renderSpecific);
		if(fragment !== null) {
			addBookmarkToSet(bookmarkFragments, fragment);
		}
	}

	if(bookmarkFragments.length > 0) {
		document.getElementById('bookmark_list').append(...bookmarkFragments);
	}
}

function resetList() {
	var list = document.getElementById('bookmark_list');
	while(list.firstChild) {
		list.removeChild(list.firstChild);
	}
}

async function openPage(targetUrl) {
	let currentTabArray = await chrome.tabs.query({active: true, currentWindow: true});
	if(currentTabArray == undefined) {
		return false;
	}

	let currentTab = currentTabArray[0];
	if(currentTab.url.toLowerCase() === 'chrome://newtab/') {
		chrome.tabs.update(currentTab.id, {url: targetUrl});
	} else {
		chrome.tabs.create({url: targetUrl});
	}
	
	window.close();
}

async function openBookmark(event) {
	event.preventDefault();
	let element = event.target.closest('a');
	let targetUrl = element.getAttribute('href');
	openPage(targetUrl);
}

async function openSettings(event) {
	chrome.runtime.openOptionsPage();
}

const bookmarks = await getBookmarks();
renderBookmarks(bookmarks);
var searchMethod = await get('searchType', 'contains');
searchMethod = searchMethod.searchType;
var regex;
var searchTimeout;

document.getElementById('bookmark_search').addEventListener('input', (event) => {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		getBookmarks().then((bookmarks) => {
			resetList();
			if(bookmarks == null || bookmarks.length <= 0) {
				renderBookmarks(bookmarks);
				return;
			}

			var inputString = document.getElementById('bookmark_search').value.trim();
			if(inputString.length <= 0) {
				renderBookmarks(bookmarks);
				return;
			}

			var bookmarkMapping = getBookmarkMappings(bookmarks);
			switch(searchMethod.toUpperCase()) {
				case 'EQUALS':
					regex = new RegExp(`^${inputString}$`, 'i');
					break;
				case 'STARTS':
					regex = new RegExp(`^${inputString}`, 'i');
					break;
				case 'KEYWORD':
					inputString = inputString.replace('\\s', '|');
					regex = new RegExp(`${inputString}`, 'i');
					break;
				default:
					regex = new RegExp(inputString, 'i');
					break;
			}
			
			var flatBookmarks = bookmarkMapping.filter((map) => {
				var test = regex.test(map.title);
				return test;
			});

			for(let i = 0, count = flatBookmarks.length; i < count; ++i) {
				flatBookmarks[i].render = true;
			}

			if(flatBookmarks.length > 0) {
				renderBookmarks(bookmarks, true);
			}
		});
	}, 500);
});

document.getElementById('options_link').addEventListener('click', (event) => {
	if (chrome.runtime.openOptionsPage) {
	  	chrome.runtime.openOptionsPage();
	} else {
	  	window.open(chrome.runtime.getURL('options.html'));
	}
});

document.getElementById('bookmark_list').addEventListener('click', openBookmark);
document.getElementById('options_link').addEventListener('click', openSettings);