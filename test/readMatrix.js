'use strict'

var fs = require('fs')
var splitter = require('split')
var tab = /\t/

module.exports = function(filename, transpose, callback) {

    if (callback == undefined) {
        callback = transpose
        transpose = false
        if (typeof callback !== 'function') {
            throw {name: 'ArgumentError', message: 'Missing callback function'}
        }
    }

    var headers = null
    var ids = null
    var hashHeader = null
    var hashId = null
    var data = null
    var lineNum = 0

    fs.createReadStream(filename)
        .pipe(splitter())
        .on('data', function(line) {
            var split = line.split(tab)
            if (lineNum === 0) {
                headers = split.slice(1)
                hashHeader = {}
                for (var i = 0; i < headers.length; i++) {
                    hashHeader[headers[i]] = i
                }
                ids = []
                data = []
            } else if (split.length > 1) {
                var isOK = true
                for (var i = 1; i < split.length; i++) {
                    if (split[i] === 'NA') {
                        isOK = false
                        break
                    }
                }
                if (isOK) {
                    ids.push(split[0])
                    var row = []
                    for (var i = 1; i < split.length; i++) {
                        row.push(+split[i])
                    }
                    data.push(row)
                } else {
                    console.log('skipping line %d: %s', lineNum + 1, split[0])
                }
            }
            lineNum++
            if (lineNum % 1000 === 0) {
                console.log(lineNum + ' lines processed')
            }
        })
        .on('error', function(err) {
            callback(err)
        })
        .on('end', function() {

            hashId = {}
            for (var i = 0 ; i < ids.length; i++) {
                hashId[ids[i]] = i
            }

            if (transpose === true) {
                var transposed = []
                for (var i = 0; i < data[0].length; i++) {
                    transposed.push([])
                    for (var j = 0; j < data.length; j++) {
                        transposed[i][j] = data[j][i]
                    }
                }
                data = transposed
            }
            
            callback(null, {
                headers: headers,
                ids: ids,
                hashHeader: hashHeader,
                hashId: hashId,
                data: data
            })
        })
}
