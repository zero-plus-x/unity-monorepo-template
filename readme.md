# Monorepo for Unity packages

## Usage

* Create a repository based on this template
* Develop packages
* Use `Verdaccio` to run npm registry
* Use `Rudolfs` to store Git LFS data on AWS S3 
* Use `Auto` tool to release packages

[Unity Packages](#Unity-Packages)  
[Private registry](#Private-registry)  
[Git LFS](#Git-Lfs)  
[Auto Tools](#Auto-Tools)  
[Monorepo Benefits](#Monorepo-Benefits)  

## Unity Packages

Unity has Package Manager feature. Unity packages can store various types of features or assets...  
[Unity Package Manager](https://docs.unity3d.com/Manual/Packages.html)

### Project Manifest file

When Unity loads a Project, the Package Manager reads the **`Project Manifest`** file (manifest.json)...  
[Project Manifest file](https://docs.unity3d.com/Manual/upm-manifestPrj.html)

### Package Manifest file

Every package has **`package manifest`** file (package.json)...  
[Package Manifest file](https://docs.unity3d.com/Manual/upm-manifestPkg.html)

### Embedded packages

Any package that appears under your Project's Packages folder is **`embedded`** in that Project...  
[Embedded packages](https://docs.unity3d.com/Manual/upm-embed.html)

### Registry packages

Any package references that are defined in **`dependencies`** attribute in Project Manifest file will be downloaded and installed by Package Manager...  
[Dependencies](https://docs.unity3d.com/Manual/upm-dependencies.html)

## Assembly definitions
[Read more in Wiki page](https://github.com/zero-plus-x/unity-monorepo-template/wiki/Assembly-Definitions)

## Auto Tools

[Auto Tools](https://github.com/nextools/metarepo/tree/master/packages/auto) is a monorepo management tool, which helps to manage package releases, versions and cross-dependencies, based on commit messages.  
[More details in Wiki page](https://github.com/zero-plus-x/unity-monorepo-template/wiki/Auto-Tools)

## Private registry

You can publish the packages directly to `npm` or roll your own registry.

### Verdaccio

[Verdaccio](https://verdaccio.org/) is lightweight npm registry. It can be run in a Docker container for private publishing or testing.

## Git LFS

[Git LFS](https://git-lfs.github.com/) is an extension to Git, to manage large files. It can be used to store binary assets in a Git repository. Usually LFS API is implemented by the same Git service provider. It is possible to point LFS to a different endpoint, for example AWS S3.  
[More details in Wiki page](https://github.com/zero-plus-x/unity-monorepo-template/wiki/LFS)

### Rudolfs
[Rudolfs](https://github.com/jasonwhite/rudolfs) is the LFS proxy server, that translates LFS protocol to S3 compilant one. It can be run as a Docker container on local machine to store project assets on S3.  
[More details in Wiki page](https://github.com/zero-plus-x/unity-monorepo-template/wiki/Rudolfs)

## Monorepo benefits

### Simplified organization

With multiple repos, you typically have one project per repo, but that forces you to define what a "project" is. It also might sometimes make you to split and merge repos for a reasons.
Using a single repo reduces such overhead.

### Simplified dependencies

With multiple repos you need to have some way of specifying and maintaining dependencies between them.
In monorepo it is possible to make atomic cross-project commits. The repository always stays in consistent state.

### Simplified tooling

With multiple repos tools must understand relationships between repositories.
In monorepo tools just need to be able to access files in a single directory.

### Cross project developing

With multiple repos, making cross-repo changes is painful. It typically involves tedious manual coordination across each repo. There's also a huge problem of correctly updating cross-repo version dependencies. Refactoring an API that's used across tens of packages will probably require a good chunk of a day.
With a monorepo, you refactor the API and all of its callers in one commit. Updating all cross-repo dependency versions - one commit.
