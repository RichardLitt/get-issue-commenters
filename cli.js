#!/usr/bin/env node
'use strict'

var meow = require('meow')
var getIssueCommenters = require('./')
var Promise = require('bluebird')

const cli = meow(`
    Usage
      $ get-issue-commenters <input>

    Options
      -s, --since Add a time since
      -r, --repo  Search in a specific repo

    Examples
      $ get-issue-commenters RichardLit --since=2016-01-15T00:20:24Z --repo=get-issue-commenters

`, {
    alias: {
        r: 'repo',
        s: 'since'
    }
});

Promise.try(function () {
  return getIssueCommenters(cli.input[0], cli.flags)
}).map(function (response) {
  console.log(response)
})
