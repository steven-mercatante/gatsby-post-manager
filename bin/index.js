#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const program = require("commander");
const frontmatter = require("front-matter");
const Table = require("cli-table");

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
  }
  if (post.published === true && new Date(post.date) > getCurrentDate()) {
    return "pending";
  }
  return "unpublished";
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

function render(header, posts, opts = {}) {
  console.log(chalk.hex(colors.green).bold(header));

  const tableHeader = ["#", "Date", "Title"];
  const { showStatus } = opts;
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

function publishedStr(str) {
  return chalk.hex(postTypeColors.published)(str);
}
function pendingStr(str) {
  return chalk.hex(postTypeColors.pending)(str);
}
function unpublishedStr(str) {
  return chalk.hex(postTypeColors.unpublished)(str);
}

function getStats(posts) {
  const stats = posts.reduce(
    (acc, post) => {
      const postStatus = getPostStatus(post);
      acc[postStatus] += 1;
      return acc;
    },
    { published: 0, pending: 0, unpublished: 0 }
  );
  const table = new Table({
    head: ["Post Status", "# Posts"]
  });

  table.push([publishedStr("Published"), publishedStr(stats.published)]);
  table.push([pendingStr("Pending"), pendingStr(stats.pending)]);
  table.push([
    unpublishedStr("Unpublished"),
    unpublishedStr(stats.unpublished)
  ]);
  console.log(table.toString());
}

program
  .option("-d, --dir <path>", "directory where posts live", ".")
  .option(
    "-p, --posts [status]",
    'list posts with optional status (one of: "all", "published", "pending", "unpublished")'
  )
  .option("-ps, --post-stats", "display stats for all posts")
  .parse(process.argv);

const { dir } = program.opts();
let postsDir;
if (path.isAbsolute(dir)) {
  postsDir = dir;
} else {
  postsDir = path.join(process.cwd(), program.opts().dir);
}

try {
  const postsDirStats = fs.statSync(postsDir);
  if (!postsDirStats.isDirectory(postsDir)) {
    throw "not a dir";
  }
} catch (err) {
  return console.log(
    chalk.hex(colors.red)(`Error: invalid directory ${postsDir}`)
  );
}

if (program.posts) {
  switch (program.posts) {
    case true:
    case "all": {
      render("All Posts", getAllPostsData(), { showStatus: true });
      break;
    }
    case "published": {
      render("Published Posts", getPublishedPosts());
      break;
    }

    case "pending": {
      render("Pending Posts", getPendingPosts());
      break;
    }

    case "unpublished": {
      render("Unpublished Posts", getUnpublishedPosts());
      break;
    }

    default: {
      console.log(
        chalk.hex(colors.red)(`Invalid value for status: '${program.posts}'`)
      );
    }
  }
}

if (program.postStats) {
  getStats(getAllPostsData());
}

console.log(program.opts());
