/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var planar_graph_1 = __webpack_require__(1);
var distance = function (v1, v2) {
    var s = function (x) { return x * x; };
    return Math.sqrt(s(v1.x - v2.x) + s(v1.y - v2.y));
};
var unitVector = function (v1, v2) {
    var d = distance(v1, v2);
    return { x: (v1.x - v2.x) / d, y: (v1.y - v2.y) / d };
};
var GraphDrawingWrapper = (function () {
    function GraphDrawingWrapper(canvasId, radius) {
        if (radius === void 0) { radius = 10; }
        this.radius = radius;
        this.canvasEl = document.getElementById(canvasId);
        this.drawCircle = this.drawCircle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.canvasEl.addEventListener("click", this.handleClick);
        this.graph = new planar_graph_1.PlanarGraph();
        this.highlightedVertex = null;
    }
    GraphDrawingWrapper.prototype.clickVertex = function (v) {
        if (this.highlightedVertex) {
            this.drawEdge(v, this.highlightedVertex);
            this.drawCircle(this.highlightedVertex);
            this.highlightedVertex = null;
        }
        else {
            this.highlightedVertex = v;
            this.drawCircle(v, "red");
        }
    };
    GraphDrawingWrapper.prototype.drawCircle = function (v, strokeColor, fillColor) {
        if (strokeColor === void 0) { strokeColor = "black"; }
        if (fillColor === void 0) { fillColor = null; }
        this.graph.addVertex(v);
        var context = this.canvasEl.getContext('2d');
        context.strokeStyle = strokeColor;
        context.fillStyle = fillColor || "none";
        context.beginPath();
        context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        if (fillColor)
            context.fill();
    };
    GraphDrawingWrapper.prototype.drawEdge = function (v1, v2, strokeColor) {
        if (strokeColor === void 0) { strokeColor = "black"; }
        if (this.graph.addEdge(v1, v2)) {
            var context = this.canvasEl.getContext('2d');
            var unit = unitVector(v1, v2);
            context.strokeStyle = strokeColor;
            context.beginPath();
            context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
            context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
            context.stroke();
        }
    };
    GraphDrawingWrapper.prototype.handleClick = function (e) {
        var _this = this;
        var newVertex = { x: e.x, y: e.y, colors: [] };
        var clickedVertex;
        var overlappingVertex;
        this.graph.vertices.forEach(function (v) {
            var dist = distance(v, newVertex);
            if (dist <= _this.radius)
                clickedVertex = v;
            if (dist <= 2 * _this.radius)
                overlappingVertex = v;
        });
        if (clickedVertex) {
            this.clickVertex(clickedVertex);
        }
        else if (!overlappingVertex) {
            this.drawCircle(newVertex);
        }
    };
    return GraphDrawingWrapper;
}());
exports.GraphDrawingWrapper = GraphDrawingWrapper;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// coordinate equality
var eq = function (a, b) { return (a.x === b.x && a.y === b.y); };
// 2-dimensional cross product
var xProd = function (v1, v2) { return (v1.x * v2.y - v1.y * v2.x); };
// dot product
var dot = function (v1, v2) { return (v1.x * v2.x + v1.y + v2.y); };
// Do the line segments from v1-v2 and v3-v4 intersect?
exports.intersect = function (v1, v2, v3, v4) {
    var r = { x: v2.x - v1.x, y: v2.y - v1.y };
    var s = { x: v4.x - v3.x, y: v4.y - v3.y };
    var diff = { x: v3.x - v1.x, y: v3.y - v1.y };
    var det = xProd(r, s);
    if (det !== 0) {
        var t = xProd(diff, r) / det;
        var u = xProd(diff, s) / det;
        var interior = function (x) { return (0 < x && x < 1); };
        var boundary = function (x) { return (x === 0 || x === 1); };
        if (interior(t) && interior(u)) {
            // the segments intersect
            return true;
        }
        else if (boundary(t) || boundary(u)) {
            // three points are collinear
            return (interior(t) || interior(u));
        }
        else {
            return false;
        }
    }
    else {
        if (xProd(diff, r) !== 0) {
            // parallel, non-collinear
            return false;
        }
        else {
            // all 4 points collinear
            var t0 = dot(diff, r) / dot(r, r);
            var t1 = t0 + dot(s, r) / dot(r, r);
            return (Math.max(t0, t1) > 0 && Math.min(t0, t1) < 1);
        }
    }
};
// Is v in the interior of polygon?
exports.inInterior = function (polygon, v) {
    return true;
};
var PlanarGraph = (function () {
    function PlanarGraph() {
        this.vertices = [];
        this.edges = [];
        this.infiniteFace = { infinite: true };
        this.faces = [this.infiniteFace];
    }
    PlanarGraph.prototype.addVertex = function (v) {
        this.vertices.push(v);
    };
    PlanarGraph.prototype.addEdge = function (v1, v2) {
        return true;
    };
    PlanarGraph.prototype.checkEdge = function (v1, v2) {
    };
    PlanarGraph.prototype.getBoundaryEdges = function (f) {
        var boundaryEdges = [];
        if (f.incidentEdge) {
            var currentEdge = f.incidentEdge;
            while (!boundaryEdges.indexOf(currentEdge)) {
                boundaryEdges.push(currentEdge);
                currentEdge = currentEdge.next;
            }
        }
        return boundaryEdges;
    };
    PlanarGraph.prototype.getIncidentFaces = function (v) {
        var _this = this;
        var incidentFaces = [];
        if (v.incidentEdge) {
            var currentEdge = v.incidentEdge;
            while (!incidentFaces.indexOf(currentEdge.incidentFace)) {
                incidentFaces.push(currentEdge.incidentFace);
                currentEdge = currentEdge.twin.next;
            }
        }
        else {
            var boundingFace_1;
            this.faces.forEach(function (f) {
                if (!f.infinite &&
                    exports.inInterior(_this.getBoundaryEdges(f).map(function (e) { return e.origin; }), v)) {
                    boundingFace_1 = f;
                }
            });
            boundingFace_1 = boundingFace_1 || this.infiniteFace;
            incidentFaces.push(boundingFace_1);
        }
        return incidentFaces;
    };
    return PlanarGraph;
}());
exports.PlanarGraph = PlanarGraph;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canvas_wrapper_1 = __webpack_require__(0);
document.addEventListener('DOMContentLoaded', function () {
    var wrapper = new canvas_wrapper_1.GraphDrawingWrapper("canvas");
});


/***/ })
/******/ ]);