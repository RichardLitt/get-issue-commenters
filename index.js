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
    return Promise.try(function () {
      return getGithubUser(org)
    }).then(function(user) {
      if (user.type === 'Organization') {
        return octo.orgs(org).repos.fetch()
      } else {
        return octo.users(org).repos.fetch()
      }
    }).map(function (repo) {
      return depaginate(function (opts) {
        return octo.repos(opts.org, opts.repoName).issues.comments.fetch({
          since: (opts.since) ? opts.since : null,
          page: opts.page
        })
      }, {
        org: org,
        repoName: repo.name,
        page: 1,
        since: flags.since
      })
    }).then(_.flatten.bind(_))
  }

  function getRepo (org, flags) {
    return Promise.resolve().then(function () {
      return depaginate(function (opts) {
        return octo.repos(opts.org, opts.repoName).issues.comments.fetch({
          since: (opts.since) ? opts.since : null,
          page: opts.page
        })
      }, {
        org: org,
        repoName: flags.repo,
        page: 1,
        since: flags.since
      })
    })
  }

  if (flags.since && !moment(flags.since).isValid()) {
    throw 'Since flag is an invalid date.'
  }

  return Promise.resolve().then(function () {
    return (flags.repo) ? getRepo(org, flags) : getAllRepos(org, flags)
  }).map(function (response) {
    if (flags.since && moment(response.updatedAt).isAfter(flags.since)) {
      return response.user.login
    } else if (!flags.since) {
      return response.user.login
    }
  }).then(function (response) {
    return _.uniq(_.without(response, undefined))
  }).catch(function (err) {
    console.log('err', err)
  })
}
