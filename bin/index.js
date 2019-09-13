#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxed = require("boxen");
const yargs = require("yargs");

const options = yargs.usage("Usage: -n <name>").argv;

console.log(chalk.green.bold("hi"));

const postsDir = "/Users/steve/sites/stevemerc.com/content/posts";

// Find all index.md files in postsDir, at least one level deep (first level is the article name)

// fs.readdirSync(postsDir, (err, items) => {
//   console.log(items);
//   items.forEach(item => {
//     const fullPath = path.join(postsDir, item);
//     console.log(fullPath);
//   });
// });

const dirs = fs
  .readdirSync(postsDir)
  .map(postDir => path.join(postsDir, postDir))
  .forEach(postDir => {
    // console.log(postDir);
    const post = path.join(postDir, "index.md");
    // console.log(post);
    const postContents = fs.readFileSync(post, "utf8");
    console.log(postContents);
  });
