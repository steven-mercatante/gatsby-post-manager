const fs = require("fs");
const path = require("path");
const titleize = require("titleize");
const slugify = require("@sindresorhus/slugify");
const { getCurrentDate } = require("../../utils");

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

    // TODO: warn if file exists, or exit?
    fs.writeFileSync(filepath, frontmatter);
  }
};
