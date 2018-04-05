'use strict';
let shortId  = require('shortid'),
    _ = require('lodash'),
    uuidv4 = require('uuid/v4');


module.exports = function(schema, options) {

    // Not apply hash in childSchemas
    if(schema.options.__isChildSchema === true){
        return;
    }

    options = _.merge({
        name : "hash",
        'default' : 'shortid',
        unique : true,
        errors : {
            noFound : function(){
                return "notfound";
            },
            diffLenght : function(hashes){
                return 'Some object hash are missing in: [' + (hashes || []).join(',') + ']'
            },
            notData :  function(){
                return "notfound";
            }
        },
        others : {
        }
    },options);

    if (!schema.path(options.hashName)) {
        let schemas = [],
            hashSchema = {
                type:String,
                index: true
            };

        schemas[options.name] = hashSchema;

        if (typeof options.default == 'function') {
            hashSchema['default'] = options.default;
        } else if (options.default == 'uuid') {
            hashSchema['default'] = uuidv4;
        } else {
            hashSchema['default'] = shortId;
        }

        if (options.unique) {
            hashSchema.unique = true;
        }

        hashSchema = _.merge(hashSchema, options.others);

        // Calculate if has ChildSchemas to no apply hash
        _.forEach(schema.childSchemas, function (childSchema){
            childSchema.schema.options.__isChildSchema = true;
        });

        schema.add(schemas);
    }


    schema.statics.findOneByHash = function(hash, next){
        if (!hash) {
            return options.errors.notData();
        }

        let search = {};
        search[options.name] = hash;


        if (next) {
            this.findOne(search, function(err, result){
                if (err) {
                    return next(err);
                }

                if (result) {
                    return next(null, result);
                }

                return next(options.errors.noFound());
            });
        } else {
            return this.findOne(search);
        }

    };

    schema.statics.findByHash = function(hashes, next){
        if (!hashes) {
            return options.errors.notData();
        }

        let search = {};
        search[options.name] = {$in: hashes};

        if (next) {
            this.find(search, function(err, result){
                if (err) {
                    return next(err);
                }

                if (result.length !== hashes.length) {

                    return next(options.errors.diffLenght(hashes));
                }

                next(null, result);
            });
        } else {
            return this.findOne(search);
        }
    };
};