import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should add new task", async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole("button", { name: "Save Task" });
    fireEvent.change(inputElement, { target: { value: "Clean house" } });
    fireEvent.click(saveButtonEl);
    const taskEl = await screen.findByText(/Clean House/i);

    expect(taskEl).toBeInTheDocument();
  });

  it("should delete a task", async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole("button", { name: "Save Task" });
    fireEvent.change(inputElement, { target: { value: "Clean house" } });
    fireEvent.click(saveButtonEl);
    const closeButtonEl = await screen.findByTestId("closeBtn");
    fireEvent.click(closeButtonEl);
    await waitFor(() => {
      const taskEl = screen.queryByText(/Clean house/i);
      expect(taskEl).toBeNull();
    });
  });

  it("should mark a task as completed", async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole("button", { name: "Save Task" });
    fireEvent.change(inputElement, { target: { value: "Clean house" } });
    fireEvent.click(saveButtonEl);
    const checkboxEl = await screen.findByTestId("checkbox");
    fireEvent.click(checkboxEl);
    await waitFor(() => {
      expect(checkboxEl).toBeChecked();
    });
    await waitFor(() => {
      const taskEl = screen.queryByText(/Clean house/i);
      expect(taskEl).toHaveClass("checked");
    });
  });
});
