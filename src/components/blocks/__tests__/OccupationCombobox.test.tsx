/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // extend expect with DOM matchers
import { expect } from '@jest/globals';
// Use absolute alias to avoid fragile relative path resolution in Jest
import { OccupationCombobox } from "@components/blocks/OccupationCombobox";

// Shared router mock
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock client + query collection
// Provide data shaped like collectAllItemsNormalized expects
jest.mock("@utils/client", () => ({
  client: jest.fn().mockResolvedValue({
    industryCollection: {
      items: [
        {
          slug: 'manufacturing',
          inDemandCollection: { items: [] },
          mapsCollection: {
            items: [
              {
                pathwaysCollection: {
                  items: [
                    {
                      occupationsCollection: {
                        items: [
                          { title: 'Welder', sys: { id: 'occ1' } },
                          { title: 'Assembler', sys: { id: 'occ2' } }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  })
}));

describe("OccupationCombobox", () => {
  test("renders and selects occupation producing slugified param last", async () => {
    render(<OccupationCombobox />);

    // Wait for loading to finish (placeholder changes)
    const auto = await screen.findByTestId("occupation-autocomplete");
    // Open MUI list by focusing input and typing
    const input = auto.querySelector('input') as HTMLInputElement;
  // Type full label so onInputChange auto-selects matching option without opening popup
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'Welder' } });

    await waitFor(() => {
      // Fallback assertion without jest-dom type augmentation
      const el = screen.getByText('Welder');
      expect(el).not.toBeNull();
    });

  // No need to open popup since exact match triggers internal setValue

    fireEvent.click(screen.getByTestId('occupation-select-button'));

    await waitFor(() => {
      if (pushMock.mock.calls.length === 0) throw new Error('push not called yet');
    });
    const lastUrl = pushMock.mock.calls[pushMock.mock.calls.length - 1][0];
    expect(/occupation=welder/.test(lastUrl)).toBe(true);
  });
});
