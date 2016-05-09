CAG Angular 2 Kompetensutvecklingsdag
=====================================

Setup
-----
Utvecklingsmiljön är baserad på NodeJS v6.0.0 så man måste installera
NodeJS först och främst.

Utvecklingsmiljön använder följande utvecklingsverktyg:
- lite-server (https://github.com/johnpapa/lite-server)
- typescript (https://github.com/Microsoft/TypeScript)
- typings (https://github.com/typings/typings)
- cpx (https://www.npmjs.com/package/cpx)

### Katalogstruktur

    angular2-day
      |
      +- src
      |
      +- dist
      |
      +- (node_modules)

All källkod (.html, .ts, .css) and resurser (.png, .jpg) ligger
under `./src/`.

När man kör `npm install` så skapas ./node_modules`-katalogen där
alla 3PP-bibliotek läggs av NPM.

När man kör `npm run build` händer följande:

- `./node_modules kopieras till `./dist`
- alla filer i `./src` kopieras till `./dist`
- Typescript-kompilering körs på alla `.ts`-filer i `./dist`
  och resultat (`.js`- och `.js.map`-filer) läggs bredvid sina
  `.ts`-filer

När man kör utvecklingsservern (lite-server) används `./dist`
som bas-katalog.

### NPM-skript
Följande script är definierade i `package.json` och kan
köras med `npm run \<script-namn\>`:

#### Huvudskript

- clean: tar bort `./dist`-katalogen
- build: kopierar alla filer i `./src` `./node_modules` till
  `./dist/` och kompilerar sedan alla typescript-filer under
  `./dist`
- dev-server: kopierar alla filer i `./src` till `./dist`,
  kompilerar alla `.ts`-filer och startar sedan
  utvecklingsservern (lite-server) och startar sedan parallellt
  en bevakning av filförändringar (cpx) som kontinuerligt
  kopierar alla filer som ändras i `./src` till `./dist/`, samt
  en kontinuerlig kompilering av ändrade i `.ts`-filer i
  `./dist`-katalogen.

#### Hjälpskript

- postinstall: vid slutet av körning av `npm install` körs
  `typings` och `npm run build`
- lite: starta lite-server
- cpx: kopier applikationsfiler i `./src` (ts, html, css, png, jpg)
  till `./dist/`
- cpx:w: sammas som `cpx` men startar även kontinuerlig bevakning
  som kopierar dessa filer vid förändringar
- cpx-node: kopiera `./node_modules`-filer till `./dist/node_modules`
- tsc: kör typescript-komplering
- tsc:w: samma som `tsc` men startar även kontinuerlig bevakning
  av `.ts`-filer och kompilerar vid förändring
- typings: kör `typings`

### Rensa
Rensa alla byggartefakter med

    npm run clean

### Bygga applikationen
Bygg hela applikationen med

    npm run build


### Kör
Kör applikationen i utvecklings-servern med bevakning alla ändringar
och automatisk kopiering och omkompilering.

    npm run dev-server

### Konfiguration
Typescript-kompilatorn är konfigurerad i `tsconfig.js`
Typings är konfigurerad i `typings.json`
Lite-server är konfigurerad i `lite-server.json`

Installera lokal NodeJS med maven
---------------------------------
För den som vill installera en lokal NodeJS för projektet, så 
finns en maven-pom med stöd för detta. Men det behövs normalt
inte.

Kör i så fall för att installera node

    mvn package
    
Sedan kör man alla npm-kommandon med

    ./node/npm <kommando>
    
t.ex
    
    ./node/npm install
    ./node/npm run build
    ./node/npm run dev-server
    

