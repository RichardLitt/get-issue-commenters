'use strict'

const Octokat = require('octokat')
const octo = new Octokat({
  token: process.env.GITHUB_OGN_TOKEN
})
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const depaginate = require('depaginate')
const getGithubUser = require('get-github-user')

module.exports = function (org, flags) {

  function getAllRepos (org, flags) {
    return Promise.resolve(getGithubUser(org))
    .then((user) => {
      if (user.length === 0) {
        throw new Error(org + 'is not a valid GitHub user')
      } else {
        return user
      }
    })
    .then(user => (user.type === 'Organization') ? octo.orgs(org).repos.fetch() : octo.users(org).repos.fetch())
    .map((repo) => {
      return depaginate((opts) => {
        return octo.repos(opts.org, opts.repoName).issues.comments.fetch({
          since: opts.since,
          page: opts.page
        })
      }, {
        org: org,
        repoName: repo.name,
        page: 1,
        since: flags.since || '1970-01-01T00:01:03Z'
      })
    }).then(_.flatten.bind(_))
  }

  function getRepo (org, flags) {
    return Promise.resolve().then(() => {
      return depaginate((opts) => {
        return octo.repos(opts.org, opts.repoName).issues.comments.fetch({
          since: opts.since,
          page: opts.page
        })
      }, {
        org: org,
        repoName: flags.repo,
        page: 1,
        since: flags.since || '1970-01-01T00:01:03Z'
      })
    })
  }

  if (flags.since && !moment(flags.since).isValid()) {
    throw 'Since flag is an invalid date.'
  }
  if (flags.until && !moment(flags.until).isValid()) {
    throw 'Until flag is an invalid date.'
  }

  return Promise.resolve()
  .then(() => (flags.repo) ? getRepo(org, flags) : getAllRepos(org, flags))
  .filter(response => {
    if (flags.since && flags.until && moment(response.updatedAt).isBetween(flags.since, flags.until)) {
      return response
    } else if (flags.since && !flags.until && moment(response.updatedAt).isAfter(flags.since)) {
      return response
    } else if (!flags.since && flags.until && moment(response.updatedAt).isBefore(flags.until)) {
      return response
    } else if (!flags.since && !flags.until) {
      return response
    }
  })
  .map(response => response.user.login)
  .then(response =>_.uniq(_.without(response, undefined)))
  .catch(function (err) {
    console.log('err', err)
  })
}
