const { getAllPostsData, getPostsDir, render } = require("../utils");

exports.command = "posts [status]";

exports.aliases = ["p"];

exports.desc =
  'list posts with optional status (one of: "all", "published", "pending", "unpublished")';

exports.builder = yargs => yargs.default("status", "all");

exports.handler = argv => {
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
};
