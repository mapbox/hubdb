# hubdb

[![build status](https://secure.travis-ci.org/mapbox/hubdb.png)](http://travis-ci.org/mapbox/hubdb)

a github-powered database


### `Hubdb(options, options.username, options.repo, options.branch, options.token)`

Create a new Hubdb instance. This is a database-like wrapper for a
branch of a GitHub repository that treats JSON objects in that branch
as documents.

Hubdb shines where GitHub itself makes sense: you can take
advantage of GitHub's well-architected APIs and user permissions. A
good example of hubdb in practice is in [stickshift](https://github.com/mapbox/stickshift),
where it powers a lightweight query storage for an analytics app.


### Parameters

| parameter          | type   | description                                                                                  |
| ------------------ | ------ | -------------------------------------------------------------------------------------------- |
| `options`          | Object |                                                                                              |
| `options.username` | string | the user's name of the repository. this is not necessary the user that's logged in.          |
| `options.repo`     | string | the repository name                                                                          |
| `options.branch`   | string | the branch of the repository to use as a database.                                           |
| `options.token`    | string | a GitHub token. You'll need to get this by OAuth'ing into GitHub or use an applicaton token. |


### Example

```js
var db = Hubdb({
 token: 'MY_TOKEN',
 username: 'mapbox',
 repo: 'hubdb',
 branch: 'db'
});
db.add({ grass: 'green' }, function() {
  db.list(function(err, res) {
    // [{
    //   path: '2e959f35c6022428943b9c96d974498d.json'
    //   data: { grass: 'green' }
    // }]
  });
});
```


### `list(callback)`

List documents within this database. If successful, the given
callback is called with an array of documents as
`{ path: string, data: object }` objects.

### Parameters

| parameter  | type     | description |
| ---------- | -------- | ----------- |
| `callback` | Function |             |



### `add(data, callback)`

Add a new object to the database. If successful, the callback is called
with (err, res) in which `res` reveals the id internally chosen
for this new item.


### Parameters

| parameter  | type     | description |
| ---------- | -------- | ----------- |
| `data`     | Object   |             |
| `callback` | Function |             |



### `remove(id, callback)`

Remove an item from the database given its id  and a callback.


### Parameters

| parameter  | type     | description |
| ---------- | -------- | ----------- |
| `id`       | String   |             |
| `callback` | Function |             |



### `get(id, callback)`

Get an item from the database given its id  and a callback.


### Parameters

| parameter  | type     | description |
| ---------- | -------- | ----------- |
| `id`       | String   |             |
| `callback` | Function |             |



### `update(id, data, callback)`

Update an object in the database, given its id, new data, and a callback.


### Parameters

| parameter  | type     | description |
| ---------- | -------- | ----------- |
| `id`       | String   |             |
| `data`     | Object   |             |
| `callback` | Function |             |


## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install hubdb
```

## Tests

```sh
$ npm test
```

