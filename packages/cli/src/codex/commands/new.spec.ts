import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { handleNewCommand } from "./new";
import * as enquirer from "enquirer";

// Mock dependencies
vi.mock("fs");
vi.mock("enquirer", () => ({
  prompt: vi.fn(),
}));

describe("handleNewCommand", () => {
  const mockDate = new Date("2023-01-01T00:30:45.678Z");
  const expectedTimestamp = "20230101_0030_45678";

  beforeEach(() => {
    // Mock Date
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    // Mock fs functions
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === "./context/prompts/contextascode/templates/changelog.md") {
        return true;
      }
      return false;
    });

    vi.mocked(fs.readFileSync).mockReturnValue(
      "# {{ message }}\n\nTemplate content",
    );
    vi.mocked(fs.writeFileSync).mockImplementation(() => undefined);
    vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

    // Mock prompt
    vi.mocked(enquirer.prompt).mockResolvedValue({
      description: "prompted description",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it("should create a change file with provided description", async () => {
    await handleNewCommand("change", "test description");

    const expectedFilename = `${expectedTimestamp}_test_description.md`;
    const expectedPath = path.join("./context/changelog", expectedFilename);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      "# test description\n\nTemplate content",
    );
  });

  it("should prompt for description if not provided", async () => {
    await handleNewCommand("change");

    expect(enquirer.prompt).toHaveBeenCalled();

    const expectedFilename = `${expectedTimestamp}_prompted_description.md`;
    const expectedPath = path.join("./context/changelog", expectedFilename);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      "# prompted description\n\nTemplate content",
    );
  });

  it("should sanitize description for filename", async () => {
    await handleNewCommand("change", "test description with @special# chars!");

    const expectedFilename = `${expectedTimestamp}_test_description_with_special_chars.md`;
    const expectedPath = path.join("./context/changelog", expectedFilename);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      "# test description with @special# chars!\n\nTemplate content",
    );
  });

  it("should use default template if template file doesn't exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    await handleNewCommand("change", "no template");

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      "# no template\n\n",
    );
  });
});
