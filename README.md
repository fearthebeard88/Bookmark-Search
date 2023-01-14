# Bookmark Search

This chrome extension is designed to help searching through bookmarks. Each search method looks through your bookmark titles.

### Note: 
The default keyboard shortcut is assigned to Control + Shift + F, if this does not work for you please check your extension shortcuts and 
ensure you are not already using that key combination for a different shortcut.

## Currently Supported Search Methods
- Contains
- Equals (Exact match)
- Starts with
- Keyword

"Equals" and "Starts with" are pretty self explanatory. "Contains" for the most part is to, but it is worth noting that there is nothing stopping you from using a custom regular expression (no flags though). "Keyword" allows you to search with using a list of words seperated by spaces.

You can configure which search method you want to use in the chrome extension settings page, which can be found by going to your [Chrome Extensions](chrome://extensions) and navigating to this extension or by clicking the "gear" icon in the top of the extensions popup.

## Note
This extension is still under active development, and while it is fully functional it is not yet complete. The checklist below indicates what needs to be finished before the first release will be created:
- [x] Update the options page status message so it no longer pushes content down
- [x] Update the save method for options page so it runs without having to click a button
- [ ] Minify the javascript and css files and update all the includes to use the minified files
- [x] Add some kind of indication of which folder a bookmark is from in the search results for duplicate bookmark names
- [x] Add tooltip to show the URL of the bookmark in the popup
- [x] Implement a keywords search method

## Future Goals
- [x] Implement a keyboard shortcut to access the bookmark search
- [ ] Implement a omnibox method of searching your bookmarks
- [ ] Create a method of changing the search method using keywords and parsing it in the search function