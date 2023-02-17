import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const MockcreateBlog = jest.fn();
  const setMessage = jest.fn();

  render(<BlogForm createBlog={MockcreateBlog} setMessage={setMessage} />);

  const user = userEvent.setup();

  const title = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");

  //screen.debug(title, "title");
  const addButton = screen.getByText("create");

  await user.type(title, "testing for blogForm");
  await user.type(author, "nirvana");
  await user.type(url, "kathmandu.post");
  await user.click(addButton);

  //   console.log(MockcreateBlog);
  //   console.log(MockcreateBlog.mock);
  //   console.log(MockcreateBlog.mock.calls, "calls");
  //   console.log(MockcreateBlog.mock.calls[0][0], "indexing");

  expect(MockcreateBlog.mock.calls).toHaveLength(1);
  expect(MockcreateBlog.mock.calls[0][0].title).toBe("testing for blogForm");

  expect(MockcreateBlog.mock.calls[0][0].author).toBe("nirvana");

  expect(MockcreateBlog.mock.calls[0][0].url).toBe("kathmandu.post");
});
