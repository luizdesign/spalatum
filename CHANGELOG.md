# Changelog

## v4.1.0 - January/2018
### Added
- Error stack trace page

## v4.0.0 - January/2018
### Added
- Options param to render method

### Removed
- Middleware

### Changed
- The way lib is exported

## v3.1.2 - January/2018
### Removed
- Remove host header that is passed to fragment request

## v3.1.1 - December/2017
### Added
- Added new coverage setup

### Removed
- Removed husky precommit script

## v3.1.0 - December/2017
### Removed
- Remove HTML minification

## v3.0.2 - November/2017
### Added
- Add new logs for every fragments requests
- Change middleware to pass all kind of headers to the fragments requests

## v3.0.1 - October/2017
### Added
- Always pass the host header with the fragment endpoint hostname to the request

## v3.0.0 - October/2017
### Changed
- An express middleware to pass request headers to fragment requests

## v2.2.0 - October/2017
### Added
- Remove duplicated assets in a template

## v2.1.1 - October/2017
### Changed
- Change log date format to ISO

## v2.1.0 - October/2017
### Added
- Add an specific header to Spalatum requests.
- Add logger to log every requests made by Spalatum.
- Tests Refactoring

## v2.0.0 - October/2017
### Changed
- Remove all references from global.cache and it's now a cache Class to manage the cache
- Spalatum is now an object with methods
  -- **render**: Recieve a template with fragments and make http request to fragment href and returns the parsed html.
  -- **getCache**: returns cache object
  -- **clearCacheItem**: clear a specific cache item by endpoint.
  -- **clearAllCache**: clear all cache items from the cache object

## v1.0.0 - October/2017
### Added
- Cache management

### Changed
- Spalatum API now its a class definition.
- Spalatum is a **constructor**, that have four static methods:
  -- **render**: Recieve a template with fragments and make http request to fragment href and returns the parsed html.
  -- **getCache**: returns cache object
  -- **removeCacheByEndpoint**: remove a specific cache item by endpoint.
  -- **removeAllCache**: remove all cache items from the cache object

## v0.6.0 - October/2017
### Added
- New fragment attribute **primary**

## v0.5.0 - October/2017
### Changed
- Lib renamed to *Spalatum*

## v0.4.2 - October/2017
### Added
- HTPS integration test

## v0.4.1 - September/2017
### Changed
- Removing duplicated logic on error hander function

## v0.4.0 - September/2017
### Added
- Error Handler to fragment request
- Log the erros in stdout and file (**logs/**)

## v0.3.0 - September/2017
### Added
- Cache system based on memory
- New fragment attribute **cache**
- Increase the code coverage

## v0.2.1 - September/2017
### Fixed
- Proxy requests

### Changed
- Refactoring snapshot tests
- Use superagent to make simply requests

## v0.2.0 - September/2017
### Added
- Support to proxy attribute
- Support to https request

### Changed
- Fragment-fetch submodule to fragment-fetching
- Refactoring extraction of fragment's attributes

## v0.1.1 - September/2017
### Changed
- Refactoring to submodules architecture

### Added
- Unit tests
- Basic documentation

## v0.1.0 - August/2017
### Added
- Basic fragment parser
- Code Lint with Airbnb pattern
- Editorconfig
- Precommit git hook with code lint
- Contribution guide
