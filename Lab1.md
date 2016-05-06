Labb 1: Få igång Angular 2
==========================

I denna första labb ser vi till att få igång Angular 2 genom att bygga
en superenkel applikation med "hello world"-karaktär.

Vi utgår ifrån våran grund-setup men tittar lite nogrannare på den samt 
lär oss att bootstrappa Angular 2.

Typescript
----------
Typscript-kompilatorn är inkluderad som en node-modul i _package.json_ 
och konfigureras i _tsconfig.json_.

Typescript-kompilatorn är konfigurerad att 

- kompilera .ts-filer och placera resultateti _./dist_.
- skapa javascript-filer enligt ES5-standard som kommer att fungera 
  i alla browsers.
- skapa source maps så att man kan debugga .ts-filer utifrån genererade
 .js-filer
- stödja "Annotations"
 


