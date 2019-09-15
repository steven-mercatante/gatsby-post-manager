const {
  getAllPostsData,
  getPostsDir,
  getPublishedPosts,
  getPendingPosts,
  getUnpublishedPosts,
  render
} = require("../utils");

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
        const posts = getAllPostsData(postsDir);
        render(getPublishedPosts(posts));
        break;
      }

      case "pending": {
        const posts = getAllPostsData(postsDir);
        console.log(posts);
        render(getPendingPosts(posts));
        break;
      }

      case "unpublished": {
        const posts = getAllPostsData(postsDir);
        render(getUnpublishedPosts(posts));
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
