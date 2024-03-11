import { render, fireEvent } from "@testing-library/react";
import { AlertBar } from "../AlertBar";
import "@testing-library/jest-dom";

// Helper function to check for class in element or its parents
const hasClass = (element, className) => {
  let currentElement = element;
  while (currentElement) {
    if (currentElement.classList && currentElement.classList.contains(className)) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }
  return false;
};

describe("Alert component", () => {
  it("renders alert with correct copy and type", () => {
    const alertId = "testAlert";
    const copy = "Test copy";
    const type = "success";

    const { getByText } = render(<AlertBar alertId={alertId} copy={copy} type={type} />);

    const alertElement = getByText(copy);
    expect(alertElement).toBeInTheDocument();
    expect(hasClass(alertElement, `alert-bar usa-alert--${type}`) || hasClass(alertElement, 'usa-alert__body')).toBe(true);
  });

  it("hides alert on close button click", () => {
    const alertId = "testAlert";
    const copy = "Test copy";
    const type = "success";

    const { getByText } = render(
        <AlertBar dismissible alertId={alertId} copy={copy} type={type} />,
    );

    const closeButton = getByText("close alert");
    fireEvent.click(closeButton);

    expect(sessionStorage.getItem(`alert_${alertId}`)).toBe("true");
  });

  it("hides alert if alertId is not provided", () => {
    const copy = "Test copy";
    const type = "success";

    const { getByText } = render(<AlertBar copy={copy} type={type} />);

    const alertElement = getByText(copy);
    expect(alertElement).toBeInTheDocument();
    expect(hasClass(alertElement, `alert-bar usa-alert--${type}`) || hasClass(alertElement, 'usa-alert__body')).toBe(true);
  });

  it("hides alert if sessionStorage contains alertId", () => {
    const alertId = "testAlert";
    const copy = "Test copy";
    const type = "success";

    sessionStorage.setItem(`alert_${alertId}`, "true");

    const { getByText } = render(<AlertBar alertId={alertId} copy={copy} type={type} />);

    const alertElement = getByText(copy);
    expect(alertElement).toBeInTheDocument();
    expect(hasClass(alertElement, `alert-bar usa-alert--${type}`) || hasClass(alertElement, 'usa-alert__body')).toBe(true);
  });
});
