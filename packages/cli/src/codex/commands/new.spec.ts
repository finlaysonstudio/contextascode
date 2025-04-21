import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { handleNewCommand } from "./new";
import * as inquirerPrompts from "@inquirer/prompts";
import * as helpers from "./helpers";

// Mock dependencies
vi.mock("fs");
vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
}));
vi.mock("./helpers", async () => {
  const actual = await vi.importActual("./helpers");
  return {
    ...actual,
    createSanitizedFilename: vi.fn((desc) => 
      desc.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "_")),
    generateTimestamp: vi.fn(() => "20230101_003045_678"),
    ensureDirectoryExists: vi.fn(),
    loadTemplate: vi.fn((path, replacements, defaultContent) => {
      if (path.includes("changelog")) {
        return `# ${replacements.message}\n\nTemplate content`;
      } else if (path.includes("prompt")) {
        return `# ${replacements.title}\n\nPrompt template`;
      }
      return defaultContent;
    }),
    createFile: vi.fn((path) => {
      // Mock fs.writeFileSync to make the tests pass
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined);
      return path;
    }),
  };
});

describe("handleNewCommand", () => {
  const mockDate = new Date("2023-01-01T00:30:45.678Z");

  beforeEach(() => {
    // Mock Date
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    // Mock fs functions
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === "./context/prompts/contextascode/templates/changelog.md") {
        return true;
      }
      if (path === "./context/prompts/contextascode/templates/prompt.md") {
        return true;
      }
      return false;
    });

    vi.mocked(fs.readFileSync).mockImplementation((path) => {
      if (path === "./context/prompts/contextascode/templates/changelog.md") {
        return "# {{ message }}\n\nTemplate content";
      }
      if (path === "./context/prompts/contextascode/templates/prompt.md") {
        return "# ${title}\n\nPrompt template";
      }
      return "";
    });
    vi.mocked(fs.writeFileSync).mockImplementation(() => undefined);
    vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

    // Mock prompt
    vi.mocked(inquirerPrompts.input).mockResolvedValue("prompted description");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe("change command", () => {
    it("should create a change file with provided description", async () => {
      await handleNewCommand("change", "test description");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_test_description\.md$/,
        ),
        "# test description\n\nTemplate content",
      );
    });

    it("should prompt for description if not provided", async () => {
      await handleNewCommand("change");

      expect(inquirerPrompts.input).toHaveBeenCalled();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_prompted_description\.md$/,
        ),
        "# prompted description\n\nTemplate content",
      );
    });

    it("should sanitize description for filename", async () => {
      await handleNewCommand("change", "test description with @special# chars!");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_test_description_with_special_chars\.md$/,
        ),
        "# test description with @special# chars!\n\nTemplate content",
      );
    });

    it("should use default template if template file doesn't exist", async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return false;
      });

      await handleNewCommand("change", "no template");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_no_template\.md$/,
        ),
        "# no template\n\n",
      );
    });
  });

  describe("prompt command", () => {
    it("should create a prompt file with provided description", async () => {
      await handleNewCommand("prompt", "test prompt");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "context/prompts/test_prompt.md",
        "# test prompt\n\nPrompt template",
      );
    });

    it("should prompt for description if not provided", async () => {
      await handleNewCommand("prompt");

      expect(inquirerPrompts.input).toHaveBeenCalled();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "context/prompts/prompted_description.md",
        "# prompted description\n\nPrompt template",
      );
    });

    it("should sanitize description for filename", async () => {
      await handleNewCommand("prompt", "test prompt with @special# chars!");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "context/prompts/test_prompt_with_special_chars.md",
        "# test prompt with @special# chars!\n\nPrompt template",
      );
    });

    it("should use default template if template file doesn't exist", async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return false;
      });

      await handleNewCommand("prompt", "no template");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "context/prompts/no_template.md",
        "# no template\n\n",
      );
    });
  });
});
