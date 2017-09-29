Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:70:34
Mutator: BooleanSubstitution
-     let infFace: Face = { infinite: true };
+     let infFace: Face = { infinite: false };

Ran all tests for this mutant.
Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:118:6
Mutator: IfStatement
-         newGraph.faces[keepFaceKey].infinite ||
-         newGraph.faces[delFaceKey].infinite
+         true

Ran all tests for this mutant.
Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:152:9
Mutator: Block
-     } else {
-       throw new Error("Can't connect already connected vertices");
-     }
+     } else {}

Ran all tests for this mutant.
Mutant survived! -- remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:177:14
Mutator: BinaryExpression
-     if (g.mark1 && g.mark2) {
+     if (g.mark1 || g.mark2) {

Ran all tests for this mutant.
Mutant survived! -- remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:181:12
Mutator: BinaryExpression
-       if (idx > -1) {
+       if (idx >= -1) {

Ran all tests for this mutant.
Mutant survived! -- remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:187:11
Mutator: Block
-       } else {
-         throw new Error("Marked vertices not on boundary");
-       }
+       } else {}

Ran all tests for this mutant.
Mutant survived! -- remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:190:9
Mutator: Block
-     } else {
-       throw new Error("Graph is unmarked");
-     }
+     } else {}

Ran all tests for this mutant.
Mutant survived! -- dead code, remove
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:205:12
Mutator: BinaryExpression
-     if (v2Idx >= 0) {
+     if (v2Idx < 0) {

Mutant survived! -- remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:227:6
Mutator: IfStatement
-     if (face.incidentEdge) {
+     if (true) {

Ran all tests for this mutant.
Mutant survived! --  remove code
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:286:6
Mutator: IfStatement
-     if (graph.vertices[vKey].incidentEdge) {
+     if (true) {

Ran all tests for this mutant.
Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:368:61
Mutator: Block
-     if (includes(getAdjacentVertices(newGraph, vKey1), vKey2)) {
-       throw new Error("Can't connect already connected vertices");
-     }
+     if (includes(getAdjacentVertices(newGraph, vKey1), vKey2)) {}

Ran all tests for this mutant.
Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:410:30
Mutator: BooleanSubstitution
-       let newFace = { infinite: false, incidentEdge: newFaceEdge };
+       let newFace = { infinite: true, incidentEdge: newFaceEdge };

Ran all tests for this mutant.
Mutant survived!
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:518:36
Mutator: BinaryExpression
-       (ea: [string, number]) => ea[1] < newAngle
+       (ea: [string, number]) => ea[1] <= newAngle

Ran all tests for this mutant.
Mutant survived! -- write test?
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:581:9
Mutator: Block
-     } else {
-       throw new Error("Not a leaf vertex!");
-     }
+     } else {}

Ran all tests for this mutant.
Mutant survived! -- write test
/home/harrison/Code/slick-mongoose/src/planar_graph.ts:654:23
Mutator: ConditionalExpression
-     let [lsIdx, gtIdx] = viIdx < vjIdx ? [viIdx, vjIdx] : [vjIdx, viIdx];
+     let [lsIdx, gtIdx] = false ? [viIdx, vjIdx] : [vjIdx, viIdx];

Ran all tests for this mutant.
