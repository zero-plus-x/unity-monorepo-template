# Monorepo benefits
## Simplified organization
With multiple repos, you typically have one project per repo,
## Simplified dependencies
## Simplified tooling
The simplification of navigation and dependencies makes it much easier to write tools. Instead of having tools that must understand relationships between repositories, as well as the nature of files within repositories, tools basically just need to be able to access files in a single directory.
## Cross project developing
With lots of repos, making cross-repo changes is painful. It typically involves tedious manual coordination across each repo. There's also a huge problem of correctly updating cross-repo version dependencies. Refactoring an API that's used across tens of packages will probably require a good chunk of a day.
With a monorepo, you just refactor the API and all of its callers in one commit. Updating all cross-repo dependency versions - one commit.

# Packages
## Embedded packages

## Registry packages

Auto
- commit messages
- managed cross dependencies
- managed publishing

Start

Private registry
- verdacio
