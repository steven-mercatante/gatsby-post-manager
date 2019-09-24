const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const titleize = require("titleize");
const slugify = require("@sindresorhus/slugify");
const { getCurrentDate, colors } = require("../../utils");

module.exports = {
  command: "new <dir> <title>",
  handler: argv => {
    const { dir } = argv;
    const title = titleize(argv.title);
    const slug = slugify(title);
    const filename = `${slug}.md`; // TODO: pass opt to use custom extension (e.g `.mdx`)
    const filepath = path.join(dir, filename);
    const frontmatter = `---
title: ${title}
slug: '${slug}'
tags: []
published: false
date: '${getCurrentDate(false)}'
---

Add your content here
`;

    try {
      fs.writeFileSync(filepath, frontmatter, { flag: "wx" });
      console.log(chalk.hex(colors.green)(`${filepath} successfully created`));
    } catch (err) {
      console.log(chalk.hex(colors.red)(`${filepath} already exists`));
    }
  }
};
