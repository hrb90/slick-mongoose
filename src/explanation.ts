import { mapValues } from "./util";

const readable = {
  addEdges: `First, we add edges so that the graph is triangulated and 2-connected (i.e.
  can't be disconnected by removing one edge or vertex). Adding edges only makes
  our problem harder; a coloring of the new graph will work as a coloring of the
  original graph.`,
  fiveChoices: "We begin with all vertices having five possible colors",
  restrictOuter: "Next, we restrict outer vertices to three possible colors",
  endPreColor1: `We color two adjacent outer vertices pink and blue. Note that the
  interior vertices have five possible colors, two outer vertices are colored,
  and the rest of the outer vertices have three possible colors.
  This will be an invariant throughout the recursive algorithm.`,
  endPreColor2: `At each recursive step of our algorithm, we will decide what to do
  based on whether the graph has a chord --- an interior edge between two outer vertices.
  When we see a chord, we'll highlight it in red.`,
  baseCase: `The triangle is the base case of our algorithm. As promised by our
  invariant, it has two colored vertices and one vertex with three choices.
  So we can always color the third vertex.`,
  chordlessPartOne: `There is no chord. We find a vertex on the outside of the
  graph that is a neighbor of a colored vertex and restrict it to two colors,
  not including the color of the colored vertex.`,
  chordlessPartTwo: `Next, we ensure that the neighbors of the vertex in the interior of
  the graph can't be colored with those two colors. Only one of this vertex's
  neighbors can be colored with even one of the two colors, so we will be able
  to come back and properly color this vertex.`,
  chordlessPartThree: `We recursively color the graph with the vertex removed. Note that
  once we remove the vertex, the coloring invariant holds -- two outer vertices are colored, other outer vertices have
  three possible colors, and interior vertices have five possible colors.`,
  chordlessPartFour: "Color the vertex we removed",
  chorded: `There is a chord; we split the graph and recursively color the subgraphs. The color
  invariant holds for the subgraph with the vertices we've already colored.`,
  finished: "We're done!"
};

export const EXPLANATIONS = mapValues(readable, str => str.replace("\n", ""));
