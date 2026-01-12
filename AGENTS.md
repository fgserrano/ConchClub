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

### Context-Specific Endpoints, DTOS & Abstractions
-   **Rule**: Follow common clean code paradigms by ensuring everything has a "single responsibility". Do not create "Swiss Army Knife" endpoints or over-generalized DTOs.
-   **Null Handling**: Be extra explicit about minimizing the use of nulls. Never rely on making fields null/nullable if at all possible. Always opt for `Optional` when applicable.
-   **Solution**:
    -   Create specific DTOs for each context (e.g., `MysteryTicketDto` vs `TicketDto`).
    -   Create separate endpoints for different perspectives (e.g., `/api/admin/tickets` vs `/api/season/tickets` vs `/api/season/tickets/me`).
-   **Reasoning**: Prevents accidental data leaks (security) and avoids the confusion of handling objects where half the fields might be null depending on who is asking.
