const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const frontmatter = require("front-matter");
const Table = require("cli-table");
const glob = require("glob");

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

function getAllPostsData(postsDir) {
  return glob
    .sync(`${postsDir}/**/index.{md,mdx}`)
    .reduce((acc, file) => {
      try {
        const postContents = fs.readFileSync(file, "utf8");
        const fm = frontmatter(postContents);
        acc.push(fm.attributes);
      } catch (err) {}
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
function getPostsDir(dir = ".") {
  let postsDir;
  if (path.isAbsolute(dir)) {
    postsDir = dir;
  } else {
    postsDir = path.join(process.cwd(), dir);
  }

  try {
    const postsDirStats = fs.statSync(postsDir);
    if (!postsDirStats.isDirectory()) {
      throw "not a dir";
    }
  } catch (err) {
    console.log(chalk.hex(colors.red)(`Error: invalid directory ${postsDir}`));
    process.exit();
  }

  return postsDir;
}

module.exports = {
  getAllPostsData,
  getCurrentDate,
  getPostsDir,
  getPostStatus,
  publishedStr,
  pendingStr,
  unpublishedStr,
  render
};
