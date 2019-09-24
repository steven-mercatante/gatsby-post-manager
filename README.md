# Gatsby Post Manager

[![npm badge](https://img.shields.io/npm/v/gatsby-post-manager)](https://www.npmjs.com/package/gatsby-post-manager)
[![travis badge](https://img.shields.io/travis/steven-mercatante/gatsby-post-manager)](https://travis-ci.org/steven-mercatante/gatsby-post-manager)

Gatsby Post Manager (`gpm`) is a command line tool that helps keep track of Gatsby posts, and easily see which ones are published, pending, or unpublished.

## Installation

```bash
$ npm install -g gatsby-post-manager
```

## Usage

`gpm` is opinionated - it assumes your posts:

- use the `.md` or `.mdx` file extensions
- have a required `published` boolean flag in their frontmatter
- have an optional `date` attribute (format: `YYYY-MM-DD`) in their frontmatter

### How does gpm determine post status?

- A post's status is `published` if its `published` attribute is `true`, and its `date` attribute is less than or equal to today's date (if the post has a `date` attribute)
- A post's status is `pending` if its `published` attribute is `true`, and its `date` attribute is greater than today's date (if the post has a `date` attribute)
- A post's status is `unpublished` if its `published` attribute is not `true`, or doesn't have a `published` attribute at all

`gpm` will recursively search the provided content path (the `--dir` option) for posts.

Below is my example directory structure. All `gpm` commands are invoked from the `site` root.

```
site/
├── content/
│   ├── posts/
│   |   ├── my-first-post/
│   |   |   └── index.md
│   |   ├── my-second-post/
│   |   |   └── index.mdx
│   |   └── my-third-post.md
```

### List all posts, including their status:

```bash
$ gpm -d content posts
# or
$ gpm -d content p
```

![gpm-all-posts](/images/gpm-all-posts.png)

### List posts whose `status` is one of: `published`, `pending`, or `unpublished`

```bash
# status flags: --published, --pending, --unpublished
$ gpm -d content posts --pending
# or
$ gpm -d content p --pending
```

![gpm-pending-posts](/images/gpm-pending-posts.png)

### Display post stats:

```bash
$ gpm -d content post-stats
# or
$ gpm -d content ps
```

![gpm-all-posts](/images/gpm-post-stats.png)
