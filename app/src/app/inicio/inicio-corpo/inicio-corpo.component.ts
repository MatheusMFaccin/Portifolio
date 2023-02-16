import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';



@Component({
  selector: 'app-inicio-corpo',
  templateUrl: './inicio-corpo.component.html',
  styleUrls: [
    './inicio-corpo.component.css',]
})
export class InicioCorpoComponent implements OnInit {
  tamanhoAtual:string= "default";
  titulo:string = "Ola! meu nome é Matheus Faccin.";
  paragrafo:string = "trabalho com as seguintes tecnologias"
  constructor() {

  }

  ngOnInit(){


  }



}
