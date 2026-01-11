# Agent Guidelines for ConchClub

## Coding Standards

### No TODOs
-   **Rule**: Do not leave `// TODO` comments in the codebase.
-   **Solution**: Favor using Spring Configuration Profiles (`local` vs `!local`) to handle incomplete or environment-specific logic especially when related to security/roles and authorization.
    -   **Local**: Permissive, mock data, open endpoints.
    -   **Production**: Secure, real data, strict checks.
-   **Reasoning**: Dangerous TODOs are easily forgotten. Enforcing behavior via active profiles ensures security by default in production while maintaining developer velocity locally.

### Self-Documenting Code
-   **Rule**: Always refrain from using comments in code. Instead favor highly descriptive names (even if they are verbose).

### Explicit Types
-   **Rule**: Do not use the `var` keyword. Always use the exact types.

