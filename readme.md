# get-issue-commenters [![Build Status](https://travis-ci.org/RichardLitt/get-issue-commenters.svg?branch=master)](https://travis-ci.org/RichardLitt/get-issue-commenters)

[![Greenkeeper badge](https://badges.greenkeeper.io/RichardLitt/get-issue-commenters.svg)](https://greenkeeper.io/)

> Get users who comment on issues for OS GitHub Repos

This module returns a list of GitHub usernames who have commented on issues for open source GitHub repositories in a specified organization.


## Install

```
$ npm install --save get-issue-commenters
```


## Usage

```js
const getIssueCommenters = require('get-issue-commenters');

getIssueCommenters('ipfs', {
    since: '2016-01-15T00:20:24Z',
    until: '2016-01-20T00:20:24Z',
    repo: 'ipfs'
  });
//=> RichardLitt
     ...
```


## API

### getIssueCommenters(org, options)

#### org

Type: `string`

The organization to scour for comments.

#### options.since

Type: `string`

The ISO date from which to get comments that have been made.

#### options.until

Type: `string`

The ISO date to which to get comments that have been made.

#### options.repo

Type: `string`

A repo to search for issues from.

## CLI

```
$ npm install --global get-issue-commenters
```

```
$ get-issue-commenters --help

    Usage
      $ get-issue-commenters <input>

    Options
      -s, --since Add a time since
      -u, --until Add a time to
      -r, --repo  Search in a specific repo

    Examples
      $ get-issue-commenters RichardLitt --since=2016-01-15T00:20:24Z --until=2016-01-20T00:20:24Z --repo=get-issue-commenters

```

## License

MIT © [Richard Littauer](http://burntfen.com)
