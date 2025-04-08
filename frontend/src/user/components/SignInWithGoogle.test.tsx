// SignInWithGoogle.test.tsx

import { describe, it, afterEach, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SignInWithGoogle } from "@/user/components/SignInWithGoogle";
import * as reactFirebaseHooksAuth from "react-firebase-hooks/auth";
import { UserCredential } from "firebase/auth";

describe("SignInWithGoogle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the sign-in button", () => {
    render(<SignInWithGoogle />);
    expect(screen.getByText("Sign in with Google")).toBeDefined();
  });

  it("calls signInWithGoogle when clicked", async () => {
    const mockSignInWithGoogle = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(reactFirebaseHooksAuth, "useSignInWithGoogle").mockReturnValue([
      mockSignInWithGoogle,
      {} as UserCredential,
      false,
      undefined,
    ]);

    render(<SignInWithGoogle />);
    const button = screen.getByText("Sign in with Google");
    button.click();

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    await expect(
      mockSignInWithGoogle.mock.results[0].value,
    ).resolves.toBeUndefined();
  });
});
