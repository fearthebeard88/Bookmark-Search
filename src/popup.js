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

function getBookmarkFragment(bookmark) {
	const template = document.getElementById('bookmark_list_template');
	const content = template.content;
	var fragment = content.firstElementChild.cloneNode(true);

	fragment.querySelector('a').href = bookmark.url;
	fragment.querySelector('h3').textContent = bookmark.title;
	return fragment;
}

function getBookmarkContainerFragment(parentBookmark) {
	if(parentBookmark.children == null || parentBookmark.children.length <= 0) {
		return getBookmarkFragment(parentBookmark);
	}

	const template = document.getElementById('bookmark_list_folder_template');
	const content = template.content;
	var fragment = content.firstElementChild.cloneNode(true);
	var bookmarks = parentBookmark.children;
	var bookmarkFragments = new Set();
	for(let bookmark of bookmarks) {
		var childFragment = getBookmarkContainerFragment(bookmark);
		bookmarkFragments.add(childFragment);
	}

	fragment.querySelector('.bookmark-folder-title').textContent = parentBookmark.title;
	fragment.querySelector('.bookmark-folder-list').append(...bookmarkFragments);
	return fragment;
}

function addBookmarkToSet(bookmarkFragments, fragment) {
	if(fragment instanceof Set) {
		for(let fragmentInstance of fragment) {
			addBookmarkToSet(bookmarkFragments, fragmentInstance);
		}

		return bookmarkFragments;
	} else {
		bookmarkFragments.add(fragment);
		return bookmarkFragments;
	}
}

function getBookmarkMap(bookmark) {
	var bookmarkMap = new Map();
	if(bookmark.children == null || bookmark.children.length <= 0) {
		bookmarkMap.set(bookmark.title, bookmark);
	} else {
		var childBookmarkMap = getBookmarkMappings(bookmark.children);
		childBookmarkMap.forEach((value, key) => {
			bookmarkMap.set(key, value);
		});
	}

	return bookmarkMap;
}

function getBookmarkMappings(bookmarks) {
	var bookmarkMappings = new Map();
	for(let bookmark of bookmarks) {
		var bookmarkMap = getBookmarkMap(bookmark);
		bookmarkMap.forEach((value, key) => {
			bookmarkMappings.set(key, value);
		});
	}

	return bookmarkMappings;
}

function renderBookmarks(bookmarks) {
	if(bookmarks == null) {
		return;
	}

	var bookmarkFragments = new Set();
	for(let bookmark of bookmarks) {
		var fragment = getBookmarkContainerFragment(bookmark);
		addBookmarkToSet(bookmarkFragments, fragment);
	}

	if(bookmarkFragments.size > 0) {
		document.getElementById('bookmark_list').append(...bookmarkFragments);
	}
}

function resetList() {
	var list = document.getElementById('bookmark_list');
	while(list.firstChild) {
		list.removeChild(list.firstChild);
	}
}

const bookmarks = await getBookmarks();
renderBookmarks(bookmarks);

var searchTimeout;
document.getElementById('bookmark_search').addEventListener('change', (event) => {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		getBookmarks().then((bookmarks) => {
			if(bookmarks == null || bookmarks.length <= 0) {
				return;
			}

			var inputString = document.getElementById('bookmark_search').value.trim();
			if(inputString.length <= 0) {
				return;
			}

			resetList();
			var bookmarkMapping = getBookmarkMappings(bookmarks);
			var regex = new RegExp(inputString, 'gi');
			var bookmarks = [];
			bookmarkMapping.forEach((value, key) => {
				console.log(typeof key);
				if(regex.test(key)) {
					bookmarks.push(value);
				}
			});

			if(bookmarks.length > 0) {
				renderBookmarks(bookmarks);
			}
		});
	}, 500);
});