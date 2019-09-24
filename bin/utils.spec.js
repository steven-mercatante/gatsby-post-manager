const {
  getPublishedPosts,
  getPendingPosts,
  getUnpublishedPosts,
  getPostStatus,
  statuses
} = require("./utils");

const publishedPost1 = {
  title: "Published 1",
  date: "2014-09-24",
  published: true
};
const publishedPost2 = {
  title: "Published 2",
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
const unpublishedPost2 = {
  title: "Unpublished 2",
  published: false
};
const unpublishedPost3 = {
  title: "Unpublished 3"
};

const allPosts = [
  publishedPost1,
  publishedPost2,
  pendingPost1,
  unpublishedPost1,
  unpublishedPost2,
  unpublishedPost3
];

test("getPublishedPosts returns published posts", () => {
  const publishedPosts = getPublishedPosts(allPosts);
  console.log("publishedPosts:", publishedPosts);
  const expected = [publishedPost1, publishedPost2];
  expect(publishedPosts).toEqual(expected);
});

test("getPendingPosts returns pending posts", () => {
  const pendingPosts = getPendingPosts(allPosts);
  const expected = [pendingPost1];
  expect(pendingPosts).toEqual(expected);
});

test("getUnpublishedPosts returns unpublished posts", () => {
  const unpublishedPosts = getUnpublishedPosts(allPosts);
  const expected = [unpublishedPost1, unpublishedPost2, unpublishedPost3];
  expect(unpublishedPosts).toEqual(expected);
});

test("getPostStatus returns the correct status", () => {
  expect(getPostStatus(publishedPost1)).toEqual(statuses.published);
  expect(getPostStatus(publishedPost2)).toEqual(statuses.published);

  expect(getPostStatus(pendingPost1)).toEqual(statuses.pending);

  expect(getPostStatus(unpublishedPost1)).toEqual(statuses.unpublished);
  expect(getPostStatus(unpublishedPost2)).toEqual(statuses.unpublished);
  expect(getPostStatus(unpublishedPost3)).toEqual(statuses.unpublished);
});
