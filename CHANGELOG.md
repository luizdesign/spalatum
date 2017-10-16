# Changelog

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
