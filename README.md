# slick-mongoose

A visualization of [Carsten Thomassen's proof](http://dl.acm.org/citation.cfm?id=184192) of the 5-color theorem for planar graphs. [See it in action here](http://www.harrisonrbrown.com/slick-mongoose).

## Contributing

The sidebar text explaining what's going on in the visualization lives in `explanation.ts`; pull requests to improve the explanatory text are welcome.

You should probably not touch (or read...) any of the code in the other files, but if you insist on it, you can run some smell tests with `npm test`.

`geom.ts` implements some basic computational geometry primitives.

`planar_graph.ts` contains an implementation of a [doubly-connected edge list](http://www.cs.sfu.ca/~binay/813.2011/DCEL.pdf). The implementation represents the data as a "dumb" JavaScript object for easy immutability.

`animation.ts` contains datatypes and functions for constructing and reading a list-based description of the steps of our animation.

Thomassen's algorithm is implemented in `thomassen.ts`, which exports a single `fiveColor` method.
