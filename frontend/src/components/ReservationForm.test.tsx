import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReservationForm from "./ReservationForm";

describe("Reservation Component", () => {
  beforeEach(() => {
    render(<ReservationForm />);
  });

  test("renders all input fields", () => {
    // Form input fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("name", "name");
    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      "autocomplete",
      "name",
    );

    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute("name", "phone");
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute("inputmode", "tel");
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute(
      "autocomplete",
      "tel",
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "inputmode",
      "email",
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );

    expect(screen.getByLabelText(/traveling from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/traveling from/i)).toHaveAttribute(
      "name",
      "from",
    );
    expect(screen.getByLabelText(/traveling from/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/traveling from/i)).toHaveAttribute(
      "autocomplete",
      "off",
    );

    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toHaveAttribute(
      "name",
      "destination",
    );
    expect(screen.getByLabelText(/destination/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/destination/i)).toHaveAttribute(
      "autocomplete",
      "off",
    );

    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toHaveAttribute(
      "name",
      "departureDate",
    );
    expect(screen.getByLabelText(/departure date/i)).toHaveAttribute(
      "type",
      "date",
    );

    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return date/i)).toHaveAttribute(
      "name",
      "returnDate",
    );
    expect(screen.getByLabelText(/return date/i)).toHaveAttribute(
      "type",
      "date",
    );

    expect(screen.getByLabelText(/number of adults/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of adults/i)).toHaveAttribute(
      "name",
      "adults",
    );
    expect(screen.getByLabelText(/number of adults/i)).toHaveAttribute(
      "type",
      "number",
    );

    expect(screen.getByLabelText(/number of children/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of children/i)).toHaveAttribute(
      "name",
      "children",
    );
    expect(screen.getByLabelText(/number of children/i)).toHaveAttribute(
      "type",
      "number",
    );

    expect(screen.getByLabelText(/number of infants/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of infants/i)).toHaveAttribute(
      "name",
      "infants",
    );
    expect(screen.getByLabelText(/number of infants/i)).toHaveAttribute(
      "type",
      "number",
    );
  });

  test("renders submit button", () => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
