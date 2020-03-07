# Monorepo benefits

## Simplified organization

With multiple repos, you typically have one project per repo, but that forces you to define what a "project" is. It also might sometimes to force you to split and merge repos for a reasons.
Using a single repo reduces such overhead. Its also easier to navigate projects.

## Simplified dependencies

With multiple repos you need to have some way of specifying and versioning dependencies between them.
Since in monorepo atomic commits cross-project are possible, the repository can always be in consistent state.

## Simplified tooling

The simplification of navigation and dependencies makes it much easier to write tools. Instead of having tools that must understand relationships between repositories, as well as the nature of files within repositories, tools basically just need to be able to access files in a single directory.

## Cross project developing

With lots of repos, making cross-repo changes is painful. It typically involves tedious manual coordination across each repo. There's also a huge problem of correctly updating cross-repo version dependencies. Refactoring an API that's used across tens of packages will probably require a good chunk of a day.
With a monorepo, you just refactor the API and all of its callers in one commit. Updating all cross-repo dependency versions - one commit.

# Packages

Unity has Package Manager feature. Unity packages can store various types of features or assets...  
[Unity Package Manager](https://docs.unity3d.com/Manual/Packages.html)

## Project Manifest file

When Unity loads a Project, the Package Manager reads the **`Project Manifest`** file (manifest.json)...  
[Project Manifest file](https://docs.unity3d.com/Manual/upm-manifestPrj.html)

## Package Manifest file

Every package has **`package manifest`** file (package.json)...  
[Package Manifest file](https://docs.unity3d.com/Manual/upm-manifestPkg.html)

## Embedded packages

Any package that appears under your Project's Packages folder is **`embedded`** in that Project...  
[Embedded packages](https://docs.unity3d.com/Manual/upm-embed.html)

## Dependency packages

Any package references that are defined in **`dependencies`** attribute in Project Manifest file will be downloaded and installed by Package Manager...  
[Dependencies](https://docs.unity3d.com/Manual/upm-dependencies.html)

Auto Tools

- commit messages
- managed cross dependencies
- managed publishing

Private registry

- verdacio

Git LFS

- rudolfs
