# booru Changelog

## 2.4.0

- Removed furry.booru.org since they have CloudFlare browser verification enabled.
  - As far as I know, there's no (intended) way to bypass this if you're not a browser.
  - Added CloudFlare-specific error message if this happens in the future
- Add fix for Paheal changing their API response format
- Make example.js only specify the "cat" default tag if you don't specify a site
- Change from `tsc` -> `typescript` for package.json scripts, since `tsc` is deprecated.
- Update dependencies

## 2.3.3

- Fix Paheal failing to provide a useful error message.
  - Details: Paheal was returning an HTML error page instead of a JSON response. The previous way
  of scraping an error message off HTML pages failed on the page Paheal returned.
- Move from `terser-folder` to a custom `minify.js`, which handles both .js and .json minifying
  - `terser-folder` also hasn't been updated in 2 years
- Update circle ci to use node 14 instead of 11
- Update dependencies, no more security vulnerabilities!

## 2.3.2

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
