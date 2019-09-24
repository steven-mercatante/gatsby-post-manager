const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const frontmatter = require("front-matter");
const Table = require("cli-table");
const glob = require("glob");
const sortBy = require("lodash.sortby");

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

const statuses = {
  published: "published",
  pending: "pending",
  unpublished: "unpublished"
};

/**
 * Returns the current date in YYYY-MM-DD format
 */
function getCurrentDate(convertToDate = true) {
  const d = new Date();

  let month = (d.getMonth() + 1).toString();
  if (month.length < 2) {
    month = `0${month}`;
  }

  let day = d.getDate().toString();
  if (day.length < 2) {
    day = `0${day}`;
  }

  const strDate = `${d.getFullYear()}-${month}-${day}`;

  if (convertToDate) {
    return new Date(strDate);
  } else {
    return strDate;
  }
}

function getPostStatus(post) {
  if (
    post.date &&
    new Date(post.date) <= getCurrentDate() &&
    post.published === true
  ) {
    return statuses.published;
  }

  if (
    post.date &&
    new Date(post.date) > getCurrentDate() &&
    post.published === true
  ) {
    return statuses.pending;
  }

  if (post.published === true) {
    return statuses.published;
  }

  return statuses.unpublished;
}

function getAllPostsData(postsDir) {
  const postsGroupedByStatus = glob
    .sync(`${postsDir}/**/*.{md,mdx}`, { ignore: "**/node_modules/**" })
    .reduce((acc, file) => {
      try {
        const postContents = fs.readFileSync(file, "utf8");
        const fm = frontmatter(postContents);
        const status = getPostStatus(fm.attributes);
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(fm.attributes);
      } catch (err) {}
      return acc;
    }, {});

  const sortedPosts = Object.values(postsGroupedByStatus).reduce(
    (acc, posts) => {
      const sorted = sortBy(posts, ["date", "title"]);
      acc.push(...sorted);
      return acc;
    },
    []
  );

  return sortedPosts;
}

function getPublishedPosts(posts) {
  return posts.filter(post => {
    return getPostStatus(post) === statuses.published;
  });
}

function getPendingPosts(posts) {
  return posts.filter(post => {
    return getPostStatus(post) === statuses.pending;
  });
}

function getUnpublishedPosts(posts) {
  return posts.filter(post => getPostStatus(post) === statuses.unpublished);
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

function successMsg(msg) {
  console.log(chalk.hex(colors.green)(msg));
}

function errorMsg(msg) {
  console.log(chalk.hex(colors.red)(msg));
}

module.exports = {
  colors,
  getAllPostsData,
  getCurrentDate,
  getPostsDir,
  getPostStatus,
  getPublishedPosts,
  getPendingPosts,
  getUnpublishedPosts,
  publishedStr,
  pendingStr,
  unpublishedStr,
  render,
  successMsg,
  errorMsg,
  statuses
};
