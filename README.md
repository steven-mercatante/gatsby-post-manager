# Gatsby Post Manager

Gatsby Post Manager (`gpm`) is a command line tool that helps keep track of Gatsby posts, and easily see which ones are published, pending, or unpublished.

## Installation

```bash
$ npm install -g gatsby-post-manager
```

## Usage

Please note that `gpm` is opinionated. It assumes that your posts:

- are named either `index.md` or `index.mdx`
- have a `published` boolean flag in their frontmatter
- have a `date` attribute (format: `YYYY-MM-DD`) in their frontmatter

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
```

### List all posts, including their status:

```bash
$ gpm -d content/ posts
# or
$ gpm -d content/ p
```

![gpm-all-posts](/images/gpm-all-posts.png)

### List posts whose `status` is one of: `published`, `pending`, or `unpublished`

```bash
$ gpm -d content/ posts [status]
# or
$ gpm -d content/ p [status]
```

![gpm-pending-posts](/images/gpm-pending-posts.png)

### Display post stats:

```bash
$ gpm -d content/ post-starts
# or
$ gpm -d content/ ps
```

![gpm-all-posts](/images/gpm-post-stats.png)
