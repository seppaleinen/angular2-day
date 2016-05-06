Labb 1: Få igång Angular 2
==========================

I denna första labb ser vi till att få igång Angular 2 genom att bygga
en superenkel applikation med "hello world"-karaktär.

Vi utgår ifrån våran grund-setup men tittar lite nogrannare på den samt 
lär oss att bootstrappa Angular 2.

Lite bakgrund
-------------

### Node-moduler

Alla nödvändiga beroenden är inkluderade i _package.json_ och när man
kör `npm install` laddas allt ner till _./node_modules_

Om man tittar i _package.json_ under avsnittet "dependencies" ser man 
vilka bibliotek som används, samt deras versioner.

### Typescript
Typscript-kompilatorn är inkluderad som en node-modul i _package.json_ 
och konfigureras i _tsconfig.json_.

Typescript-kompilatorn är konfigurerad att 

- kompilera alla .ts-filer i _./dist_ och placera resultatet jämte 
  ursprungsfil.
- skapa javascript-filer enligt ES5-standard som kommer att fungera 
  i alla browsers.
- skapa source maps så att man kan debugga .ts-filer utifrån genererade
 .js-filer
- använda node_modules för att hitta beroenden vid kompilering 
- stödja "Annotations"

#### Typings
För att typescript skall kunna använda "vanliga" javascript-bibliotek
kan man skapa _typings_-filer som definierar gränssnittet för dessa
"externa" moduler. Det finns en massa färdiga _typings_-filer samt ett 
verktyg för att kunna installera dessa i projektet. 

Filen _typings.json_ deklarerar vilka _typings_ man inkluderat 
(ungefär som _package.json_ alltså).

När man installerar med `npm install` installeras _typings_-filer
under _./typings_

#### SystemJS
Vi använder SystemJS som modul-laddare i applikationen. 

Denna systemkomponent hanterar laddning av applikationskomponenter
och 3pp-libbar i det körande systemet (m.a.o i webbläsaren). 

Den kräver lite konfiguration vilket gjorts i filen _./src/systemjs.config.js_.
 
SystemJS är väldigt flexibel och vi går inte in djupare här på 
allt som kan göras. Men titts gärna in på https://github.com/systemjs/systemjs.   



__Nog om bakgrundsinfo, nu rullar vi!__

Skapa en Angular-komponent
--------------------------
Vi börjar med att lägga till filen _app.component.ts_ i _./src_ med
följande innehåll:

	import { Component } from '@angular/core';

	@Component({
	    selector: 'my-app',
	    template: '<h1>Min Angular2-komponent</h1>'
	})
	export class AppComponent { }
	
OK, vad ser vi här? 

Varje angular behöver en rot-komponent, där en bra konvention är att 
ge den namnet _AppComponent_. Vi implementerar den i form av en 
typescript-klass.

Först ser vi en _import_, ja, äntligen får vi stöd för moduler!
Vi importerar här Angular-komponenter (i detta fall _Component_).

Komponenter är grundläggande i Angular 2 och vi indikerar att en klass
är en komponent med dekoratorn (ekvivalent med annoteringar i java)
@Component. På det sättet hittar angular våra komponenter. 

I @Component anger vi _selector_, vilket är HTML-taggen med vilken man 
kan använda komponenten, t.ex:

	<body>
		<my-app></my-app>
	</body>

Vi anger även _template_. Detta är html-koden som utgör komponentens vy.
Kan även vara en referens till en separat HTML-fil.

Till sist har vi själva typescript-klassen som bara är en tom klass.

Viktigt är dock att vi exporterar den så att den kan importeras i andra
delar av applikationen.

Skapa main, bootstrap av applikationen
--------------------------------------
För att få igång Angular behövs en bootstrap som laddar rot-komponenten.

Detta implementeras i form av _main.ts_:

	import { bootstrap }    from '@angular/platform-browser-dynamic';

	import { AppComponent } from './app.component';

	bootstrap(AppComponent);
	
Här är det rakt på.

Vi importerar angular-lib som innehåller _bootstrap()_ samt våran 
rot-komponent.

Sedan anropar vi _bootstrap_ med våran rot-komponent.

Värt att veta är att rot-komponenten kan laddas på olika sätt i olika 
miljöer.

Skapa index.html
----------------
Vi behöver en huvudsida, _index.html_. Skapa _./src/index.html.

Se kommentarer i HTML-koden.

	<html lang="sv">
      <head>
        <title>Angular 2 Labb 1</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="styles.css">
    
        <!-- 1. Ladda basbibliotek -->
        <!-- Importera Polyfill(s) för gamla webbläsare -->
        <script src="node_modules/es6-shim/es6-shim.min.js"></script>
    
        <!-- Importera Polyfill(s) för Angular2 -->
        <script src="node_modules/zone.js/dist/zone.js"></script>
        <script src="node_modules/reflect-metadata/Reflect.js"></script>

        <!-- Importera SystemJS -->
        <script src="node_modules/systemjs/dist/system.src.js"></script>
    
        <!-- 2. Konfigurera SystemJS med våran konfiguration -->
        <script src="systemjs.config.js"></script>
    
        <!-- 3. Importera våran applikation, dvs SystemJS läser in allt 
                under ./ ('app' är mappat mot './') 
        -->
        <script>
          System.import('app').catch(function(err){ console.error(err);  });
        </script>
      </head>
    
      <!-- 4. Visa applikationen genom att inkludera våran HTML-tagg -->
      <body>
        <my-app>Laddar...</my-app>
      </body>
    </html>

Lite styling på det
-------------------
Till sist slänger vi in lite styling i _./src/styles.css:

    body {
        margin: 2em;
        color: #c7d1cb;
        background-color: #3c3c3c;
        font-family: Arial, Helvetica, sans-serif;
    }
 

Kör applikationen
-----------------
Kör ´npm run dev-server´ och surfa in på http://localhost:12380/

Nu bör det dyka upp en sida med texten: 
      
_Min Angular2-komponent_

Vad har vi gjort?
-----------------

- Vi har skapat våran första Angular2-komponent.
- Vi har skapat en applikations-bootstrap.
- Vi har skapat index.html som laddar grundlibbar samt resten av 
  applikationen med hjälp av SystemJS.  


