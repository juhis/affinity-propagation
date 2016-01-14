// Affinity propagation tests
//
// Tested against the original Matlab implementation of Frey & Dueck: http://www.psi.toronto.edu/affinitypropagation/software/apcluster.m

var fs = require('fs')
var async = require('async')
var should = require('should')
var ap = require('../src/affinityPropagation.js')
var readMatrix = require('./readMatrix')

var correlationData,
    correlationResults,
    randomData,
    randomResults

describe('affinity-propagation', function() {

    before(function(done) {

        async.series([
            readMatrix.bind(null, 'test/data/correlations.txt'),
            readMatrix.bind(null, 'test/data/random.txt'),
            fs.readFile.bind(fs, 'test/data/correlations_result_median_09.json', 'utf8'),
            fs.readFile.bind(fs, 'test/data/correlations_result_min_06.json', 'utf8'),
            fs.readFile.bind(fs, 'test/data/random_result_median_07.json', 'utf8'),
            fs.readFile.bind(fs, 'test/data/random_result_min_08.json', 'utf8')
        ], function(err, data) {
            if (err) {
                return done(err)
            } else {
                correlationData = data[0].data
                randomData = data[1].data
                correlationResults = [
                    JSON.parse(data[2]),
                    JSON.parse(data[3])
                ]
                randomResults = [
                    JSON.parse(data[4]),
                    JSON.parse(data[5])
                ]
                return done()
            }
        })
    })

    it('should expose a getClusters function', function() {
        ('function').should.equal(typeof ap.getClusters)
    })
    
    describe('#getClusters()', function() {
        
        it('should throw when given no arguments', function() {
            ap.getClusters.should.throw()
        })
        
        it('should throw when given a non-square matrix', function() {
            (function() {
                ap.getClusters([[1, 2, 3], [4, 5, 6], [7, 8]])
            }).should.throw()
        })
        
        it('should throw when given an array not corresponding to a square matrix', function() {
            (function() {
                ap.getClusters([1, 2, 3])
            }).should.throw()
        })
        
        it('should not throw when given a square matrix', function() {
            (function() {
                ap.getClusters([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
            }).should.not.throw()
        })
        
        it('should not throw when given an array corresponding to a square matrix', function() {
            (function() {
                ap.getClusters([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }).should.not.throw()
        })

        it('should throw if given a damping of 0.49', function() {
            (function() {
                ap.getClusters([1, 2, 3, 4, 5, 6, 7, 8, 9], {damping: 0.49})
            }).should.throw()
        })
        
        it('should throw if given a damping of 1', function() {
            (function() {
                ap.getClusters([1, 2, 3, 4, 5, 6, 7, 8, 9], {damping: 1})
            }).should.throw()
        })
        
        it('should throw if given a preference that is not "median", "min", or a number', function() {
            (function() {
                ap.getClusters([1, 2, 3, 4, 5, 6, 7, 8, 9], {preference: 'none'})
            }).should.throw()
        })
        
        it('should return an object with .preference, .damping, .iterations, .converged, .exemplars and .clusters', function() {
            ap.getClusters([1, 2, 3, 4, 5, 6, 7, 8, 9]).should.be.type('object').and.have.properties('preference', 'damping', 'iterations', 'converged', 'exemplars', 'clusters')
        })
        
        it('should give the correct clusters in the correct number of iterations for a symmetric correlation matrix', function() {
            this.timeout(10000)
            var result = ap.getClusters(correlationData, {preference: 'median', damping: 0.9})
            result.exemplars.should.deepEqual(correlationResults[0].exemplars)
            result.clusters.should.deepEqual(correlationResults[0].clusters)
            result.iterations.should.equal(correlationResults[0].iterations)
        })
        
        it('should give the correct clusters in the correct number of iterations for a symmetric correlation matrix (different preference and damping)', function() {
            this.timeout(10000)
            var result = ap.getClusters(correlationData, {preference: 'min', damping: 0.6})
            result.exemplars.should.deepEqual(correlationResults[1].exemplars)
            result.clusters.should.deepEqual(correlationResults[1].clusters)
            result.iterations.should.equal(correlationResults[1].iterations)
        })
        
        it('should give the correct clusters in the correct number of iterations for a non-symmetric matrix', function() {
            this.timeout(10000)
            var result = ap.getClusters(randomData, {preference: 'median', damping: 0.7})
            result.exemplars.should.deepEqual(randomResults[0].exemplars)
            result.clusters.should.deepEqual(randomResults[0].clusters)
            result.iterations.should.equal(randomResults[0].iterations)
        })

        it('should give the correct clusters in the correct number of iterations for a non-symmetric matrix (different preference and damping)', function() {
            this.timeout(10000)
            var result = ap.getClusters(randomData, {preference: 'min', damping: 0.8})
            result.exemplars.should.deepEqual(randomResults[1].exemplars)
            result.clusters.should.deepEqual(randomResults[1].clusters)
            result.iterations.should.equal(randomResults[1].iterations)
        })
    })
})
