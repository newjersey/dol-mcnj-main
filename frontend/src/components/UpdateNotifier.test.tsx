import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdateNotifier } from "./UpdateNotifier";

describe("UpdateNotifier", () => {
  it("renders without crashing", () => {
    render(<UpdateNotifier />);
    expect(screen.getByText(/Sign Up for Updates/i)).toBeInTheDocument();
  });

  it("validates email input correctly", () => {
    render(<UpdateNotifier />);
    const input = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /Sign Up for Updates/i });

    // Test invalid email
    userEvent.type(input, "invalidemail");
    userEvent.click(submitButton);
    waitFor(() =>
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument(),
    );

    // Test valid email
    userEvent.clear(input);
    userEvent.type(input, "validemail@example.com");
    userEvent.click(submitButton);
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
  });
});
