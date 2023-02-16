import { InicioCorpoComponent } from './inicio/inicio-corpo/inicio-corpo.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './padrao/header/header.component';
import { SobreCorpoComponent } from './sobre/sobre-corpo/sobre-corpo.component';
import { ProjetosCorpoComponent } from './projetos/projetos-corpo/projetos-corpo.component';




const routes: Routes = [
  {path: '', component: InicioCorpoComponent},
  { path: 'inicio', component: InicioCorpoComponent},
  { path: 'sobre', component: SobreCorpoComponent},
  { path: 'projetos', component: ProjetosCorpoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
