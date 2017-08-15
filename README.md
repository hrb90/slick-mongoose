# slick-mongoose

A visualization of [Carsten Thomassen's proof](http://dl.acm.org/citation.cfm?id=184192) of the 5-color theorem for planar graphs. [See it in action here](http://www.harrisonrbrown.com/slick-mongoose).

`geom.ts` implements some basic computational geometry primitives.

`planar_graph.ts` contains an implementation of a [doubly-connected edge list](http://www.cs.sfu.ca/~binay/813.2011/DCEL.pdf). The implementation represents the data as a "dumb" JavaScript object for easy immutability.

Thomassen's algorithm is implemented in `thomassen.ts`, which exports a single `fiveColor` method.
