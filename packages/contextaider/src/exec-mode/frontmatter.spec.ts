import { describe, it, expect } from "vitest";
import { hasFrontmatter, parseFrontmatter } from "./frontmatter";

describe("frontmatter", () => {
  describe("hasFrontmatter", () => {
    it("should return true for content with frontmatter", () => {
      const content = `---
title: Test
description: A test file
---
# Content here`;
      expect(hasFrontmatter(content)).toBe(true);
    });

    it("should return false for content without frontmatter", () => {
      const content = `# No frontmatter here
Just regular content`;
      expect(hasFrontmatter(content)).toBe(false);
    });

    it("should return false for content with incomplete frontmatter", () => {
      const content = `---
title: Test without closing marker
# Content here`;
      expect(hasFrontmatter(content)).toBe(false);
    });

    it("should return false for empty content", () => {
      expect(hasFrontmatter("")).toBe(false);
    });
  });

  describe("parseFrontmatter", () => {
    it("should parse frontmatter and return content separately", () => {
      const content = `---
title: Test
description: A test file
---
# Content here`;

      const result = parseFrontmatter(content);

      expect(result.hasFrontmatter).toBe(true);
      expect(result.frontmatter).toEqual({
        title: "Test",
        description: "A test file",
      });
      expect(result.content).toBe("# Content here");
    });

    it("should handle content without frontmatter", () => {
      const content = `# No frontmatter here
Just regular content`;

      const result = parseFrontmatter(content);

      expect(result.hasFrontmatter).toBe(false);
      expect(result.frontmatter).toBeNull();
      expect(result.content).toBe(content);
    });

    it("should handle empty frontmatter", () => {
      const content = `---
---
# Content after empty frontmatter`;

      const result = parseFrontmatter(content);

      expect(result.hasFrontmatter).toBe(true);
      expect(result.frontmatter).toEqual({});
      expect(result.content).toBe("# Content after empty frontmatter");
    });

    it("should handle comments in frontmatter", () => {
      const content = `---
# This is a comment
title: Test
# Another comment
description: A test file
---
# Content here`;

      const result = parseFrontmatter(content);

      expect(result.hasFrontmatter).toBe(true);
      expect(result.frontmatter).toEqual({
        title: "Test",
        description: "A test file",
      });
      expect(result.content).toBe("# Content here");
    });
  });
});
