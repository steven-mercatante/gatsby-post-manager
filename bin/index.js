#!/usr/bin/env node

const yargs = require("yargs");
const Table = require("cli-table");

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

yargs
  .option("dir", { alias: "d", description: "directory where posts live" })
  .command(require("./commands/posts"))
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
