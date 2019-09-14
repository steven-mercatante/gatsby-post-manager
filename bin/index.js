#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const frontmatter = require("front-matter");
const yargs = require("yargs");
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
function getAllPostsData(postsDir) {
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

function getPublishedPosts(postsDir) {
  return getAllPostsData(postsDir).filter(post => {
    return post.published === true && new Date(post.date) <= getCurrentDate();
  });
}

function getPendingPosts(postsDir) {
  return getAllPostsData(postsDir)
    .filter(post => {
      return post.published === true && new Date(post.date) > getCurrentDate();
    })
    .reverse();
}

function getUnpublishedPosts(postsDir) {
  return getAllPostsData(postsDir)
    .filter(post => post.published !== true)
    .reverse();
}

function render(posts, opts = {}) {
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
      const postDate = post.date ? post.date : "N/A";
      const postTitle = post.title ? post.title : "N/A";
      const row = [idx + 1, chalk.hex(postTypeColor)(postDate), postTitle];
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

function getPostsDir(dir = ".") {
  let postsDir;
  if (path.isAbsolute(dir)) {
    postsDir = dir;
  } else {
    postsDir = path.join(process.cwd(), dir);
  }
  return postsDir;
}

yargs
  .option("dir", { alias: "d", description: "directory where posts live" })
  .command({
    command: "posts [status]",
    aliases: ["p"],
    desc:
      'list posts with optional status (one of: "all", "published", "pending", "unpublished")',
    builder: yargs => yargs.default("status", "all"),
    handler: argv => {
      const postsDir = getPostsDir(argv.dir);
      switch (argv.status) {
        case "all": {
          render(getAllPostsData(postsDir), { showStatus: true });
          break;
        }
        case "published": {
          render(getPublishedPosts(postsDir));
          break;
        }

        case "pending": {
          render(getPendingPosts(postsDir));
          break;
        }

        case "unpublished": {
          render(getUnpublishedPosts(postsDir));
          break;
        }

        default: {
          console.log(
            chalk.hex(colors.red)(`Invalid value for status: '${argv.status}'`)
          );
        }
      }
    }
  })
  .command({
    command: "post-stats",
    aliases: ["ps"],
    desc: "display stats for all posts",
    handler: argv => {
      const postsDir = getPostsDir(argv.dir);
      getStats(getAllPostsData(postsDir));
    }
  })
  .demandCommand()
  .help().argv;
