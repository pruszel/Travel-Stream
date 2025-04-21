// frontend/src/App.test.tsx

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AuthDisplay } from "./App";

describe("AuthDisplay", () => {
  it("renders", () => {
    const { container } = render(
      <AuthDisplay
        firebaseUser={null}
        isAuthStateLoading={false}
        authError={undefined}
      />,
    );
    expect(container).toBeTruthy();
  });
});
