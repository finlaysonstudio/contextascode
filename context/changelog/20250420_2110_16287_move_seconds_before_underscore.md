# move seconds before underscore

## 🎯 Goal
<Goal>
Change the current date-based filename to group seconds with minutes and leave milliseconds isolated
20250420_2110_16287_move_seconds_before_underscore.md
20250420_211016_287_move_seconds_before_underscore.md
</Goal>

## ↔️ Guidance
<Guidance>
```
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "_",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
    "_",
    String(now.getMilliseconds()).padStart(3, "0"),
  ].join("");
```
</Guidance>

Update the tests

## 🖇️ Context

<Files>
packages/cli/src/codex/commands/new.ts
</Files>

<Tests>
packages/cli/src/codex/commands/new.spec.ts
</Tests>
