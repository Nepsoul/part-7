import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blog", () => {
  const blog = {
    title: "climate change",
    author: "Robert patrition",
    url: "url.com",
    likes: 10,
  };
  const { container } = render(<Blog blog={blog} />);
  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent("climate change");
  expect(div).toHaveTextContent("Robert patrition");
});

test("clicking the button calls event handler once", async () => {
  const blog = {
    title: "climate change",
    author: "Robert patrition",
    url: "url.com",
    likes: 10,
    user: {
      username: "prapti",
      name: "prapti magar",
      id: "iamsuperawesome",
    },
  };
  const User = {
    username: "prapti",
    name: "prapti magar",
    id: "iamsuperawesome",
  };

  const { container } = render(<Blog blog={blog} user={User} />);
  const user = userEvent.setup();
  const button = container.querySelector(".view");

  await user.click(button);

  const url = container.querySelector(".url");
  const likes = container.querySelector(".likes");

  expect(url).toHaveTextContent("url.com");
  expect(likes).toHaveTextContent("likes");
});

test("Clicking the like button event handler for twice", async () => {
  const blogs = [
    {
      title: "climate change",
      author: "Robert patrition",
      url: "url.com",
      likes: 10,
      user: {
        username: "prapti",
        name: "prapti magar",
        id: "iamsuperawesome",
      },
    },
  ];
  const blog = {
    title: "climate change",
    author: "Robert patrition",
    url: "url.com",
    likes: 10,
    user: {
      username: "prapti",
      name: "prapti magar",
      id: "iamsuperawesome",
    },
  };
  const User = {
    username: "prapti",
    name: "prapti magar",
    id: "iamsuperawesome",
  };

  const likeMockHandler = jest.fn();

  const { container } = render(
    <Blog blog={blog} user={User} blogs={blogs} updateLikes={likeMockHandler} />
  );
  //   console.log(container);

  const user = userEvent.setup();
  const viewButton = container.querySelector(".view");
  await user.click(viewButton);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(likeMockHandler.mock.calls).toHaveLength(2);
});
