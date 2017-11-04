# slick-mongoose

A visualization of [Carsten Thomassen's proof](http://dl.acm.org/citation.cfm?id=184192) of the 5-color theorem for planar graphs. [See it in action here](http://www.harrisonrbrown.com/slick-mongoose).

## Contributing

The sidebar text explaining what's going on in the visualization lives in `explanation.ts`; pull requests to improve the explanatory text are encouraged!

The code in the other files is poorly documented and has very little test coverage, but if you want to tinker,

`npm install`

`npm test`.

`npm run mutate` will use [Stryker](https://stryker-mutator.github.io/) to run some [mutation tests](https://en.wikipedia.org/wiki/Mutation_testing).

## What's where

`geom.ts` implements some basic computational geometry primitives.

`planar_graph.ts` contains an implementation of a [doubly-connected edge list](http://www.cs.sfu.ca/~binay/813.2011/DCEL.pdf). The implementation represents the data as a "dumb" JavaScript object for easy immutability.

`animation.ts` contains datatypes and functions for constructing and reading a list-based description of the steps of our animation.

Thomassen's algorithm is implemented in `thomassen.ts`, which exports a single `fiveColor` method.

## Acknowledgements

Thanks to [Tom Hull](http://mars.wne.edu/~thull/) for introducing me to this lovely proof; [Yaanik Desai](http://profiles.ucsf.edu/yaanik.desai) for the repository name; and [@nicojs](https://github.com/nicojs) for help configuring the mutation testing framework.