# Bookmark Search

This chrome extension is designed to help searching through bookmarks. Each search method looks through your bookmark titles.

## Currently Supported Search Methods
- Contains
- Equals (Exact match)
- Starts with

You can configure which search method you want to use in the chrome extension settings page, which can be found by going to your [Chrome Extensions](chrome://extensions) and navigating to this extension or by clicking the "gear" icon in the top of the extensions popup.

## Note
This extension is still under active development, and while it is fully functional it is not yet complete. The checklist below indicates what needs to be finished before the first release will be created:
- [ ] Update the options page status message so it no longer pushes content down
- [ ] Update the save method for options page so it runs without having to click a button
- [ ] Minify the javascript and css files and update all the includes to use the minified files
- [ ] Add some kind of indication of which folder a bookmark is from in the search results for duplicate bookmark names
- [ ] Add tooltip to show the URL of the bookmark in the popup
- [ ] Implement a keywords search method
	- [ ]  Implement the concept of AND/OR for keywords

## Future Goals
Nothing concrete quite yet, but I'm sure I'll think of something...