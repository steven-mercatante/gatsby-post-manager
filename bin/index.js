#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const yargs = require("yargs");
const frontmatter = require("front-matter");
const Table = require("cli-table");

//! DON'T HARDCODE
const postsDir = "/Users/steve/sites/stevemerc.com/content/posts";
const colors = {
  blue: "#82AAFF",
  green: "#C3E88D",
  orange: "#E57A40",
  red: "#FF5370"
};
const postTypeColors = {
  published: colors.green,
  pending: colors.blue,
  unpublished: colors.orange
};

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

  return new Date(`${d.getFullYear()}-${month}-${day}`);
}

function getPostStatus(post) {
  if (post.published === true && new Date(post.date) <= getCurrentDate()) {
    return "published";
    // return chalk.hex(colors.green)("published");
  }
  if (post.published === true && new Date(post.date) > getCurrentDate()) {
    return "pending";
    // return chalk.hex(colors.blue)("pending");
  }
  return "unpublished";
  // return chalk.hex(colors.orange)("unpublished");
}

// TODO: this should recursively iterate over parent dir and collect all index.md[x] files
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
    return post.published === true && new Date(post.date) <= getCurrentDate();
  });
}

function getPendingPosts() {
  return getAllPostsData()
    .filter(post => {
      return post.published === true && new Date(post.date) > getCurrentDate();
    })
    .reverse();
}

function getUnpublishedPosts() {
  return getAllPostsData()
    .filter(post => post.published !== true)
    .reverse();
}

function render(header, posts, postType, opts = {}) {
  const { showStatus } = opts;
  console.log(chalk.hex(colors.green).bold(header));
  const tableHeader = ["#", "Date", "Title"];
  if (showStatus) {
    tableHeader.push("Status");
  }
  const table = new Table({
    head: tableHeader
  });

  if (posts.length > 0) {
    posts.forEach((post, idx) => {
      const postStatus = getPostStatus(post);
      const postTypeColor = postTypeColors[postStatus];
      const row = [idx + 1, chalk.hex(postTypeColor)(post.date), post.title];
      if (showStatus) {
        row.push(chalk.hex(postTypeColor)(postStatus));
      }
      table.push(row);
    });
    console.log(table.toString());
  } else {
    console.log(chalk.hex(colors.red)("No results"));
  }
}

yargs.command(
  "list [type]",
  "list posts",
  yargs => {
    yargs.positional("type", {
      describe: "one of: all, published, pending, unpublished",
      default: "all"
    });
  },
  argv => {
    switch (argv.type) {
      case "all": {
        render("All Posts", getAllPostsData(), "all", { showStatus: true });
        break;
      }

      case "published": {
        render("Published Posts", getPublishedPosts(), "published");
        break;
      }

      case "pending": {
        render("Pending Posts", getPendingPosts(), "pending");
        break;
      }

      case "unpublished": {
        render("Unpublished Posts", getUnpublishedPosts(), "unpublished");
        break;
      }

      default: {
        console.log(
          chalk.hex(colors.red)(`Error: unknown type '${argv.type}'`)
        );
      }
    }
  }
).argv;
