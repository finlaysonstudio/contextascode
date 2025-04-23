import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { handleNewCommand, NewCommandType } from "./new";
import * as inquirerPrompts from "@inquirer/prompts";
import * as helpers from "./helpers";
import * as stringUtils from "../../utils/string";
import { ValidationError, UserCancellationError } from "../../utils/errors";
import { CONFIG } from "../config";

// Mock dependencies
vi.mock("fs");
vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
}));
vi.mock("./helpers");
vi.mock("../../utils/string");

describe("handleNewCommand", () => {
  const mockDate = new Date("2023-01-01T00:30:45.678Z");

  beforeEach(() => {
    // Mock Date
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    // Mock helper functions
    vi.mocked(stringUtils.createSanitizedFilename).mockImplementation((desc) =>
      desc.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "_"),
    );
    vi.mocked(helpers.generateTimestamp).mockReturnValue("20230101_003045_678");
    vi.mocked(helpers.ensureDirectoryExists).mockImplementation(() =>
      Promise.resolve(),
    );
    vi.mocked(helpers.loadTemplate).mockImplementation(
      async (path, replacements, defaultContent) => {
        if (path.includes("changelog")) {
          return `# ${replacements.message}\n\nTemplate content`;
        } else if (path.includes("prompt")) {
          return `# ${replacements.title}\n\nPrompt template`;
        }
        return defaultContent;
      },
    );
    vi.mocked(helpers.createFile).mockImplementation(async (path) => {
      return path;
    });

    // Mock fs functions
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === CONFIG.paths.templates.changelog) {
        return true;
      }
      if (path === CONFIG.paths.templates.prompt) {
        return true;
      }
      return false;
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

  it("should throw ValidationError for invalid type", async () => {
    await expect(handleNewCommand("invalid" as NewCommandType)).rejects.toThrow(
      ValidationError,
    );
    await expect(handleNewCommand("invalid" as NewCommandType)).rejects.toThrow(
      "Type must be 'change' or 'prompt', received 'invalid'",
    );
  });

  it("should throw UserCancellationError when user cancels prompt", async () => {
    vi.mocked(inquirerPrompts.input).mockRejectedValue(
      new Error("User cancelled"),
    );

    await expect(handleNewCommand("change")).rejects.toThrow(
      UserCancellationError,
    );
    await expect(handleNewCommand("change")).rejects.toThrow(
      "Operation cancelled by user",
    );
  });

  describe("change command", () => {
    it("should create a change file with provided description", async () => {
      await handleNewCommand("change", "test description");

      expect(helpers.createFile).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_test_description\.md$/,
        ),
        "# test description\n\nTemplate content",
      );
    });

    it("should prompt for description if not provided", async () => {
      await handleNewCommand("change");

      expect(inquirerPrompts.input).toHaveBeenCalled();

      expect(helpers.createFile).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_prompted_description\.md$/,
        ),
        "# prompted description\n\nTemplate content",
      );
    });

    it("should sanitize description for filename", async () => {
      await handleNewCommand(
        "change",
        "test description with @special# chars!",
      );

      expect(helpers.createFile).toHaveBeenCalledWith(
        expect.stringMatching(
          /context\/changelog\/\d{8}_\d{6}_\d{3}_test_description_with_special_chars\.md$/,
        ),
        "# test description with @special# chars!\n\nTemplate content",
      );
    });

    it("should use default template if template file doesn't exist", async () => {
      vi.mocked(helpers.loadTemplate).mockResolvedValueOnce(
        "# no template\n\n",
      );

      await handleNewCommand("change", "no template");

      expect(helpers.createFile).toHaveBeenCalledWith(
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

      expect(helpers.createFile).toHaveBeenCalledWith(
        "context/prompts/test_prompt.md",
        "# test prompt\n\nPrompt template",
      );
    });

    it("should prompt for description if not provided", async () => {
      await handleNewCommand("prompt");

      expect(inquirerPrompts.input).toHaveBeenCalled();

      expect(helpers.createFile).toHaveBeenCalledWith(
        "context/prompts/prompted_description.md",
        "# prompted description\n\nPrompt template",
      );
    });

    it("should sanitize description for filename", async () => {
      await handleNewCommand("prompt", "test prompt with @special# chars!");

      expect(helpers.createFile).toHaveBeenCalledWith(
        "context/prompts/test_prompt_with_special_chars.md",
        "# test prompt with @special# chars!\n\nPrompt template",
      );
    });

    it("should use default template if template file doesn't exist", async () => {
      vi.mocked(helpers.loadTemplate).mockResolvedValueOnce(
        "# no template\n\n",
      );

      await handleNewCommand("prompt", "no template");

      expect(helpers.createFile).toHaveBeenCalledWith(
        "context/prompts/no_template.md",
        "# no template\n\n",
      );
    });
  });
});
