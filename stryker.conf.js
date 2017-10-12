var tsconfig = require("./tsconfig.json");

module.exports = function(config) {
  config.set({
    files: [
      {
        pattern: "src/geom.ts",
        mutated: true,
        included: false
      },
      {
        pattern: "src/planar_graph.ts",
        mutated: true,
        included: false
      },
      {
        pattern: "src/thomassen.ts",
        mutated: true,
        included: false
      },
      { 
        pattern: "src/*.ts",
        mutated: false,
        included: false
      },
      "test/**/*.ts"
    ],
    mutate: ["src/geom.ts", "src/planar_graph.ts", "src/thomassen.ts"],
    tsconfig: tsconfig,
    mutator: 'typescript',
    testRunner: "jest",
    reporter: ["clear-text", "progress"],
    transpilers: ['typescript'],
    coverageAnalysis: "off"
  });
};
