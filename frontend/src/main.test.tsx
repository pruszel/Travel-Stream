import { describe, it, expect, vi, beforeEach } from "vitest";
import { main, getRootElById } from "./main";
import { JSDOM } from "jsdom";
import * as React from "react";

interface RootType {
  render: (element: React.ReactNode) => void;
}

const jsdomOptions = {
  url: "http://localhost/",
  referrer: "http://localhost/",
  contentType: "text/html",
};

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })) as unknown as typeof createRoot,
}));

// Import after vi.mock to ensure the mock is applied
import { createRoot } from "react-dom/client";

describe("getRootElById", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    // Set up a fresh DOM for each test with proper options
    dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', jsdomOptions);
    document = dom.window.document;
  });

  it("returns element when it exists", () => {
    const rootEl = getRootElById(document, "root");
    expect(rootEl).not.toBeNull();
    expect(rootEl?.id).toBe("root");
  });

  it("returns null when element does not exist", () => {
    const nonExistentEl = getRootElById(document, "non-existent");
    expect(nonExistentEl).toBeNull();
  });
});

describe("main", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Set up a fresh DOM for each test with proper options
    dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', jsdomOptions);
    document = dom.window.document;
  });

  it("throws error when document is undefined", () => {
    expect(() => {
      main(undefined);
    }).toThrow("Document is undefined");
  });

  it("throws error when root element is not found", () => {
    const domWithoutRoot = new JSDOM("<!DOCTYPE html>", jsdomOptions);
    const docWithoutRoot = domWithoutRoot.window.document;
    expect(() => {
      main(docWithoutRoot);
    }).toThrow("Root element not found");
  });

  it("initializes React when root element is found", () => {
    main(document);

    // Check if createRoot was called with the root element
    const rootEl = document.getElementById("root");
    expect(createRoot).toHaveBeenCalledWith(rootEl);

    // Check if render was called
    const createRootMock = vi.mocked(createRoot);
    const renderMock = (createRootMock.mock.results[0].value as RootType)
      .render;
    expect(renderMock).toHaveBeenCalled();
  });
});
