![hapi-waterline](./img/hapi-waterline.png)

### *If you are looking for an up to date hapi plugin for waterline, see https://github.com/tswayne/hapi-water

hapi-waterline
==============

Waterline (an adapter-based ORM for Node.js) as a plugin for Hapi
More details about waterline in original [repository](https://github.com/balderdashy/waterline "waterline repo")

## Usage

Install with npm:

    npm i hapi-waterline --save

Register plugin in the `hapi` server

```js
var Hapi = require('hapi');
var server = new Hapi.Server();

var pluginOptions = {
    adapters: { // adapters declaration
            'mongo-adapter': require('sails-mongo')
    },
    connections: {
        mongoCon: { // connections declaration
            adapter: 'mongo-adapter',
            user: '',
            password: '',
            host: 'localhost',
            port: '27017',
            database: 'TuiDev'
        }
    },
    models: { // common models parameters, not override exist declaration inside models
        connection: 'mongoCon',
        migrate: 'alter'
    },
	decorateServer: true, // decorate server by method - getModel
    path: ['../api/models', ./common/models] // string or array of strings with paths to folders with models declarations 
};

server.register({ // for hapi >= 8.0.0 or use server.pack.register for hapi < 8.0.0
    plugin: require('hapi-waterline'),
    options: pluginOptions }, function(err) {
	if (err) {
		console.log('error', 'Failed loading plugin: hapi-kea-config');
	}
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
        name: 'string',
        breed: 'string'
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


