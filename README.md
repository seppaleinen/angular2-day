CAG Angular 2 Lab Day
=====================
This application is intended to be used in the CAG Contactor Angular 2 lab day.

Setup
-----
The development environment is based on NodeJS v6.0.0, so one must
install NodeJS first and foremost.

The development environment application uses the following minimum set
of developer tools:

- lite-server (https://github.com/johnpapa/lite-server)
- typescript (https://github.com/Microsoft/TypeScript)
- typings (https://github.com/typings/typings)
- cpx (https://www.npmjs.com/package/cpx)

### Directory structure

    angular2-day
      |
      +- src
      |
      +- dist
      |
      +- (node_modules)

All source code (.html, .ts, .css) and resources (.png, .jpg) are
located in _./src/_.

When doing `npm install` _./node_modules/_ will be created, in which
3pp dependencies are placed by NPM.

When doing `npm run build` the following happens:

- _./node_modules_ is copied into _./dist_
- _./src_ is copied into _./dist_
- typescript compilation is performed on all .ts-files in _./dist_
  placing the generated output (.js, .js.map) alongside the .ts-files

When running the development server it uses _./dist/_ as the base to
serve from.

If one want to deploy the application into a server, just copy the
_./dist_ directory.

### NPM scripts
In package.json the following scripts are defined:

#### Main scripts

- clean: removes _./dist/_
- build: copy files in _./src_ and _./node_modules_ to _./dist/_ and
  then compile all .ts-files in _./dist_
- dev-server: copy files in _./src_ to _./dist_, compiles all .ts-files
  and then starts the development server (lite-server) and concurrently
  watch for file changes in _./src_ and copy to _./dist/_, then
  _./compile_ if necessary.

#### Auxilliary scripts

- postinstall: at npm install run typings and build
- lite: start lite-server
- cpx: copy application files (ts, html, css, png, jpg) to _./dist/_
- cpx:w: same as _cpx_ but starts a watch and copies at file changes
- cpx-node: copy _./node_modules_ files to _./dist/node_modules_
- tsc: run typescript compiler
- tsc:w: same as tsc but starts a watch and compiles at changes in
  .ts files
- typings: run typings

### Build
Build the application with

    npm run build

When building and running all application files and _./node_modules_
files are placed in _./dist/_.

### Run
Run the development server and watch for changes, continuously updating
the browser with

    npm run dev-server

### Configuration
Typescript compiler is configured in _tsconfig.js_
Typings is configured in _typings.json_
Lite-server is configured in _lite-server.json_
