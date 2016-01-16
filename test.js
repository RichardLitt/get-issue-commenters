import test from 'ava'
import fn from './'

// Note that these will fail if people end up using the issues.
// Which might become awkward.

test(t => {
  return fn('RichardLitt', {
    since: '2016-01-16T15:21:08.104Z',
    repo: 'get-issue-commenters'
  }).then(result => {
    t.same(result, [])
  })
})

test(t => {
  return fn('RichardLitt', {
    since: '2016-01-15T15:21:08.104Z',
    repo: 'get-issue-commenters'
  }).then(result => {
    t.same(result, ['RichardLitt'])
  })
})

// test(t => {
//   return fn('RichardLitt', {
//     since: '2016-00-16T15:21:08.104Z',
//     repo: 'get-issue-commenters'
//   }).then(result => {
//     t.throws(error, 'Since flag is an invalid date.')
//   })
// })
