'use strict'

const Octokat = require('octokat')
var octo
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const depaginate = require('depaginate')
const getGithubUser = require('get-github-user')

module.exports = function (org, opts, token) {
  octo = new Octokat({
    token: token || process.env.GITHUB_OGN_TOKEN
  })

  if (opts.since && !moment(opts.since).isValid()) {
    throw new Error('Since flag is an invalid date.')
  }
  if (opts.until && !moment(opts.until).isValid()) {
    throw new Error('Until flag is an invalid date.')
  }

  return Promise.resolve(getGithubUser(org))
  .then((user) => {
    if (user.length === 0) {
      throw new Error(org + 'is not a valid GitHub user')
    } else {
      return user
    }
  })
  .map((user) => {
    return depaginate(function (opts) {
      return (opts.org.type === 'Organization') ? octo.orgs(org).repos.fetch(opts) : octo.users(org).repos.fetch(opts)
    }, {
      org: user
    })
  })
  .then(_.flatten.bind(_))
  .filter((response) => (opts.repo) ? response.name === opts.repo : response)
  .map((repo) => {
    return depaginate(function (opts) {
      return octo.repos(opts.org, opts.repoName).issues.comments.fetch(opts)
    }, {
      org: org,
      repoName: repo.name,
      since: opts.since || '1980-01-01T00:01:01Z'
    })
  })
  .then(_.flatten.bind(_))
  .filter(function (response) {
    if (opts.since && opts.until && moment(response.updatedAt).isBetween(opts.since, opts.until)) {
      return response
    } else if (opts.since && !opts.until && moment(response.updatedAt).isAfter(opts.since)) {
      return response
    } else if (!opts.since && opts.until && moment(response.updatedAt).isBefore(opts.until)) {
      return response
    } else if (!opts.since && !opts.until) {
      return response
    }
  })
  .map((response) => {
    if (response.user && response.user.login) {
      return response.user.login
    }
  })
  .then(response => _.uniq(_.without(response, undefined)))
  .catch(function (err) {
    console.log('err', err)
  })
}
