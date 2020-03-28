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

## Auto Tools

[Auto Tools](https://github.com/nextools/metarepo/tree/master/packages/auto) is a monorepo management tool, which helps to manage package releases, versions and cross-dependencies, based on commit messages.

### Commit messages

Auto tools uses commit messages to determine which release type to apply to the package. To be readable by Auto, the commit message must have a certain structure
```
<release type> <pkg1>[, <pkg2>]: commit message
```
**`release type`** can be any unicode text. You have to provide configuration to Auto, describing desired prefixes. To assist in writing proper commit messages the command `yarn start commit` runs a prompt.

## Private registry

You can publish the packages directly to `npm` or roll your own registry.

### Verdaccio

[Verdaccio](https://verdaccio.org/) is lightweight npm registry. It can be run in a Docker container for private publishing or testing.

## Git LFS

[Git LFS](https://git-lfs.github.com/) is an extension to Git, to manage large files. It can be used to store different binary assets in a git repo. Usually LFS protocol is handled by the same git repo host. The trick is that you can forward LFS upload to a different endpoint, for example S3.

### Rudolfs
[Rudolfs](https://github.com/jasonwhite/rudolfs) is the LFS proxy server, that translates LFS protocol to S3 compilant one. It can be run as a Docker container on local machine to store project assets on S3. 
