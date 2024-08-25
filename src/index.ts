import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import auth from "./auth/auth";

const app = new Hono();

app.route("/auth", auth);

const blogPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the first post",
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the second post",
  },
  {
    id: 3,
    title: "Third Post",
    content: "This is the third post",
  },
];

app.use("*", prettyJSON());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/posts", (c) => {
  return c.json(blogPosts);
});

app.get("/posts/:id", (c) => {
  const { id } = c.req.param();
  const post = blogPosts.find((post) => post.id === Number(id));
  if (post) {
    return c.json(post);
  } else {
    return c.json({ message: "Post not found" }, 404);
  }
});

app.post("/posts", async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const post = { id: blogPosts.length + 1, title, content };
  blogPosts.push(post);
  return c.json(post);
});

app.put("/posts/:id", async (c) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const post = blogPosts.find((post) => post.id === Number(id));
  if (post) {
    post.title = title;
    post.content = content;
    return c.json(post);
  } else {
    return c.json({ message: "Post not found" }, 404);
  }
});

app.delete("/posts/:id", (c) => {
  const { id } = c.req.param();
  const post = blogPosts.find((post) => post.id === Number(id));
  if (post) {
    blogPosts.splice(blogPosts.indexOf(post), 1);
    return c.json({ message: "Post deleted" });
  } else {
    return c.json({ message: "Post not found" }, 404);
  }
});

export default app;
