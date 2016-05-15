"use stric";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    FindByHash = require('../.'),
    chai = require("chai"),
    should = chai.should(),
    Resource,
    ResourceDependent;


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

/*
 https://www.youtube.com/watch?v=--UPSacwPDA
 Am I wrong, fallin' in love with you,
 tell me am I wrong, well, fallin' in love with you
 While your other man was out there,
 cheatin' and lyin', steppin' all over you

 Uh, sweet thing
 Tell me am I wrong, holdin' on to you so tight,
 Tell me, tell me, am I wrong, holdin' on to you so tight
 If your other man come to claim you,
 he'd better be ready, ready for a long long fight
 */

/* Tests */
var title = 'Am I wrong, fallin\' in love with you!',
    second = 'tell me am I wrong, well, fallin\' in love with you',
    third = 'While your other man was out there',
    hashExample = "Am I wrong";


describe('Default plugin usage', function () {
    before(function (done) {
        //Sorry for this.
        mongoose.model('Resource').remove({}, function () {
            mongoose.model('ResourceUUID').remove({}, function () {
                mongoose.model('ResourceFunction').remove({}, function () {
                    done();
                });
            });
        });
    });

    it('Create a new resource', function (done) {
        mongoose.model('Resource').create({
            title: title,
            second : second,
            third: third
        }, function (err, doc) {
            should.not.exist(err);
            should.exist(doc);
            doc.should.have.property('title').and.equal(title);
            doc.should.have.property('sweetThing');
            done();
        });
    });


    it('Create a new resource UUID', function (done) {
        mongoose.model('ResourceUUID').create({
            title: title,
            second : second,
            third: third
        }, function (err, doc) {
            should.not.exist(err);
            should.exist(doc);
            doc.should.have.property('title').and.equal(title);
            doc.should.have.property('hash');
            done();
        });
    });


    it('Create a new resource function', function (done) {
        mongoose.model('ResourceFunction').create({
            title: title,
            second : second,
            third: third
        }, function (err, doc) {
            should.not.exist(err);
            should.exist(doc);
            doc.should.have.property('title', title);
            doc.should.have.property('hash', hashExample);
            done();
        });
    });

});
