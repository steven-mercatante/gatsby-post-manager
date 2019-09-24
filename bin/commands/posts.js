const {
  getAllPostsData,
  getPostsDir,
  getPublishedPosts,
  getPendingPosts,
  getUnpublishedPosts,
  render
} = require("../utils");

module.exports = {
  command: "posts",
  aliases: ["p"],
  desc: "list posts",
  builder: yargs => {
    return yargs.commandDir("posts_commands").options({
      p: {
        alias: "published",
        boolean: true,
        default: false
      },
      e: {
        alias: "pending",
        boolean: true,
        default: false
      },
      u: {
        alias: "unpublished",
        boolean: true,
        default: false
      }
    });
  },
  handler: argv => {
    const { published, pending, unpublished } = argv;
    const postsDir = getPostsDir(argv.dir);

    if (!published && !pending && !unpublished) {
      render(getAllPostsData(postsDir), { showStatus: true });
    } else if (published) {
      const posts = getAllPostsData(postsDir);
      render(getPublishedPosts(posts));
    } else if (pending) {
      const posts = getAllPostsData(postsDir);
      render(getPendingPosts(posts));
    } else if (unpublished) {
      const posts = getAllPostsData(postsDir);
      render(getUnpublishedPosts(posts));
    }
  }
};
