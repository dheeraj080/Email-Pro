# Agent Rules

1. **Destructive Operations**: NEVER delete files or entire directories unless explicitly requested by the user. If a refactor is planned, explain it in the chat first.
2. **Configuration Persistence**: Do not modify `package.json`, `tsconfig.json`, or root config files unless adding necessary dependencies or fixing a configuration bug.
3. **Communication**: If you are about to make a large change (more than 5 files), summarize the plan and wait for the user to acknowledge if they've expressed concern about file deletions.
4. **Safety First**: If you find yourself wanting to run an `rm` command or a recursive delete, stop and consider if there is a safer way to achieve the goal (e.g., moving files to a `trash/` or `deprecated/` folder first).
5. **Incremental Changes**: Avoid major redesigns or structural overhauls when a user asks for a simple change. Stick to the scope of the request and maintain consistency with the existing code and design unless a broader update is requested.
