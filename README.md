# mongoose-by-hash

A plugin to use hashes as the main method 

TODO: Pending add more checks, test and documentation

## Installation

The best way to install it is using **npm**

```sh
npm install mongoose-by-hash --save
```

## Loading

```js
var FindByHash = require('mongoose-by-hash');

```

## Initialization and Usage

Basic usage (you can see how works better with [test]():

```js

/* Setup */
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/mongoose-by-hash');

Resource = new mongoose.Schema({
    title: {type: String}
},{timestamps:true});

Resource.plugin(FindByHash, {name: 'sweetThing', 'default': "shortid"});
mongoose.model('Resource', Resource);


Resource = new mongoose.Schema({
    title: {type: String}
},{timestamps:true});

Resource.plugin(FindByHash, {'default': "uuid"});
mongoose.model('ResourceUUID', Resource);



Resource = new mongoose.Schema({
    title: {type: String}
},{timestamps:true});

Resource.plugin(FindByHash, {'default': function(){return hashExample}});
mongoose.model('ResourceFunction', Resource);


```


## Support

This plugin is proudly supported by [Kubide](http://kubide.es/) [hi@kubide.es](mailto:hi@kubide.es)

