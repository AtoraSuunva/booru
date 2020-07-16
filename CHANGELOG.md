# booru Changelog

## 2.3.2 [Latest]

- Added `Post#available`, to check if a post isn't deleted/banned
- By default, unavailable posts aren't returned in search results
  - You can use `SearchParameters#showUnavailable` to still get them
  - `Booru.search('db', ['cat'], { showUnavailable: true })`
- Fix for danbooru occasionally having invalid `fileUrl` or missing IDs
  - You can use `Post#available` to check for this

## 2.3.0

- Fix for illegal invocation errors when using booru on the web
  - Some of the APIs don't have the required CORS headers however
- Add `encodeURI` to tags when searching, to avoid encoding errors from the API
- Better example.js file, now supports command line input
- Remove lolibooru

## 2.2.3

- Various fixes for Derpibooru support

## 2.2.2

- Fix default tags missing from post results
- Fix scores/sources/createdAt post props for some sites

## 2.2.1

- Added missing check for `results.posts` in API response

## 2.2.0

- Support for e621/e926's new api
- Fix BooruError wiping out stack trace of caught error
- Dependency updates

## 2.1.0

- Update dependencies
- Fix typo in "hypo" for hypnohub's aliases #42
- Workaround for JS projects trying to use `new booru(site)` #40
  - Will still "work" for certain projects, but now `booru.forSite(site)` is preferred

## 2.0.5

- Last release before changelog started
