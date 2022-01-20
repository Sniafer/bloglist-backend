const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Post = require("../models/post");
const middleware = require("../utils/middleware");

//Blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    const user = request.user;

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: "unauthorized request" });
    }
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    likes: body.likes,
  };

  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(201).json(updated);
});

//Comments
blogsRouter.post(
  "/:id/comments",
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body;
    const blog = await Blog.findById(request.params.id);
    const user = request.user;

    const post = new Post({
      text: body.text,
      user: user._id,
      blog: blog._id,
    });
    const savedPost = await post.save();

    response.status(201).json(savedPost);
  }
);

blogsRouter.get("/:id/comments", async (request, response) => {
  const posts = await Post.find({ blog: { _id: request.params.id } }).populate(
    "user",
    { username: 1, name: 1 }
  );
  response.json(posts);
});

blogsRouter.delete(
  "/:id/comments/:id",
  middleware.userExtractor,
  async (request, response) => {
    const post = await Post.findById(request.params.id);
    const user = request.user;

    if (post.user.toString() === user.id.toString()) {
      await Post.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: "unauthorized request" });
    }
  }
);

module.exports = blogsRouter;
