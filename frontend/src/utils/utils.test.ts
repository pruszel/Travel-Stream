// frontend/src/utils/utils.test.ts

import { describe, it, expect } from "vitest";
import { convertFormDataToStringSafely } from "./utils";

describe("convertFormDataToStringSafely", () => {
  it("should return the string value when input is a string", () => {
    const input = "test string";
    const result = convertFormDataToStringSafely(input);
    expect(result).toBe("test string");
  });

  it("should return an empty string when input is null", () => {
    const input = null;
    const result = convertFormDataToStringSafely(input);
    expect(result).toBe("");
  });

  it("should return an empty string when input is undefined", () => {
    const input = undefined;
    const result = convertFormDataToStringSafely(input);
    expect(result).toBe("");
  });

  it("should return an empty string when input is a File object", () => {
    // Mock a File object
    const fileInput = new File(["content"], "filename.txt", {
      type: "text/plain",
    });
    const result = convertFormDataToStringSafely(fileInput);
    expect(result).toBe("");
  });

  it("should return an empty string for an empty string input", () => {
    const input = "";
    const result = convertFormDataToStringSafely(input);
    expect(result).toBe("");
  });
});
