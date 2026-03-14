import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WizardPage from "../pages/WizardPage";
import * as basicApi from "../services/basicInfoApi";
import * as detailsApi from "../services/detailsApi";

jest.mock("../services/basicInfoApi");
jest.mock("../services/detailsApi");

const mockedPostBasicInfo = basicApi.postBasicInfo as jest.Mock;
const mockedPostDetails = detailsApi.postDetails as jest.Mock;
const mockedCountByDept = basicApi.countEmployeesByDepartment as jest.Mock;

function deferred<T = unknown>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("Submit flow", () => {
  it("submits basicInfo then details and shows progress messages", async () => {
    const basicDeferred = deferred();
    const detailsDeferred = deferred();

    mockedPostBasicInfo.mockReturnValue(basicDeferred.promise);
    mockedPostDetails.mockReturnValue(detailsDeferred.promise);
    mockedCountByDept.mockResolvedValue(0);

    render(
      <MemoryRouter initialEntries={["/wizard?role=admin"]}>
        <Routes>
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/employees" element={<div>Employees Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Fill Step 1
    await userEvent.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/^Email$/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/Department/i), "Engineering");

    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Fill Step 2 minimal valid fields
    await userEvent.selectOptions(screen.getByLabelText(/Role/i), "Ops");
    await userEvent.selectOptions(
      screen.getByLabelText(/Employment Type/i),
      "Full-time"
    );
    await userEvent.type(screen.getByLabelText(/Office Location/i), "Jakarta");

    await userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // basicInfo is now "pending"
    await waitFor(() => {
      expect(screen.getByText(/Submitting Basic Info/i)).toBeInTheDocument();
    });

    // Resolve basicInfo
    await act(async () => basicDeferred.resolve({}));

    await waitFor(() => {
      expect(screen.getByText(/Basic Info saved/i)).toBeInTheDocument();
    });

    // details is now "pending"
    await waitFor(() => {
      expect(screen.getByText(/Submitting Details/i)).toBeInTheDocument();
    });

    // Resolve details
    await act(async () => detailsDeferred.resolve({}));

    await waitFor(() => {
      expect(screen.getByText(/details saved/i)).toBeInTheDocument();
      expect(
        screen.getByText(/All data processed successfully/i)
      ).toBeInTheDocument();
    });

    // Ensure order of calls
    expect(mockedPostBasicInfo).toHaveBeenCalledTimes(1);
    expect(mockedPostDetails).toHaveBeenCalledTimes(1);
    expect(mockedPostBasicInfo.mock.invocationCallOrder[0]).toBeLessThan(
      mockedPostDetails.mock.invocationCallOrder[0]
    );
  });
});
