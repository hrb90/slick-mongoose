import { mapValues } from "./util";

const readable = {
  addEdges: `Add edges so that the graph is triangulated and 2-connected (i.e.
  can't be disconnected by removing one edge or vertex). Adding edges only makes
  our problem harder; a coloring of the new graph will work as a coloring of the
  original graph.`,
  fiveChoices: "Begin with vertices having five possible colors",
  restrictOuter: "Restrict outer vertices to three possible colors",
  endPreColor: `Color two adjacent outer vertices red and blue. Note that the
  interior vertices have five possible colors, two outer vertices are colored,
  and the rest of the outer vertices have three possible colors.
  This will be an invariant throughout the recursive algorithm.`,
  baseCase: `The triangle is the base case of our algorithm. As promised by our
  invariant, it has two colored vertices and one vertex with three choices.
  So we can always color the third vertex.`,
  chordlessPartOne: `There is no chord... Find a vertex on the outside of the
  graph that is a neighbor of a colored vertex and restrict it to two colors,
  not including the color of the colored vertex.`,
  chordlessPartTwo: `Ensure that the neighbors of the vertex in the interior of
  the graph can't be colored with those two colors. Only one of this vertex's
  neighbors can be colored with even one of the two colors, so we will be able
  to come back and properly color this vertex.`,
  chordlessPartThree: "Recursively color the graph with the vertex removed",
  chordlessPartFour: "Color the vertex we removed",
  chorded:
    "There is a chord; split the graph and recursively color the subgraphs",
  finished: "We're done!"
};

export const EXPLANATIONS = mapValues(readable, str => str.replace("\n", ""));
