# Barnacle back-end

### Environment

Variables
```
MONGO_HOST
```
Port
```
3000
```
Start mongodb 
```
$ npm run db:start
```
Start back server
```
$ npm run back:start
```

##### Animals
 * api/animals/search/all
 * api/animals/search/id/\<animalId>
 * api/animals/create
 * api/animals/edit
 * api/animals/delete/\<animalId>
 
##### Features
 * api/features/search/all
 * api/features/search/id/\<featureId>
 * api/features/search/name/\<featureName>
 * api/features/create


##### API tests
 ```
$ npm run test:api:list
$ npm run test:api:allure
 ```
