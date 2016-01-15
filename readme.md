# get-issue-commenters [![Build Status](https://travis-ci.org/RichardLitt/get-issue-commenters.svg?branch=master)](https://travis-ci.org/RichardLitt/get-issue-commenters)

> Get users who comment on issues for OS GitHub Repos

This module returns a list of GitHub usernames who have commented on issues for open source GitHub repositories in a specified organization.


## Install

```
$ npm install --save get-issue-commenters
```


## Usage

```js
const getIssueCommenters = require('get-issue-commenters');

getIssueCommenters({
    org: 'ipfs',
    since: '2016-01-15T00:20:24Z'
  });
//=> RichardLitt
```


## API

### getIssueCommenters(options)

#### options.org

Type: `string`

The organization to scour for comments.

#### options.since

Type: `string`

The ISO date from which to get comments that have been made.

## CLI

```
$ npm install --global get-issue-commenters
```

```
$ get-issue-commenters --help

  Usage
    get-issue-commenters [org] [since]

  Examples
    $ get-issue-commenters ipfs 2016-01-15T00:20:24Z
    RichardLitt
```


## License

MIT © [Richard Littauer](http://burntfen.com)
