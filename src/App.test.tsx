// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { App } from "./App";

beforeEach(() => window.history.replaceState(null, "", "/commits"));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("validates a branch name, retains it through navigation, and copies it", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  window.history.replaceState(null, "", "/branch");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  expect((screen.getByRole("button", { name: "Copy" }) as HTMLButtonElement).disabled).toBe(true);
  const description = screen.getByRole("textbox", { name: "Description" });
  fireEvent.change(description, { target: { value: "Add login" } });
  expect(description.getAttribute("aria-invalid")).toBe("true");
  expect((screen.getByRole("button", { name: "Copy" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(description, { target: { value: "add-login" } });
  expect(description.getAttribute("aria-invalid")).toBe("false");
  expect(description.getAttribute("aria-describedby")).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Comments" }));
  fireEvent.click(screen.getByRole("link", { name: "Branch" }));
  expect((screen.getByRole("textbox", { name: "Description" }) as HTMLInputElement).value).toBe(
    "add-login",
  );
  fireEvent.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("feature/add-login"));
});

test("opens comments directly, follows browser history, and preserves input through the title", async () => {
  window.history.replaceState(null, "", "/comments");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  expect(screen.getByRole("link", { name: "Comments" }).getAttribute("aria-current")).toBe("page");
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Clear naming." } });
  fireEvent.click(screen.getByRole("link", { name: "Conventional Git Composer" }));
  expect(window.location.pathname).toBe("/commits");
  window.history.back();
  await waitFor(() =>
    expect(screen.getByRole("link", { name: "Comments" }).getAttribute("aria-current")).toBe(
      "page",
    ),
  );
  expect((screen.getByLabelText("Subject") as HTMLInputElement).value).toBe("Clear naming.");
});

test("copies footers and switches to a trunk branch without losing the description", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
    target: { value: "add login" },
  });
  fireEvent.change(screen.getByLabelText("Footer token"), { target: { value: "Refs" } });
  fireEvent.change(screen.getByLabelText("Footer value"), { target: { value: "#123" } });
  fireEvent.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("feat: add login\n\nRefs: #123"));
  fireEvent.click(screen.getByRole("link", { name: "Branch" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
    target: { value: "add-login" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Type" }), { target: { value: "main" } });
  expect(screen.queryByRole("textbox", { name: "Description" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("main"));
  fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
    target: { value: "feature" },
  });
  expect((screen.getByRole("textbox", { name: "Description" }) as HTMLInputElement).value).toBe(
    "add-login",
  );
});

test("preserves both composers when switching and copies the formatted comment", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  const description = screen.getByRole("textbox", { name: "Description" });
  fireEvent.change(description, { target: { value: "add empty state" } });
  fireEvent.click(screen.getByRole("link", { name: "Comments" }));
  expect((screen.getByRole("button", { name: "Copy" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "   " } });
  expect((screen.getByRole("button", { name: "Copy" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(screen.getByLabelText("Label"), { target: { value: "suggestion" } });
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Handle empty input." } });
  expect((screen.getByRole("button", { name: "Copy" }) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.change(screen.getByLabelText("Decorations (optional)"), {
    target: { value: "non-blocking" },
  });
  fireEvent.click(screen.getByRole("link", { name: "Commits" }));
  expect((screen.getByRole("textbox", { name: "Description" }) as HTMLInputElement).value).toBe(
    "add empty state",
  );
  fireEvent.click(screen.getByRole("link", { name: "Comments" }));
  expect((screen.getByLabelText("Subject") as HTMLInputElement).value).toBe("Handle empty input.");
  fireEvent.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith("suggestion (non-blocking): Handle empty input."),
  );
  await screen.findByRole("button", { name: "Copied" });
});
