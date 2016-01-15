#!/usr/bin/env node
'use strict'

var meow = require('meow')
var getIssueCommenters = require('./')
var Promise = require('bluebird')

var cli = meow([
  'Usage',
  '  $ get-issue-commenters [org] [since]',
  '',
  'Examples',
  '  $ get-issue-commenters ipfs 2016-01-15T00:20:24Z',
  '  RichardLitt'
])

Promise.try(function () {
  return getIssueCommenters({
    org: cli.input[0],
    since: cli.input[1]
  })
}).map(function (response) {
  console.log(response)
})
