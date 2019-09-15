# Gatsby Post Manager

Gatsby Post Manager (`gpm`) is a command line tool that helps keep track of Gatsby posts, and easily see which ones are published, pending, or unpublished.

## Installation

```bash
$ npm install -g gatsby-post-manager
```

## Usage

List all posts, including their status:

```bash
$ gpm -d path/to/posts posts
# or
$ gpm -d path/to/posts p
```

![gpm-all-posts](/images/gpm-all-posts.png)

List posts whose `status` is one of: `published`, `pending`, or `unpublished`

```bash
$ gpm -d path/to/posts posts [status]
# or
$ gpm -d path/to/posts p [status]
```

![gpm-pending-posts](/images/gpm-pending-posts.png)

Display post stats:

```bash
$ gpm -d path/to/posts post-starts
# or
$ gpm -d path/to/posts ps
```

![gpm-all-posts](/images/gpm-post-stats.png)
