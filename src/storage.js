async function save(key, value) {
	return chrome.storage.sync.set({
		[key]: value
	});
}

async function get(key, defaultValue = null) {
	return defaultValue === null ? chrome.storage.sync.get(key) : chrome.storage.sync.get({[key]: defaultValue});
}

export {save, get};