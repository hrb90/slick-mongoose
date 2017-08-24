# slick-mongoose

A visualization of [Carsten Thomassen's proof](http://dl.acm.org/citation.cfm?id=184192) of the 5-color theorem for planar graphs. [See it in action here](http://www.harrisonrbrown.com/slick-mongoose).

## Contributing

The sidebar text explaining what's going on in the visualization lives in `explanation.ts`; pull requests to improve the explanatory text are encouraged!

The code in the other files is poorly documented and has very little test coverage, but if you want to tinker,

`npm install`

`npm test`.

## What's where

`geom.ts` implements some basic computational geometry primitives.

`planar_graph.ts` contains an implementation of a [doubly-connected edge list](http://www.cs.sfu.ca/~binay/813.2011/DCEL.pdf). The implementation represents the data as a "dumb" JavaScript object for easy immutability.

`animation.ts` contains datatypes and functions for constructing and reading a list-based description of the steps of our animation.

Thomassen's algorithm is implemented in `thomassen.ts`, which exports a single `fiveColor` method.
