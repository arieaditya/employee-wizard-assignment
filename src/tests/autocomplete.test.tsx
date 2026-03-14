import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BasicInfoStep from "../components/BasicInfoStep";
import * as api from "../services/basicInfoApi";

jest.mock("../services/basicInfoApi");

const mockedFetchDepartments = api.fetchDepartments as jest.Mock;

describe("Department autocomplete", () => {
  it("fetches and renders suggestions as user types", async () => {
    mockedFetchDepartments.mockResolvedValue([
      { id: 1, name: "Engineering" },
      { id: 2, name: "Operations" },
    ]);

    let formValue = {
      fullName: "John Doe",
      email: "john@example.com",
      department: "",
    };

    const onChange = jest.fn((next) => {
      formValue = next;
    });
    const onNext = jest.fn();

    const { rerender } = render(
      <BasicInfoStep value={formValue} onChange={onChange} onNext={onNext} />
    );

    // Re-render on each onChange so the controlled input stays in sync
    onChange.mockImplementation((next) => {
      formValue = next;
      rerender(
        <BasicInfoStep value={next} onChange={onChange} onNext={onNext} />
      );
    });

    const input = screen.getByLabelText(/Department/i);

    await userEvent.type(input, "Eng");

    // The hook debounces at 300ms, so wait for the fetch call
    await waitFor(() => {
      expect(mockedFetchDepartments).toHaveBeenCalledWith("Eng");
    });

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Operations")).toBeInTheDocument();
    });
  });
});
