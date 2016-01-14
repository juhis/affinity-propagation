# affinity-propagation

Affinity propagation is a clustering method developed by Brendan J. Frey and Delbert Dueck. This is a Javascript implementation based on and tested against their [original Matlab implementation](http://www.psi.toronto.edu/affinitypropagation/software/apcluster.m).

[Frey & Dueck: Clustering by Passing Messages Between Data Points, Science 2007](http://www.psi.toronto.edu/affinitypropagation/FreyDueckScience07.pdf)

## Installation

affinity-propagation is available in npm:

```
$ npm install affinity-propagation
```

## Usage

``` JavaScript
var apclust = require('affinity-propagation')

// input is a two-dimensional similarity matrix, doesn't have to be symmetric
var data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

// basic usage
var result = apclust.getClusters(data)
console.log(result)

// result.exemplars is an array of indices of data points that are cluster exemplars
// result.clusters is an array indicating which cluster each data point belongs to

// 'preference', 'damping', 'maxIter' and 'convIter' options are available
//
// 'preference' is the inital preference of each data point being a cluster exemplar
// it can be 'median' (data median, default), 'min' (data minimum), or any number
//
// 'damping' is the damping factor between iterations (default: 0.8)
//
// 'maxIter' is the maximum number of iterations to run
//
// 'convIter' is the number of iterations after which the clustering stops if it has converged
//
result = apclust.getClusters(data, {preference: 'min', damping: 0.6})
console.log(result)
```

## Testing

```
$ npm install
$ npm test
```
