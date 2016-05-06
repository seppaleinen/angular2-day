CAG Angular 2 Lab Day
=====================
This application is intended to be used in the CAG Contactor Angular 2 lab day.

This initial application has just the purpose to check that the development environment is up and running. 

To check that everything works do the following:

    npm install
    npm run build
    npm run dev-server
    
The system default web browser shall open a tab on http://localhost:12380/.
On the page you will should the text _It works!_ . 
In addition an alert that says _Yes typescript compilation works as well!_, should pop up.

If you see all this everything is working as expected and you are good to go for the subsequent labs.

Details
-------

The development environment application uses the following minimum set of developer tools:

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
              
All source code (.html, .ts, .css) and resources (.png, .jpg) are located in _./src/_.

When doing `npm install` _./node_modules/_ will be created, in which 3pp dependencies are placed by NPM.

When building the artifacts making up the runnable application (.js, .js.map, .html, .css, .png and .jpg)are placed in _./dist/_. In addition, the entire _./node_modules_ contents is copied into _./dist/_

When running the development server it uses _./dist/_ as the base to serve from.

If one want to deploy the application into a server, just copy the _./dist_ directory.

### NPM scripts
In package.json the following scripts are defined:

#### Main scripts

- clean: removes _./dist/_ 
- build: compile all .ts-files and copy other files in _./src_ and _./node_modules_ to _./dist/_
- dev-server: compiles all typescript and then starts the development 
  server (lite-server) and concurrently watch for file changes and copy 
  or compile to _./dist/_

#### Auxilliary scripts

- postinstall: at npm install run typings and build
- lite: start lite-server
- cpx: copy application files (html, css, png, jpg) to _./dist/_ 
- cpx:w: same as _cpx_ but starts a watch and copies at file changes 
- cpx-node: copy _./node_modules_ files to _./dist/node_modules_ 
- tsc: run typescript compiler
- tsc:w: same as tsc but starts a watch and compiles at changes in .ts files
- typings: run typings

### Build
Build the application with

    npm run build
    
When building and running all application files and _./node_modules_ files are placed in _./dist/_.

### Run
Run the development server and watch for changes, continuously updating the browser with

    npm run dev-server

### Configuration
Typescript compiler is configured in _tsconfig.js_
Typings is configured in _typings.json_
Lite-server is configured in _lite-server.json_

