# Changelog

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
### Added
- An express middleware to pass request headers to fragment requests

## v2.2.0 - October/2017
### Added
- Remove duplicated assets in a template (see more in [#9](http://gitlab.devel/frontend-platform/spalatum/merge_requests/9))

## v2.1.1 - October/2017
### Changed
- Change log date format to ISO (see more in [#8](http://gitlab.devel/frontend-platform/spalatum/merge_requests/8))

## v2.1.0 - October/2017
### Added
- Add an specific header to Spalatum requests. (see more in [#7](http://gitlab.devel/frontend-platform/spalatum/merge_requests/7))
- Add logger to log every requests made by Spalatum. (see more in [#6](http://gitlab.devel/frontend-platform/spalatum/merge_requests/6))
- Tests Refactoring (see more in [#5](http://gitlab.devel/frontend-platform/spalatum/merge_requests/5))

## v2.0.0 - October/2017
### Changed
- Remove all references from global.cache and it's now a cache Class to manage the cache
- Spalatum is now an object with methods (see more in [#4](http://gitlab.devel/frontend-platform/spalatum/merge_requests/4)):
  -- **render**: Recieve a template with fragments and make http request to fragment href and returns the parsed html.
  -- **getCache**: returns cache object
  -- **clearCacheItem**: clear a specific cache item by endpoint.
  -- **clearAllCache**: clear all cache items from the cache object

## v1.0.0 - October/2017
### Added
- Cache management (see more in [#1](http://gitlab.devel/frontend-platform/spalatum/merge_requests/1))

### Changed
- Spalatum API now its a class definition. (see more in [#1](http://gitlab.devel/frontend-platform/spalatum/merge_requests/1))
- Spalatum is a **constructor**, that have four static methods:
  -- **render**: Recieve a template with fragments and make http request to fragment href and returns the parsed html.
  -- **getCache**: returns cache object
  -- **removeCacheByEndpoint**: remove a specific cache item by endpoint.
  -- **removeAllCache**: remove all cache items from the cache object

## v0.6.0 - October/2017
### Added
- New fragment attribute **primary** (see more in [#2](http://gitlab.devel/frontend-platform/spalatum/merge_requests/2))

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
