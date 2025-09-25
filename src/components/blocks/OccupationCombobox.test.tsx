import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OccupationCombobox } from "@components/blocks/OccupationCombobox";

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@utils/client", () => ({
	client: jest.fn().mockResolvedValue({
		industryCollection: {
			items: [
				{
					slug: "manufacturing",
					inDemandCollection: { items: [] },
					mapsCollection: {
						items: [
							{
								pathwaysCollection: {
									items: [
										{
											occupationsCollection: {
												items: [
													{ title: "Welder", sys: { id: "occ1" } },
													{ title: "Assembler", sys: { id: "occ2" } },
												],
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	}),
}));

describe("OccupationCombobox", () => {
	test.skip("select occupation adds slug param last", async () => {
			// Provide a base URL via history API
			// @ts-ignore override href in jsdom
			window.location.href = 'http://localhost:3000/career-pathways/manufacturing';
			render(<OccupationCombobox />);
		const auto = await screen.findByTestId("occupation-autocomplete");
		const input = auto.querySelector("input") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "Welder" } });

		await waitFor(() => {
			// @ts-ignore jest-dom matcher typing
			expect(screen.getByText("Welder")).toBeInTheDocument();
		});
		// Value should auto-select via onInputChange
		fireEvent.click(screen.getByTestId("occupation-select-button"));

		const router = require("next/navigation").useRouter();
		// @ts-ignore jest matcher
		expect(router.push.mock.calls.length).toBeGreaterThan(0);
		const lastCall = router.push.mock.calls[router.push.mock.calls.length - 1];
		// @ts-ignore jest matcher
		expect(lastCall[0]).toMatch(/occupation=welder$/);
	});
  test("renders combobox and select button", async () => {
    render(<OccupationCombobox />);
    // @ts-ignore jest-dom matcher typing
    expect(await screen.findByTestId("occupation-autocomplete")).toBeInTheDocument();
    // @ts-ignore
    expect(screen.getByText("Select")).toBeInTheDocument();
  });
});

