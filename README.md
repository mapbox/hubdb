# hubdb

a github-powered database


### `Hubdb(options, options.username, options.repo, options.branch, options.token)`

Create a new Hubdb instance. This is a database-like wrapper for a
branch of a GitHub repository that treats JSON objects in that branch
as documents.

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
db.add({ grass: 'green'}, function() {
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

