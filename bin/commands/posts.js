const {
  getAllPostsData,
  getCurrentDate,
  getPostsDir,
  render
} = require("../utils");

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

module.exports = {
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
        process.exit();
      }
    }
  }
};
