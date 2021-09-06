import React from "react";

import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { ProfessionalsForm } from "./ProfessionalsForm";

describe("Professionals Form", () => {
  beforeAll(() => {});

  it("should select Phtographer, change postcode ans submit form", async () => {
    const setPostcode = jest.fn();
    const setSelectedPage = jest.fn();
    const setCategoryId = jest.fn();
    render(
      <ProfessionalsForm
        setSelectedPage={setSelectedPage}
        setPostcode={setPostcode}
        postCode="SW11"
        categoryId={2}
        setCategoryId={setCategoryId}
      />
    );
    fireEvent.click(
      screen.getByRole("option", { name: /photographer/i, hidden: true })
    );
    fireEvent.change(screen.getByDisplayValue(/sw11/i), {
      target: { value: "SE10" },
    });
    fireEvent.click(screen.getByText(/submit/i));
    await waitFor(() => expect(setPostcode).toHaveBeenCalledWith("se10"));
    await waitFor(() => expect(setCategoryId).toHaveBeenCalledWith(98));
    await waitFor(() => expect(setSelectedPage).toHaveBeenCalledWith(0));
  });
});
