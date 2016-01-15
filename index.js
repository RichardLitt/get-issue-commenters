'use strict'

const Octokat = require('octokat')
const octo = new Octokat({
  token: process.env.GITHUB_OGN_TOKEN
})
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const depaginate = require('depaginate')

module.exports = function (opts) {
  return Promise.resolve().then(function () {
    return octo.orgs(opts.org).repos.fetch()
  }).map(function (repo) {
    return depaginate(function (opts) {
      return octo.repos(opts.org, opts.repoName).issues.comments.fetch({
        since: opts.since,
        page: opts.page
      })
    }, {
      org: opts.org,
      repoName: repo.name,
      page: 1,
      since: opts.since
    })
  }).then(function (response) {
    return _.flatten(response)
  }).map(function (response) {
    if (moment(response.updatedAt).isAfter(opts.since)) {
      return response.user.login
    }
  }).then(function (response) {
    return _.uniq(_.without(response, undefined))
  }).catch(function (err) {
    console.log('err', err)
  })
}
