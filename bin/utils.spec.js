const {
  getPublishedPosts,
  getPendingPosts,
  getUnpublishedPosts
} = require("./utils");

const publishedPost1 = {
  title: "Published 1",
  date: "2014-09-24",
  published: true
};
const publishedPost2 = {
  title: "Published 2",
  date: "2014-09-24",
  published: true
};
const pendingPost1 = {
  title: "Pending 1",
  date: "2024-09-24",
  published: true
};
const unpublishedPost1 = {
  title: "Unpublished 1",
  date: "2014-09-24",
  published: false
};

const posts = [publishedPost1, publishedPost2, pendingPost1, unpublishedPost1];

test("getPublishedPosts returns published posts", () => {
  const publishedPosts = getPublishedPosts(posts);
  const expected = [publishedPost1, publishedPost2];
  expect(publishedPosts).toEqual(expected);
});

test("getPendingPosts returns pending posts", () => {
  const pendingPosts = getPendingPosts(posts);
  const expected = [pendingPost1];
  expect(pendingPosts).toEqual(expected);
});

test("getUnpublishedPosts returns unpublished posts", () => {
  const unpublishedPosts = getUnpublishedPosts(posts);
  const expected = [unpublishedPost1];
  expect(unpublishedPosts).toEqual(expected);
});
