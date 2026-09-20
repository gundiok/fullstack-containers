import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import Todo from "./Todo";

test("Todo text is rendered", () => {
  const todo = {
    text: "Write code",
  };

  const mockhandler1 = vi.fn();
  const mockhandler2 = vi.fn();

  render(
    <Todo
      todo={todo}
      onClickComplete={mockhandler1}
      onClickDelete={mockhandler2}
    />,
  );

  const todoText = screen.getByText("Write code", { exact: false });
  expect(todoText).toBeDefined();
});
