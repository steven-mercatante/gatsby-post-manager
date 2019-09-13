#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxed = require("boxen");
const yargs = require("yargs");
const frontmatter = require("front-matter");

const options = yargs.usage("Usage: -n <name>").argv;

console.log(chalk.green.bold("hi"));

const postsDir = "/Users/steve/sites/stevemerc.com/content/posts";

function getAllPostsData() {
  return fs
    .readdirSync(postsDir)
    .map(postDir => path.join(postsDir, postDir))
    .reduce((acc, postDir) => {
      const post = path.join(postDir, "index.md");
      const postContents = fs.readFileSync(post, "utf8");
      const fm = frontmatter(postContents);
      acc.push(fm.attributes);
      return acc;
    }, []);
}

console.log(getAllPostsData());
