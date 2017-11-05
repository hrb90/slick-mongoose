/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function values(dict) {
    return Object.keys(dict).map(function (key) { return dict[key]; });
}
exports.values = values;
function difference(arr1, arr2) {
    return arr1.filter(function (x) { return arr2.indexOf(x) < 0; });
}
exports.difference = difference;
function find(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return arr[i];
    }
    return null;
}
exports.find = find;
function findIndex(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return i;
    }
    return -1;
}
exports.findIndex = findIndex;
function intersection(arr1, arr2) {
    return arr1.filter(function (x) { return arr2.indexOf(x) >= 0; });
}
exports.intersection = intersection;
function mapValues(dict, callback) {
    var keys = Object.keys(dict);
    var newDict = {};
    keys.forEach(function (key) {
        newDict[key] = callback(dict[key]);
    });
    return newDict;
}
exports.mapValues = mapValues;
// This is a bad way to do this, but I can get away with it
function cloneDeep(obj) {
    var newObj = JSON.parse(JSON.stringify(obj));
    return newObj;
}
exports.cloneDeep = cloneDeep;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// coordinate equality
exports.eq = function (a, b) {
    var intEq = function (x, y) { return Math.abs(x - y) < 0.1; };
    return intEq(a.x, b.x) && intEq(a.y, b.y);
};
// 2-dimensional cross product
exports.xProd = function (v1, v2) { return v1.x * v2.y - v1.y * v2.x; };
// dot product
var dot = function (v1, v2) { return v1.x * v2.x + v1.y * v2.y; };
var scale = function (scalar, v) { return ({
    x: scalar * v.x,
    y: scalar * v.y
}); };
var plus = function (a, b) { return ({
    x: a.x + b.x,
    y: a.y + b.y
}); };
var minus = function (a, b) { return plus(a, scale(-1, b)); };
exports.angle = function (v1, v2) {
    return Math.atan2(v1.y - v2.y, v1.x - v2.x);
};
exports.getConsecutiveCoordPairs = function (v, i, p) { return [
    v,
    p[(i + 1) % p.length]
]; };
// Do the line segments from v1-v2 and v3-v4 intersect?
exports.intersect = function (v1, v2, v3, v4, halfOpen) {
    if (halfOpen === void 0) { halfOpen = false; }
    var r = minus(v2, v1);
    var s = minus(v4, v3);
    var diff = minus(v3, v1);
    var det = exports.xProd(r, s);
    if (det !== 0) {
        var t = exports.xProd(diff, r) / det;
        var u = exports.xProd(diff, s) / det;
        var interior = function (x) { return 0 < x && x < 1; };
        var boundary = function (x) { return x === 0 || x === 1; };
        if (interior(t) && interior(u)) {
            // the segments intersect
            return true;
        }
        else if (boundary(t) || boundary(u)) {
            // three points are collinear
            return (interior(t) || interior(u)) && (!halfOpen || t === 0 || u === 0);
        }
        else {
            return false;
        }
    }
    else {
        if (exports.xProd(diff, r) !== 0) {
            // parallel, non-collinear
            return false;
        }
        else {
            // all 4 points collinear
            var t0 = dot(diff, r) / dot(r, r);
            var t1 = t0 + dot(s, r) / dot(r, r);
            return Math.max(t0, t1) > 0 && Math.min(t0, t1) < 1;
        }
    }
};
// Is v in the interior of polygon?
exports.inInterior = function (polygon, v) {
    if (polygon.length < 3 || polygon.some(function (u) { return exports.eq(u, v); }))
        return false;
    var maxX = Math.max.apply(Math, polygon.map(function (v) { return v.x; }));
    var maxY = Math.max.apply(Math, polygon.map(function (v) { return v.y; }));
    var outerCoord = { x: maxX + 1, y: maxY + 1 };
    while (polygon.some(function (u) { return exports.collinear3([u, v, outerCoord]); })) {
        outerCoord.x = outerCoord.x + 1;
    }
    var crossingNum = 0;
    polygon.map(exports.getConsecutiveCoordPairs).forEach(function (pair) {
        if (exports.intersect(v, outerCoord, pair[0], pair[1], true))
            crossingNum += 1;
    });
    return crossingNum % 2 === 1;
};
exports.signedArea = function (polygon) {
    var signedAreaSum = 0;
    polygon.map(exports.getConsecutiveCoordPairs).forEach(function (pair) {
        signedAreaSum += (pair[1].x - pair[0].x) * (pair[1].y + pair[0].y);
    });
    return signedAreaSum;
};
exports.isClockwise = function (polygon) { return exports.signedArea(polygon) > 0; };
exports.collinear3 = function (polygon) { return exports.signedArea(polygon) === 0; };
// Helper method for convex hull
var lexSortYX = function (a, b) {
    if (a.y - b.y !== 0) {
        return a.y - b.y;
    }
    else {
        return a.x - b.x;
    }
};
// Graham scan
exports.convexHull = function (vertices) {
    var stack = [];
    // Don't mutate the input
    var verticesCopy = vertices.slice(0);
    // 1. Find lowest y-value
    var firstCoord = verticesCopy.sort(lexSortYX)[0];
    stack.unshift(firstCoord);
    var otherVertices = verticesCopy.slice(1);
    // 2. Sort vertices by angle
    otherVertices.sort(function (v1, v2) { return (exports.isClockwise([firstCoord, v1, v2]) ? -1 : 1); });
    // 3. Do the scan
    otherVertices.forEach(function (nextCoord) {
        while (stack.length > 1 && !exports.isClockwise([stack[1], stack[0], nextCoord])) {
            stack.shift();
        }
        stack.unshift(nextCoord);
    });
    return stack;
};
var dist2 = function (v1, v2) {
    var diff = minus(v2, v1);
    return dot(diff, diff);
};
exports.distance = function (v1, v2) {
    return Math.sqrt(dist2(v1, v2));
};
exports.unitVector = function (v1, v2) {
    var d = exports.distance(v1, v2);
    return { x: (v1.x - v2.x) / d, y: (v1.y - v2.y) / d };
};
exports.pointSegmentDistance = function (p, endPoint1, endPoint2) {
    if (exports.eq(endPoint1, endPoint2)) {
        return exports.distance(p, endPoint1);
    }
    else {
        var l2 = dist2(endPoint2, endPoint1);
        var t = dot(minus(p, endPoint1), minus(endPoint2, endPoint1)) / l2;
        t = Math.max(0, Math.min(1, t));
        return exports.distance(p, plus(endPoint1, scale(t, minus(endPoint2, endPoint1))));
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom_1 = __webpack_require__(1);
var util_1 = __webpack_require__(0);
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Orange"] = 1] = "Orange";
    Color[Color["Yellow"] = 2] = "Yellow";
    Color[Color["Green"] = 3] = "Green";
    Color[Color["Blue"] = 4] = "Blue";
})(Color = exports.Color || (exports.Color = {}));
exports.ALL_COLORS = [
    Color.Red,
    Color.Blue,
    Color.Yellow,
    Color.Green,
    Color.Orange
];
// Effectful stuff
var slugCounter = 0;
var getFaceSlug = function () {
    slugCounter = slugCounter + 1;
    return slugCounter + "";
};
var getVertexSlug = function (c) { return c.x + "," + c.y; };
var getEdgeSlug = function (c1, c2) {
    return getVertexSlug(c1) + ";" + getVertexSlug(c2);
};
// Exports
exports.createEmptyPlanarGraph = function () {
    var infFace = { infinite: true };
    return {
        infiniteFace: "infinite",
        vertices: {},
        edges: {},
        faces: { infinite: infFace }
    };
};
exports.addEdge = function (graph, c1, c2) {
    var vKey1 = exports.getVertexKey(graph, c1);
    var vKey2 = exports.getVertexKey(graph, c2);
    if (!vKey1 && !vKey2) {
        if (util_1.values(graph.vertices).length > 0)
            throw "KeepGraphConnected";
        return begin(c1, c2);
    }
    else if (!vKey1 && vKey2) {
        return connectNewVertex(graph, vKey2, c1);
    }
    else if (!vKey2 && vKey1) {
        return connectNewVertex(graph, vKey1, c2);
    }
    else {
        return connect(graph, vKey1, vKey2);
    }
};
exports.getEndpoints = function (graph, edgeKey) {
    return [
        graph.edges[edgeKey].origin,
        graph.edges[graph.edges[edgeKey].twin].origin
    ];
};
exports.removeEdge = function (graph, edgeKey) {
    var newGraph = util_1.cloneDeep(graph);
    var twinEdgeKey = newGraph.edges[edgeKey].twin;
    var keepFaceKey = newGraph.edges[edgeKey].incidentFace;
    var delFaceKey = newGraph.edges[twinEdgeKey].incidentFace;
    if (keepFaceKey !== delFaceKey) {
        if (newGraph.faces[keepFaceKey].infinite ||
            newGraph.faces[delFaceKey].infinite) {
            newGraph.faces[keepFaceKey].infinite = true;
            newGraph.infiniteFace = keepFaceKey;
        }
        newGraph = removeEdgeFixOrigin(newGraph, edgeKey);
        newGraph = removeEdgeFixOrigin(newGraph, twinEdgeKey);
        var newFaceEdges = Object.keys(newGraph.edges).filter(function (edgeKey) { return newGraph.edges[edgeKey].incidentFace === delFaceKey; });
        delete newGraph.faces[delFaceKey];
        newFaceEdges.forEach(function (eKey) { return (newGraph.edges[eKey].incidentFace = keepFaceKey); });
        delete newGraph.edges[edgeKey];
        delete newGraph.edges[twinEdgeKey];
        return newGraph;
    }
    else {
        throw new Error("Please keep the graph connected");
    }
};
exports.removeEdgeByVertices = function (graph, c1, c2) {
    var vKey1 = exports.getVertexKey(graph, c1);
    var vKey2 = exports.getVertexKey(graph, c2);
    var ourEdge = util_1.find(exports.getOutgoingEdgeKeys(graph, vKey1), function (key) { return graph.edges[graph.edges[key].twin].origin === vKey2; });
    if (ourEdge) {
        return exports.removeEdge(graph, ourEdge);
    }
    else {
        throw new Error("Can't connect already connected vertices");
    }
};
exports.removeVertex = function (graph, vertexKey) {
    var newGraph = util_1.cloneDeep(graph);
    exports.getOutgoingEdgeKeys(newGraph, vertexKey).forEach(function (eKey) {
        try {
            newGraph = exports.removeEdge(newGraph, eKey);
        }
        catch (e) {
            newGraph = removeLeafVertex(newGraph, vertexKey);
        }
    });
    return newGraph;
};
exports.removeVertexByCoord = function (graph, c) {
    return exports.removeVertex(graph, exports.getVertexKey(graph, c));
};
exports.findVp = function (g) {
    if (g.mark1 && g.mark2) {
        var boundaryVertices = exports.getBoundaryVertexKeys(g, g.infiniteFace);
        var n = boundaryVertices.length;
        var idx = boundaryVertices.indexOf(g.mark1);
        if (idx > -1) {
            if (boundaryVertices[(idx + n - 1) % n] !== g.mark2) {
                return boundaryVertices[(idx + n - 1) % n];
            }
            else {
                return boundaryVertices[(idx + 1) % n];
            }
        }
        else {
            throw new Error("Marked vertices not on boundary");
        }
    }
    else {
        throw new Error("Graph is unmarked");
    }
};
exports.getEdgeKeyByCoords = function (graph, c1, c2) {
    var v1 = exports.getVertexKey(graph, c1);
    var v2 = exports.getVertexKey(graph, c2);
    var outgoingEdgeKeys = exports.getOutgoingEdgeKeys(graph, v1);
    var adjacentVertices = exports.getAdjacentVertices(graph, v1);
    var v2Idx = adjacentVertices.indexOf(v2);
    if (v2Idx >= 0) {
        return outgoingEdgeKeys[v2Idx];
    }
    else {
        return null;
    }
};
exports.getAdjacentVertices = function (graph, vertexKey) {
    return exports.getOutgoingEdgeKeys(graph, vertexKey).map(function (eKey) { return graph.edges[graph.edges[eKey].next].origin; });
};
exports.getBoundaryEdgeKeys = function (graph, fKey) {
    var face = graph.faces[fKey];
    var boundaryEdgeKeys = [];
    if (face.incidentEdge) {
        var currentEdge = face.incidentEdge;
        while (!boundaryEdgeKeys.includes(currentEdge)) {
            boundaryEdgeKeys.push(currentEdge);
            currentEdge = graph.edges[currentEdge].next;
        }
    }
    return boundaryEdgeKeys;
};
exports.getBoundaryVertexKeys = function (graph, fKey) {
    return exports.getBoundaryEdgeKeys(graph, fKey).map(function (eKey) { return graph.edges[eKey].origin; });
};
exports.getBoundaryVertices = function (graph, fKey) {
    return exports.getBoundaryVertexKeys(graph, fKey).map(function (vKey) { return graph.vertices[vKey]; });
};
exports.getSplitFaceKey = function (graph, c1, c2) {
    var midpoint = { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 };
    var possFaceKey = getBoundingFaceKey(graph, midpoint);
    var commonFaces = util_1.intersection(getIncidentFaceKeys(graph, c1), getIncidentFaceKeys(graph, c2));
    if (commonFaces.includes(possFaceKey)) {
        var nonIntersect = function (edgeKey) {
            var firstVertex = graph.vertices[graph.edges[edgeKey].origin];
            var secondVertex = graph.vertices[graph.edges[graph.edges[edgeKey].next].origin];
            return !geom_1.intersect(c1, c2, firstVertex, secondVertex);
        };
        return exports.getBoundaryEdgeKeys(graph, possFaceKey).every(nonIntersect)
            ? possFaceKey
            : null;
    }
    else {
        return null;
    }
};
exports.getOutgoingEdgeKeys = function (graph, vKey) {
    var incidentEdgeKeys = [];
    if (graph.vertices[vKey].incidentEdge) {
        var currentEdgeKey = graph.vertices[vKey].incidentEdge;
        while (!incidentEdgeKeys.includes(currentEdgeKey)) {
            incidentEdgeKeys.push(currentEdgeKey);
            currentEdgeKey = graph.edges[graph.edges[currentEdgeKey].twin].next;
        }
    }
    return incidentEdgeKeys;
};
exports.getColors = function (g, vKey) {
    return g.vertices[vKey].colors;
};
exports.safeAddEdge = function (graph, c1, c2) {
    try {
        exports.addEdge(graph, c1, c2);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.setColors = function (g, vKey, newColors) {
    var newGraph = util_1.cloneDeep(g);
    newGraph.vertices[vKey].colors = newColors;
    return newGraph;
};
var begin = function (c1, c2) {
    var v1Slug = getVertexSlug(c1);
    var v2Slug = getVertexSlug(c2);
    var e12Slug = getEdgeSlug(c1, c2);
    var e21Slug = getEdgeSlug(c2, c1);
    var v1 = {
        x: c1.x,
        y: c1.y,
        incidentEdge: e12Slug,
        colors: exports.ALL_COLORS
    };
    var v2 = {
        x: c2.x,
        y: c2.y,
        incidentEdge: e21Slug,
        colors: exports.ALL_COLORS
    };
    var e12 = {
        twin: e21Slug,
        next: e21Slug,
        prev: e21Slug,
        origin: v1Slug,
        incidentFace: "infinite"
    };
    var e21 = {
        twin: e12Slug,
        next: e12Slug,
        prev: e12Slug,
        origin: v2Slug,
        incidentFace: "infinite"
    };
    return {
        infiniteFace: "infinite",
        vertices: (_a = {}, _a[v1Slug] = v1, _a[v2Slug] = v2, _a),
        edges: (_b = {}, _b[e12Slug] = e12, _b[e21Slug] = e21, _b),
        faces: { infinite: { infinite: true, incidentEdge: e12Slug } }
    };
    var _a, _b;
};
var connect = function (graph, vKey1, vKey2) {
    var newGraph = util_1.cloneDeep(graph);
    if (exports.getAdjacentVertices(newGraph, vKey1).includes(vKey2)) {
        throw new Error("Can't connect already connected vertices");
    }
    var v1 = newGraph.vertices[vKey1];
    var v2 = newGraph.vertices[vKey2];
    var boundingFace = exports.getSplitFaceKey(newGraph, v1, v2);
    if (boundingFace) {
        // First we fix all the edge pointers
        var e1Key = getNextClockwiseEdgeKey(newGraph, vKey1, geom_1.angle(v1, v2));
        var e1 = newGraph.edges[e1Key];
        var e2Key = getNextClockwiseEdgeKey(newGraph, vKey2, geom_1.angle(v2, v1));
        var e2 = newGraph.edges[e2Key];
        var v1v2Slug = getEdgeSlug(v1, v2);
        var v2v1Slug = getEdgeSlug(v2, v1);
        // The incidentFace pointers will be fixed later on...
        var v1v2 = {
            origin: vKey1,
            next: e2Key,
            prev: e1.prev,
            twin: v2v1Slug,
            incidentFace: boundingFace
        };
        var v2v1 = {
            origin: vKey2,
            next: e1Key,
            prev: e2.prev,
            twin: v1v2Slug,
            incidentFace: boundingFace
        };
        newGraph.edges[e1.prev].next = v1v2Slug;
        e1.prev = v2v1Slug;
        newGraph.edges[e2.prev].next = v2v1Slug;
        e2.prev = v1v2Slug;
        newGraph.edges[v1v2Slug] = v1v2;
        newGraph.edges[v2v1Slug] = v2v1;
        // Now we create a new face
        var newFaceEdge = newGraph.faces[boundingFace].infinite
            ? pickInfiniteEdge(newGraph, v1v2Slug)
            : v1v2Slug;
        newGraph.faces[boundingFace].incidentEdge =
            newGraph.edges[newFaceEdge].twin;
        var newFaceSlug = getFaceSlug();
        var newFace = { infinite: false, incidentEdge: newFaceEdge };
        newGraph.edges[newGraph.edges[newFaceEdge].twin].incidentFace = boundingFace;
        newGraph.edges[newFaceEdge].incidentFace = newFaceSlug;
        var currentEdge = newGraph.edges[newFaceEdge].next;
        while (currentEdge !== newFaceEdge) {
            newGraph.edges[currentEdge].incidentFace = newFaceSlug;
            currentEdge = newGraph.edges[currentEdge].next;
        }
        newGraph.faces[newFaceSlug] = newFace;
        return newGraph;
    }
    else {
        throw new Error("Can't connect those vertices");
    }
};
var connectNewVertex = function (graph, vKey, newVertex) {
    var boundingFaceKey = exports.getSplitFaceKey(graph, graph.vertices[vKey], newVertex);
    if (boundingFaceKey) {
        var newGraph = util_1.cloneDeep(graph);
        var newVertexSlug = getVertexSlug(newVertex);
        var oldVertex = newGraph.vertices[vKey];
        var oldOutEdgeKey = getNextClockwiseEdgeKey(newGraph, vKey, geom_1.angle(oldVertex, newVertex));
        var oldOutEdge = newGraph.edges[oldOutEdgeKey];
        var oldInEdgeKey = oldOutEdge.prev;
        var oldInEdge = newGraph.edges[oldInEdgeKey];
        var oldNewSlug = getEdgeSlug(oldVertex, newVertex);
        var newOldSlug = getEdgeSlug(newVertex, oldVertex);
        var oldNew = {
            origin: vKey,
            prev: oldInEdgeKey,
            twin: newOldSlug,
            next: newOldSlug,
            incidentFace: boundingFaceKey
        };
        var newOld = {
            origin: newVertexSlug,
            prev: oldNewSlug,
            next: oldOutEdgeKey,
            twin: oldNewSlug,
            incidentFace: boundingFaceKey
        };
        oldInEdge.next = oldNewSlug;
        oldOutEdge.prev = newOldSlug;
        newGraph.vertices[newVertexSlug] = {
            x: newVertex.x,
            y: newVertex.y,
            colors: exports.ALL_COLORS,
            incidentEdge: newOldSlug
        };
        newGraph.edges[oldNewSlug] = oldNew;
        newGraph.edges[newOldSlug] = newOld;
        return newGraph;
    }
    else {
        throw new Error("Can't connect those vertices");
    }
};
var getBoundingFaceKey = function (graph, c) {
    var boundingFaceKey = graph.infiniteFace;
    Object.keys(graph.faces).forEach(function (fKey) {
        if (graph.infiniteFace !== fKey &&
            geom_1.inInterior(exports.getBoundaryVertices(graph, fKey), c)) {
            boundingFaceKey = fKey;
        }
    });
    return boundingFaceKey;
};
var getIncidentFaceKeys = function (graph, c) {
    var vKey = exports.getVertexKey(graph, c);
    if (vKey) {
        var edgeKeys = exports.getOutgoingEdgeKeys(graph, vKey);
        return edgeKeys.map(function (eKey) { return graph.edges[eKey].incidentFace; });
    }
    else {
        return [getBoundingFaceKey(graph, c)];
    }
};
var getNextClockwiseEdgeKey = function (graph, vKey, newAngle) {
    var keysWithAngles = exports.getOutgoingEdgeKeys(graph, vKey).map(function (eKey) {
        var v1 = graph.vertices[graph.edges[eKey].origin];
        var v2 = graph.vertices[graph.edges[graph.edges[eKey].next].origin];
        return [eKey, geom_1.angle(v1, v2)];
    });
    var smallAngleEdges = keysWithAngles.filter(function (ea) { return ea[1] < newAngle; });
    var sortByAngleDecreasing = function (e1, e2) { return e2[1] - e1[1]; };
    var getHighestAngleEdge = function (pairList) {
        return pairList.sort(sortByAngleDecreasing)[0][0];
    };
    return smallAngleEdges.length > 0
        ? getHighestAngleEdge(smallAngleEdges)
        : getHighestAngleEdge(keysWithAngles);
};
exports.getVertexKey = function (graph, c) {
    var matchedVertexKey = null;
    for (var vKey in graph.vertices) {
        if (geom_1.eq(graph.vertices[vKey], c))
            matchedVertexKey = vKey;
    }
    return matchedVertexKey;
};
var pickInfiniteEdge = function (graph, eKey) {
    var e = graph.edges[eKey];
    var eTwin = graph.edges[e.twin];
    var vertices = [graph.vertices[eTwin.origin]];
    var currentEdge = graph.edges[eTwin.next];
    while (currentEdge !== eTwin) {
        vertices.push(graph.vertices[currentEdge.origin]);
        currentEdge = graph.edges[currentEdge.next];
    }
    return geom_1.isClockwise(vertices) ? eKey : e.twin;
};
var removeEdgeFixOrigin = function (graph, edgeKey) {
    var newGraph = util_1.cloneDeep(graph);
    var incomingEdgeKey = newGraph.edges[edgeKey].prev;
    var newOutgoingEdgeKey = newGraph.edges[newGraph.edges[edgeKey].twin].next;
    var faceKey = newGraph.edges[edgeKey].incidentFace;
    newGraph.edges[incomingEdgeKey].next = newOutgoingEdgeKey;
    newGraph.edges[newOutgoingEdgeKey].prev = incomingEdgeKey;
    newGraph.faces[faceKey].incidentEdge = incomingEdgeKey;
    newGraph.vertices[newGraph.edges[edgeKey].origin].incidentEdge = newOutgoingEdgeKey;
    return newGraph;
};
var removeLeafVertex = function (graph, vertexKey) {
    var newGraph = util_1.cloneDeep(graph);
    if (exports.getOutgoingEdgeKeys(newGraph, vertexKey).length === 1) {
        var outgoingEdgeKey = newGraph.vertices[vertexKey].incidentEdge;
        var twinEdgeKey = newGraph.edges[outgoingEdgeKey].twin;
        newGraph = removeEdgeFixOrigin(graph, twinEdgeKey);
        delete newGraph.vertices[vertexKey];
        delete newGraph.edges[outgoingEdgeKey];
        delete newGraph.edges[twinEdgeKey];
        return newGraph;
    }
    else {
        throw new Error("Not a leaf vertex!");
    }
};
var isBridge = function (g, eKey) {
    var twinEdgeKey = g.edges[eKey].twin;
    return g.edges[eKey].incidentFace === g.edges[twinEdgeKey].incidentFace;
};
exports.inducedInteriorSubgraph = function (g, polygon) {
    var vertexOutsidePolygon = function (vKey) {
        return !(polygon.includes(vKey) ||
            geom_1.inInterior(polygon.map(function (x) { return g.vertices[x]; }), g.vertices[vKey]));
    };
    var edgeOutsidePolygon = function (eKey) {
        return exports.getEndpoints(g, eKey).some(vertexOutsidePolygon);
    };
    var removableVertices = function (graph) {
        return Object.keys(graph.vertices)
            .filter(vertexOutsidePolygon)
            .filter(function (v) { return exports.getOutgoingEdgeKeys(graph, v).length === 1; });
    };
    var removableEdges = function (graph) {
        return Object.keys(graph.edges)
            .filter(edgeOutsidePolygon)
            .filter(function (x) { return !isBridge(graph, x); });
    };
    var newGraph = util_1.cloneDeep(g);
    // First we remove non-bridge edges until we have a spanning tree
    var edgesToRemove = removableEdges(newGraph);
    while (edgesToRemove.length > 0) {
        newGraph = exports.removeEdge(newGraph, edgesToRemove[0]);
        edgesToRemove = removableEdges(newGraph);
    }
    // Then we remove leaf vertices until we arrive at the subgraph :)
    var verticesToRemove = removableVertices(newGraph);
    while (verticesToRemove.length > 0) {
        newGraph = exports.removeVertex(newGraph, verticesToRemove[0]);
        verticesToRemove = removableVertices(newGraph);
    }
    return newGraph;
};
exports.findChordKey = function (graph) {
    var chordKey = null;
    var outerVertices = exports.getBoundaryVertexKeys(graph, graph.infiniteFace);
    outerVertices.forEach(function (vKey) {
        var edgeKeys = exports.getOutgoingEdgeKeys(graph, vKey);
        edgeKeys.forEach(function (eKey) {
            var e = graph.edges[eKey];
            if (outerVertices.includes(graph.edges[e.next].origin) &&
                e.incidentFace !== graph.infiniteFace &&
                graph.edges[e.twin].incidentFace !== graph.infiniteFace) {
                chordKey = eKey;
            }
        });
    });
    return chordKey;
};
exports.splitChordedGraph = function (g, chordKey) {
    var _a = exports.getEndpoints(g, chordKey), vi = _a[0], vj = _a[1];
    var outerVertices = exports.getBoundaryVertexKeys(g, g.infiniteFace);
    var _b = [vi, vj].map(function (x) { return outerVertices.indexOf(x); }), viIdx = _b[0], vjIdx = _b[1];
    var _c = viIdx < vjIdx ? [viIdx, vjIdx] : [vjIdx, viIdx], lsIdx = _c[0], gtIdx = _c[1];
    var poly1 = outerVertices.slice(lsIdx, gtIdx + 1);
    var poly2 = outerVertices
        .slice(0, lsIdx + 1)
        .concat(outerVertices.slice(gtIdx));
    var _d = poly1.includes(g.mark1) && poly1.includes(g.mark2)
        ? [poly1, poly2]
        : [poly2, poly1], firstPoly = _d[0], secondPoly = _d[1];
    var _e = [firstPoly, secondPoly].map(function (x) {
        return exports.inducedInteriorSubgraph(g, x);
    }), firstSubgraph = _e[0], secondSubgraph = _e[1];
    secondSubgraph.mark1 = vi;
    secondSubgraph.mark2 = vj;
    return [firstSubgraph, secondSubgraph];
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(0);
var mousetrap_1 = __webpack_require__(7);
// Refactor this to just have a "describe" type and a "describew"
var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["AddEdge"] = 0] = "AddEdge";
    AnimationType[AnimationType["Begin"] = 1] = "Begin";
    AnimationType[AnimationType["End"] = 2] = "End";
    AnimationType[AnimationType["UpdateColors"] = 3] = "UpdateColors";
    AnimationType[AnimationType["RestrictGraph"] = 4] = "RestrictGraph";
    AnimationType[AnimationType["HighlightEdge"] = 5] = "HighlightEdge";
    AnimationType[AnimationType["UnhighlightEdge"] = 6] = "UnhighlightEdge";
    AnimationType[AnimationType["Pause"] = 7] = "Pause";
    AnimationType[AnimationType["Describe"] = 8] = "Describe";
    AnimationType[AnimationType["DescribeAddEdges"] = 9] = "DescribeAddEdges";
    AnimationType[AnimationType["DescribeChordlessOne"] = 10] = "DescribeChordlessOne";
    AnimationType[AnimationType["DescribeChordlessTwo"] = 11] = "DescribeChordlessTwo";
    AnimationType[AnimationType["DescribeChordlessThree"] = 12] = "DescribeChordlessThree";
    AnimationType[AnimationType["DescribeChordlessFour"] = 13] = "DescribeChordlessFour";
    AnimationType[AnimationType["DescribeChorded"] = 14] = "DescribeChorded";
    AnimationType[AnimationType["DescribePreColor"] = 15] = "DescribePreColor";
    AnimationType[AnimationType["DescribeTriangle"] = 16] = "DescribeTriangle";
})(AnimationType = exports.AnimationType || (exports.AnimationType = {}));
var updateDescription = function (text) {
    document.getElementById("description").textContent = text;
};
var addContinueButton = function (callback) {
    var continueButton = document.createElement("strong");
    continueButton.id = "continueButton";
    continueButton.innerText = "Press spacebar to continue";
    mousetrap_1.bind("space", function () {
        mousetrap_1.unbind("space");
        callback();
    });
    document.getElementById("sidebar").appendChild(continueButton);
};
var removeElementById = function (id) {
    document.getElementById(id).remove();
};
var animationSteps = [];
// A controlled effectful function to use in the thomassen algorithms.
exports.addStep = function (type, pause, data) {
    animationSteps.push({ type: type, pause: pause, data: data, addButton: false });
};
exports.resetAnimation = function () {
    animationSteps = [];
};
exports.postProcessAnimation = function () {
    [
        AnimationType.DescribeAddEdges,
        AnimationType.DescribeChorded,
        AnimationType.DescribeTriangle,
        AnimationType.DescribeChordlessOne,
        AnimationType.DescribeChordlessTwo,
        AnimationType.DescribeChordlessThree,
        AnimationType.DescribeChordlessFour,
        AnimationType.DescribePreColor
    ].forEach(function (type) {
        var firstIndexOfType = util_1.findIndex(animationSteps, function (a) { return a.type === type; });
        if (firstIndexOfType >= 0) {
            animationSteps[firstIndexOfType].addButton = true;
        }
    });
};
exports.drawStep = function (a, canvas) {
    switch (a.type) {
        case AnimationType.AddEdge:
            canvas.drawEdge(a.data[0], a.data[1], "blue");
            break;
        case AnimationType.Begin:
            canvas.freeze();
            break;
        case AnimationType.End:
            canvas.unfreeze();
            break;
        case AnimationType.UpdateColors:
            canvas.updateColors(a.data.vertex, a.data.colors);
            break;
        case AnimationType.RestrictGraph:
            canvas.highlightGraph(a.data.graph);
            canvas.redraw();
            break;
        case AnimationType.HighlightEdge:
            canvas.highlightEdge(a.data[0], a.data[1]);
            canvas.redraw();
            break;
        case AnimationType.UnhighlightEdge:
            canvas.unhighlightEdge();
            canvas.redraw();
        case AnimationType.Describe:
        case AnimationType.DescribeAddEdges:
        case AnimationType.DescribeChorded:
        case AnimationType.DescribeTriangle:
        case AnimationType.DescribeChordlessOne:
        case AnimationType.DescribeChordlessTwo:
        case AnimationType.DescribeChordlessThree:
        case AnimationType.DescribeChordlessFour:
        case AnimationType.DescribePreColor:
            updateDescription(a.data);
            break;
        case AnimationType.Pause:
            break;
    }
};
exports.animate = function (canvas) {
    if (animationSteps.length > 0) {
        var step = animationSteps.shift();
        exports.drawStep(step, canvas);
        if (step.addButton) {
            canvas.darken();
            addContinueButton(function () {
                canvas.lighten();
                exports.animate(canvas);
                removeElementById("continueButton");
            });
        }
        else {
            setTimeout(function () { return exports.animate(canvas); }, step.pause);
        }
    }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canvas_wrapper_1 = __webpack_require__(5);
var thomassen_1 = __webpack_require__(6);
var animation_1 = __webpack_require__(3);
document.addEventListener("DOMContentLoaded", function () {
    var wrapper = new canvas_wrapper_1.GraphDrawingWrapper("canvas", 10);
    document.getElementById("animate-button").addEventListener("click", function () {
        if (!wrapper.frozen) {
            wrapper.unhighlightVertex();
            thomassen_1.fiveColor(wrapper.graph);
            animation_1.animate(wrapper);
        }
    });
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom_1 = __webpack_require__(1);
var planar_graph_1 = __webpack_require__(2);
var util_1 = __webpack_require__(0);
var colorToString = function (c, faded) {
    switch (c) {
        case planar_graph_1.Color.Red:
            return faded ? "#ff8080" : "red";
        case planar_graph_1.Color.Blue:
            return faded ? "#8080ff" : "blue";
        case planar_graph_1.Color.Green:
            return faded ? "#80ff80" : "green";
        case planar_graph_1.Color.Orange:
            return faded ? "#ffe080" : "orange";
        case planar_graph_1.Color.Yellow:
            return faded ? "#ffff80" : "yellow";
    }
};
var GraphDrawingWrapper = /** @class */ (function () {
    function GraphDrawingWrapper(canvasId, radius) {
        if (radius === void 0) { radius = 15; }
        this.radius = radius;
        this.vertices = [];
        this.canvasEl = document.getElementById(canvasId);
        this.drawCircle = this.drawCircle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.canvasEl.addEventListener("click", this.handleClick);
        this.graph = planar_graph_1.createEmptyPlanarGraph();
        this.highlightedGraph = this.graph;
        this.highlightedVertex = null;
        this.highlightedEdge = null;
        this.frozen = false;
    }
    GraphDrawingWrapper.prototype.clear = function () {
        var context = this.canvasEl.getContext("2d");
        context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    };
    GraphDrawingWrapper.prototype.darken = function () {
        this.canvasEl.className = "greyer-canvas";
    };
    GraphDrawingWrapper.prototype.clickVertex = function (v) {
        if (this.highlightedVertex) {
            if (v !== this.highlightedVertex) {
                this.drawEdge(v, this.highlightedVertex);
            }
            var highlit = this.highlightedVertex;
            this.unhighlightVertex();
            this.drawCircle(highlit);
        }
        else {
            this.highlightVertex(v);
        }
        this.drawCircle(v);
    };
    GraphDrawingWrapper.prototype.doesAddEdge = function (v1, v2) {
        try {
            this.graph = planar_graph_1.addEdge(this.graph, v1, v2);
            this.highlightedGraph = this.graph;
            return true;
        }
        catch (e) {
            if (e === "KeepGraphConnected") {
                alert("Please keep the graph connected");
            }
            return false;
        }
    };
    GraphDrawingWrapper.prototype.drawCircle = function (v, faded, fillColors) {
        if (faded === void 0) { faded = false; }
        if (fillColors === void 0) { fillColors = planar_graph_1.ALL_COLORS; }
        this.vertices.push(v);
        var context = this.canvasEl.getContext("2d");
        context.strokeStyle = faded ? "lightgrey" : "black";
        context.lineWidth = 2;
        if (this.highlightedVertex && geom_1.eq(v, this.highlightedVertex)) {
            context.strokeStyle = "red";
        }
        context.fillStyle = "none";
        context.beginPath();
        context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        if (fillColors.length > 0) {
            this.fillCircle(v, faded, fillColors);
        }
    };
    GraphDrawingWrapper.prototype.drawEdge = function (v1, v2, strokeColor) {
        if (strokeColor === void 0) { strokeColor = "black"; }
        if (this.doesAddEdge(v1, v2))
            this.unsafeDrawEdge(v1, v2, strokeColor);
    };
    GraphDrawingWrapper.prototype.fillCircle = function (v, faded, fillColors) {
        var _this = this;
        var n = fillColors.length;
        fillColors.forEach(function (color, idx) {
            var context = _this.canvasEl.getContext("2d");
            context.fillStyle = colorToString(color, faded);
            context.beginPath();
            context.arc(v.x, v.y, _this.radius, 2 * idx * Math.PI / n, 2 * (idx + 1) * Math.PI / n);
            context.lineTo(v.x, v.y);
            context.closePath();
            context.fill();
        });
    };
    GraphDrawingWrapper.prototype.freeze = function () {
        this.frozen = true;
    };
    GraphDrawingWrapper.prototype.handleClick = function (e) {
        var _this = this;
        if (!this.frozen) {
            try {
                var newVertex_1 = this.translateEventToCoord(e);
                var clickedVertex_1;
                var overlappingVertex_1;
                this.vertices.forEach(function (v) {
                    var dist = geom_1.distance(v, newVertex_1);
                    if (dist <= _this.radius)
                        clickedVertex_1 = v;
                    if (dist <= 2 * _this.radius)
                        overlappingVertex_1 = v;
                });
                if (clickedVertex_1) {
                    this.clickVertex(clickedVertex_1);
                }
                else if (!overlappingVertex_1) {
                    this.drawCircle(newVertex_1);
                }
            }
            catch (err) {
                alert(err.message);
            }
        }
    };
    GraphDrawingWrapper.prototype.highlightEdge = function (v1, v2) {
        this.highlightedEdge = [v1, v2];
    };
    GraphDrawingWrapper.prototype.highlightGraph = function (g) {
        this.highlightedGraph = g;
    };
    GraphDrawingWrapper.prototype.highlightVertex = function (v) {
        if (this.highlightedVertex) {
            this.unhighlightVertex();
        }
        else {
            this.highlightedVertex = v;
        }
    };
    GraphDrawingWrapper.prototype.isHighlightedEdge = function (v1, v2) {
        if (this.highlightedEdge === null)
            return false;
        var h1 = this.highlightedEdge[0];
        var h2 = this.highlightedEdge[1];
        return (geom_1.eq(h1, v1) && geom_1.eq(h2, v2)) || (geom_1.eq(h1, v2) && geom_1.eq(h2, v1));
    };
    GraphDrawingWrapper.prototype.lighten = function () {
        this.canvasEl.className = "";
    };
    GraphDrawingWrapper.prototype.redraw = function () {
        var _this = this;
        this.clear();
        var strongVertexKeys = Object.keys(this.highlightedGraph.vertices);
        var fadedVertexKeys = util_1.difference(Object.keys(this.graph.vertices), strongVertexKeys);
        var g = this.graph;
        strongVertexKeys.forEach(function (vKey) {
            var v = g.vertices[vKey];
            _this.drawCircle(v, false, v.colors);
        });
        fadedVertexKeys.forEach(function (vKey) {
            var v = g.vertices[vKey];
            _this.drawCircle(v, true, v.colors);
        });
        Object.keys(g.edges).forEach(function (e) {
            var _a = planar_graph_1.getEndpoints(g, e), v1 = _a[0], v2 = _a[1];
            var edgeColor;
            edgeColor =
                strongVertexKeys.includes(v1) && strongVertexKeys.includes(v2)
                    ? "black"
                    : "lightgrey";
            if (_this.isHighlightedEdge(g.vertices[v1], g.vertices[v2])) {
                edgeColor = "red";
            }
            _this.unsafeDrawEdge(g.vertices[v1], g.vertices[v2], edgeColor);
        });
        this.graph = g;
    };
    GraphDrawingWrapper.prototype.translateEventToCoord = function (e) {
        return {
            x: e.x - this.canvasEl.offsetLeft,
            y: e.y - this.canvasEl.offsetTop,
            colors: []
        };
    };
    GraphDrawingWrapper.prototype.unfreeze = function () {
        this.frozen = false;
    };
    GraphDrawingWrapper.prototype.unhighlightEdge = function () {
        this.highlightedEdge = null;
    };
    GraphDrawingWrapper.prototype.unhighlightVertex = function () {
        this.highlightedVertex = null;
    };
    GraphDrawingWrapper.prototype.unsafeDrawEdge = function (v1, v2, strokeColor) {
        var context = this.canvasEl.getContext("2d");
        var unit = geom_1.unitVector(v1, v2);
        context.strokeStyle = strokeColor;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
        context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
        context.stroke();
    };
    GraphDrawingWrapper.prototype.updateColors = function (v, colors) {
        var vKey = planar_graph_1.getVertexKey(this.graph, v);
        this.graph = planar_graph_1.setColors(this.graph, vKey, colors);
        this.redraw();
    };
    return GraphDrawingWrapper;
}());
exports.GraphDrawingWrapper = GraphDrawingWrapper;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom_1 = __webpack_require__(1);
var planar_graph_1 = __webpack_require__(2);
var animation_1 = __webpack_require__(3);
var explanation_1 = __webpack_require__(8);
var util_1 = __webpack_require__(0);
var minDist = function (cList, ep1, ep2) {
    var sansEndpoints = cList.filter(function (v) { return !(geom_1.eq(v, ep1) || geom_1.eq(v, ep2)); });
    return Math.min.apply(Math, sansEndpoints.map(function (v) { return geom_1.pointSegmentDistance(v, ep1, ep2); }));
};
var animAddEdge = function (g, pair) {
    animation_1.addStep(animation_1.AnimationType.AddEdge, 0, pair);
    return planar_graph_1.addEdge(g, pair[0], pair[1]);
};
var hullify = function (g) {
    var hullVertices = geom_1.convexHull(util_1.values(g.vertices));
    hullVertices.map(geom_1.getConsecutiveCoordPairs).forEach(function (pair) {
        if (planar_graph_1.safeAddEdge(g, pair[0], pair[1])) {
            g = animAddEdge(g, pair);
        }
    });
    return g;
};
var getBestSplittingEdge = function (g, edgeKeys, faceKey) {
    var mostDist = -1;
    var bestPair = [];
    var potentialEdges = edgeKeys.map(function (eKey) { return [
        g.edges[eKey].origin,
        g.edges[g.edges[g.edges[eKey].next].next].origin
    ]; });
    var faceVertices = edgeKeys.map(function (eKey) { return g.vertices[g.edges[eKey].origin]; });
    for (var i = 0; i < potentialEdges.length; i++) {
        var v1 = g.vertices[potentialEdges[i][0]];
        var v2 = g.vertices[potentialEdges[i][1]];
        if (planar_graph_1.getSplitFaceKey(g, v1, v2) === faceKey) {
            var dist = minDist(faceVertices, v1, v2);
            if (dist > mostDist) {
                mostDist = dist;
                bestPair = [v1, v2];
            }
        }
    }
    return bestPair;
};
var splitFace = function (g, faceKey) {
    var edges = planar_graph_1.getBoundaryEdgeKeys(g, faceKey);
    if (edges.length > 3 && g.infiniteFace !== faceKey) {
        var e = getBestSplittingEdge(g, edges, faceKey);
        g = animAddEdge(g, e);
    }
    return g;
};
var isTriangulated = function (g) {
    return Object.keys(g.faces).every(function (fKey) { return g.infiniteFace === fKey || planar_graph_1.getBoundaryEdgeKeys(g, fKey).length === 3; });
};
var triangulate = function (g) {
    while (!isTriangulated(g)) {
        for (var fKey in g.faces) {
            if (planar_graph_1.getBoundaryEdgeKeys(g, fKey).length > 3) {
                g = splitFace(g, fKey);
            }
        }
    }
    animation_1.addStep(animation_1.AnimationType.DescribeAddEdges, 0, explanation_1.EXPLANATIONS.addEdges);
    return g;
};
var preColor = function (g) {
    var boundingVertices = planar_graph_1.getBoundaryVertexKeys(g, g.infiniteFace);
    g.mark1 = boundingVertices[0];
    g.mark2 = boundingVertices[1];
    animation_1.addStep(animation_1.AnimationType.Describe, 2000, explanation_1.EXPLANATIONS.fiveChoices);
    Object.keys(g.vertices).forEach(function (vKey) {
        g = updateColors(g, vKey, planar_graph_1.ALL_COLORS, 0);
    });
    animation_1.addStep(animation_1.AnimationType.Describe, 2000, explanation_1.EXPLANATIONS.restrictOuter);
    boundingVertices.forEach(function (vKey) { return (g = updateColors(g, vKey, planar_graph_1.ALL_COLORS.slice(0, 3), 0)); });
    animation_1.addStep(animation_1.AnimationType.Pause, 1000, {});
    g = updateColors(g, g.mark1, [planar_graph_1.Color.Red], 0);
    g = updateColors(g, g.mark2, [planar_graph_1.Color.Blue], 0);
    animation_1.addStep(animation_1.AnimationType.DescribePreColor, 2000, explanation_1.EXPLANATIONS.endPreColor);
    return g;
};
var updateColors = function (g, vKey, colors, time) {
    animation_1.addStep(animation_1.AnimationType.UpdateColors, time, {
        vertex: g.vertices[vKey],
        colors: colors
    });
    return planar_graph_1.setColors(g, vKey, colors);
};
var colorTriangle = function (g) {
    var badColors = [planar_graph_1.getColors(g, g.mark1)[0], planar_graph_1.getColors(g, g.mark2)[0]];
    var thirdVertexKey = util_1.difference(Object.keys(g.vertices), [
        g.mark1,
        g.mark2
    ])[0];
    var okayColor = util_1.difference(planar_graph_1.getColors(g, thirdVertexKey), badColors)[0];
    animation_1.addStep(animation_1.AnimationType.DescribeTriangle, 800, explanation_1.EXPLANATIONS.baseCase);
    var newGraph = updateColors(g, thirdVertexKey, [okayColor], 100);
    animation_1.addStep(animation_1.AnimationType.Pause, 300, {});
    return newGraph;
};
var transferColors = function (graph, subGraph) {
    var newGraph = util_1.cloneDeep(graph);
    Object.keys(subGraph.vertices).forEach(function (vKey) {
        newGraph = planar_graph_1.setColors(newGraph, vKey, planar_graph_1.getColors(subGraph, vKey));
    });
    return newGraph;
};
var colorChordlessGraph = function (g) {
    var boundaryVertices = planar_graph_1.getBoundaryVertexKeys(g, g.infiniteFace);
    var vp = planar_graph_1.findVp(g);
    var twoColors = util_1.difference(planar_graph_1.getColors(g, vp), planar_graph_1.getColors(g, g.mark1)).slice(0, 2);
    animation_1.addStep(animation_1.AnimationType.DescribeChordlessOne, 800, explanation_1.EXPLANATIONS.chordlessPartOne);
    var updatedGraph = updateColors(g, vp, twoColors, 800);
    var subGraph = planar_graph_1.removeVertex(updatedGraph, vp);
    var vp1;
    animation_1.addStep(animation_1.AnimationType.DescribeChordlessTwo, 800, explanation_1.EXPLANATIONS.chordlessPartTwo);
    planar_graph_1.getAdjacentVertices(g, vp).forEach(function (vKey) {
        if (!boundaryVertices.includes(vKey)) {
            subGraph = updateColors(subGraph, vKey, util_1.difference(planar_graph_1.getColors(subGraph, vKey), twoColors).slice(0, 3), 300);
        }
        else if (vKey !== g.mark1) {
            vp1 = vKey;
        }
    });
    animation_1.addStep(animation_1.AnimationType.DescribeChordlessThree, 800, explanation_1.EXPLANATIONS.chordlessPartThree);
    subGraph = color(subGraph);
    var newGraph = transferColors(updatedGraph, subGraph);
    animation_1.addStep(animation_1.AnimationType.RestrictGraph, 0, { graph: newGraph });
    animation_1.addStep(animation_1.AnimationType.DescribeChordlessFour, 800, explanation_1.EXPLANATIONS.chordlessPartFour);
    newGraph = updateColors(newGraph, vp, util_1.difference(twoColors, planar_graph_1.getColors(newGraph, vp1)).slice(0, 1), 800);
    animation_1.addStep(animation_1.AnimationType.Pause, 300, {});
    return newGraph;
};
var colorChordedGraph = function (g, chordKey) {
    animation_1.addStep(animation_1.AnimationType.HighlightEdge, 800, planar_graph_1.getEndpoints(g, chordKey).map(function (vKey) { return g.vertices[vKey]; }));
    animation_1.addStep(animation_1.AnimationType.DescribeChorded, 800, explanation_1.EXPLANATIONS.chorded);
    animation_1.addStep(animation_1.AnimationType.UnhighlightEdge, 0, null);
    var _a = planar_graph_1.splitChordedGraph(g, chordKey), firstSubgraph = _a[0], secondSubgraph = _a[1];
    firstSubgraph = color(firstSubgraph);
    secondSubgraph = updateColors(secondSubgraph, secondSubgraph.mark1, planar_graph_1.getColors(firstSubgraph, secondSubgraph.mark1), 800);
    secondSubgraph = updateColors(secondSubgraph, secondSubgraph.mark2, planar_graph_1.getColors(firstSubgraph, secondSubgraph.mark2), 800);
    animation_1.addStep(animation_1.AnimationType.HighlightEdge, 800, planar_graph_1.getEndpoints(g, chordKey).map(function (vKey) { return g.vertices[vKey]; }));
    animation_1.addStep(animation_1.AnimationType.UnhighlightEdge, 0, null);
    secondSubgraph = color(secondSubgraph);
    var newGraph = transferColors(g, firstSubgraph);
    newGraph = transferColors(newGraph, secondSubgraph);
    animation_1.addStep(animation_1.AnimationType.Pause, 300, {});
    return newGraph;
};
var color = function (g) {
    animation_1.addStep(animation_1.AnimationType.RestrictGraph, 0, { graph: g });
    animation_1.addStep(animation_1.AnimationType.Pause, 300, {});
    if (util_1.values(g.vertices).length == 3) {
        return colorTriangle(g);
    }
    else {
        var chord = planar_graph_1.findChordKey(g);
        if (chord) {
            return colorChordedGraph(g, chord);
        }
        else {
            return colorChordlessGraph(g);
        }
    }
};
exports.fiveColor = function (graph) {
    animation_1.resetAnimation();
    animation_1.addStep(animation_1.AnimationType.Begin, 0, {});
    var coloredGraph = color(preColor(triangulate(hullify(graph))));
    animation_1.addStep(animation_1.AnimationType.RestrictGraph, 0, { graph: coloredGraph });
    animation_1.addStep(animation_1.AnimationType.Describe, 0, explanation_1.EXPLANATIONS.finished);
    animation_1.addStep(animation_1.AnimationType.End, 0, {});
    animation_1.postProcessAnimation();
    return coloredGraph;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*global define:false */
/**
 * Copyright 2012-2017 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.6.1
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    // Check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // This needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _MAP[i + 96] = i.toString();
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function(character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function() {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    Mousetrap.addKeycodes = function(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                _MAP[key] = object[key];
            }
        }
        _REVERSE_MAP = null;
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function() {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function(method) {
                    return function() {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return Mousetrap;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(0);
var readable = {
    addEdges: "Add edges so that the graph is triangulated and 2-connected (i.e.\n  can't be disconnected by removing one edge or vertex). Adding edges only makes\n  our problem harder; a coloring of the new graph will work as a coloring of the\n  original graph.",
    fiveChoices: "Begin with vertices having five possible colors",
    restrictOuter: "Restrict outer vertices to three possible colors",
    endPreColor: "Color two adjacent outer vertices red and blue. Note that the\n  interior vertices have five possible colors, two outer vertices are colored,\n  and the rest of the outer vertices have three possible colors.\n  This will be an invariant throughout the recursive algorithm.",
    baseCase: "The triangle is the base case of our algorithm. As promised by our\n  invariant, it has two colored vertices and one vertex with three choices.\n  So we can always color the third vertex.",
    chordlessPartOne: "There is no chord... Find a vertex on the outside of the\n  graph that is a neighbor of a colored vertex and restrict it to two colors,\n  not including the color of the colored vertex.",
    chordlessPartTwo: "Ensure that the neighbors of the vertex in the interior of\n  the graph can't be colored with those two colors. Only one of this vertex's\n  neighbors can be colored with even one of the two colors, so we will be able\n  to come back and properly color this vertex.",
    chordlessPartThree: "Recursively color the graph with the vertex removed",
    chordlessPartFour: "Color the vertex we removed",
    chorded: "There is a chord; split the graph and recursively color the subgraphs",
    finished: "We're done!"
};
exports.EXPLANATIONS = util_1.mapValues(readable, function (str) { return str.replace("\n", ""); });


/***/ })
/******/ ]);