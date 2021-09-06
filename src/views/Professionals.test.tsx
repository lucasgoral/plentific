import React from "react";

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { rest } from "msw";

import mockedJson from "./../data/mocks/professionalsResponse.json";
import Professionals, { URL } from "./Professionals";
import { setupServer } from "msw/node";

// declare which API requests to mock
const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(
      ctx.json(mockedJson),
      ctx.status(200),
      ctx.set("x-pagination-count", "360")
    );
  })
);

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());
describe("Professionals Screen", () => {
  beforeEach(() => {
    render(<Professionals />);
  });
  afterEach(() => {
    cleanup();
  });

  it("should render 18 pages in pagination", async () => {
    const navigation = await waitFor(() => screen.getByRole("navigation"));
    await waitFor(() =>
      expect(within(navigation).getByText(/18/i)).toBeInTheDocument()
    );
  });

  it("should  renders fetched data from mocked API", async () => {
    await waitFor(() =>
      expect(screen.getByText("North-John 5c2241")).toBeInTheDocument()
    );
  });
});
