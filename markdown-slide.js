#!/usr/bin/env node

var util = require("util");
var path = require("path");
var bs = require("browser-sync").create();

if (process.argv.length < 3) {
    console.log(util.format("Usage: %s <markdown file>", path.basename(process.argv[1])));
    process.exit(1);
}

var markdownFile = process.argv[2];

bs.init({
    files: ["*.md"],
    server: {
        baseDir: "./",
        routes: {
            "/~": __dirname + "/index.html",
            "/~/slide.md": markdownFile,
            "/~/slide.js": __dirname + "/slide.js",
            "/~/slide.css": __dirname + "/slide.css",
        }
    },
    startPath: "/~",
    ghostMode: false,
    //logLevel: "debug",
});

