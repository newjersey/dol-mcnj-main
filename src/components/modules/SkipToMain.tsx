"use client";
export const SkipToMain = () => {
  return (
    <button
      id="skipToMainContent"
      className="skip-to-content"
      onClick={() => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          const focusable = mainContent.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) as HTMLElement;
          if (focusable) {
            focusable.focus();
          } else {
            mainContent.focus();
          }
        }
      }}
    >
      Skip to main content
    </button>
  );
};
