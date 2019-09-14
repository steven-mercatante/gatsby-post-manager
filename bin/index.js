#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxed = require("boxen");
const yargs = require("yargs");
const frontmatter = require("front-matter");
const Table = require("cli-table");

const options = yargs.usage("Usage: -n <name>").argv;

//! DON'T HARDCODE
const postsDir = "/Users/steve/sites/stevemerc.com/content/posts";

/**
 * Returns the current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const d = new Date();

  let month = (d.getMonth() + 1).toString();
  if (month.length < 2) {
    month = `0${month}`;
  }

  let day = d.getDate().toString();
  if (day.length < 2) {
    day = `0${day}`;
  }

  return `${d.getFullYear()}-${month}-${day}`;
}

// TODO: order posts by date

function getAllPostsData() {
  return fs
    .readdirSync(postsDir)
    .map(postDir => path.join(postsDir, postDir))
    .reduce((acc, postDir) => {
      const post = path.join(postDir, "index.md"); // TODO: should also support .mdx
      const postContents = fs.readFileSync(post, "utf8");
      const fm = frontmatter(postContents);
      acc.push(fm.attributes);
      return acc;
    }, [])
    .sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      }
      if (new Date(a.date) < new Date(b.date)) {
        return 1;
      }
      return 0;
    });
}

function getPublishedPosts() {
  return getAllPostsData().filter(post => {
    return (
      post.published === true &&
      new Date(post.date) <= new Date(getCurrentDate())
    );
  });
}

function getPendingPosts() {
  return getAllPostsData()
    .filter(post => {
      return (
        post.published === true &&
        new Date(post.date) > new Date(getCurrentDate())
      );
    })
    .reverse();
}

function getUnpublishedPosts() {
  return getAllPostsData()
    .filter(post => post.published !== true)
    .reverse();
}

function render(header, posts) {
  console.log(chalk.green.bold(header));
  const table = new Table({
    head: ["#", "Date", "Title"]
  });

  if (posts.length > 0) {
    posts.forEach((post, idx) => {
      table.push([idx + 1, post.date, post.title]);
    });
    console.log(table.toString());
  } else {
    console.log(chalk.red("No results"));
  }
}

// render("Published Posts", getPublishedPosts());
render("Pending Posts", getPendingPosts());
// render("Unpublished Posts", getUnpublishedPosts());
