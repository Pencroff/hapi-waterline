![hapi-waterline](./img/hapi-waterline.png)

hapi-waterline
==============

Waterline (an adapter-based ORM for Node.js) as a plugin for Hapi
More details about waterline in original [repository](https://github.com/balderdashy/waterline "waterline repo")

With the current version the latest of waterline version used. With this one have to
define and create the sql tables on your own for sails-postgres adapter ( do not now if
this applies for mongo or mydql adapters ). Please have a look att 
[waterline-table](https://www.npmjs.com/package/waterline-table) for this.
  
## Usage

Install with npm (Hapi > 17.x):

    npm i hapi-waterline --save
    
or for old version
    
    npm i hapi-waterline@0.1.2 --save

Register plugin in the `hapi` server

```js
var Hapi = require('hapi');
var server = new Hapi.Server();

var pluginOptions = {
    adapters: { // adapters declaration
            'mongo-adapter': require('sails-mongo')
    },
    datastores: {
        mongoCon: { // datastores declaration
            adapter: 'mongo-adapter',
            user: '',
            password: '',
            host: 'localhost',
            port: '27017',
            database: 'TuiDev'
        }
    },
    models: { // common models parameters, not override exist declaration inside models
        datatstore: 'mongoCon',
        migrate: 'alter'
    },
	decorateServer: true, // decorate server by method - getModel
	path: ['../api/models', './common/models'] // string or array of strings with paths to folders with models declarations 
};

server.register({
    plugin: require('hapi-waterline'),
    options: pluginOptions })
    .then(() => {/*...do some stuff*/})
    .catch((err) => console.log('error', 'Failed loading plugin: hapi-kea-config'));
});

// Usage in the code
var orm = server.plugins['hapi-waterline'];
var models = orm.models; // all registered types of models
var databases = orm.databases; // registered connections to databeses
var pet = models.pet;
// or
var pet = server.getModel('pet'); // applied by flag - decorateServer
```

### Model example
```js
// file loccated in ../api/models folder
module.exports = {
    identity: 'pet',
    attributes: {
        primaryKey:'id',
        identity: 'pet',
        datastore: 'flat',
        attributes: {
            id: { type: 'number', autoMigrations: { autoIncrement: true } },
            name: {type: 'string'},
            breed: {type: 'string'}
        }
    }
};
```

##API

#### server.plugins['hapi-waterline']

Return object exposed by plugin
```js
{
	orm: {...}, 		// current exemplar waterline orm
	models: {...},		// registered models
	databases: {...}	// registered database connections
}
```

#### server.getModel 

Exten `server` if `decorateServer` flag is `true` in plugin config

**Parameters**

**model-indentity**: `string`, indentity value of model

## Thanks

Big thank you for [Mikael Lindahl](https://github.com/mickelindahl) for support Hapi 17.x

## Analogs

* [Dogwater](https://github.com/devinivy/dogwater)
* [Hapi Water](https://github.com/tswayne/hapi-water)

