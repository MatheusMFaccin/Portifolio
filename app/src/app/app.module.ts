import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SobreCorpoComponent } from './sobre/sobre-corpo/sobre-corpo.component';
import { ProjetosCorpoComponent } from './projetos/projetos-corpo/projetos-corpo.component';
import { InicioCorpoComponent } from './inicio/inicio-corpo/inicio-corpo.component';
import { HeaderComponent } from './padrao/header/header.component';
import { SobreHabilidadesComponent } from './sobre/sobre-habilidades/sobre-habilidades.component';
import { SobreProfissionalComponent } from './sobre/sobre-profissional/sobre-profissional.component';
import { LayoutModule } from '@angular/cdk/layout';



@NgModule({
    declarations: [
        
        AppComponent,
        SobreCorpoComponent,
        ProjetosCorpoComponent,
        InicioCorpoComponent,
        HeaderComponent,
        SobreHabilidadesComponent,
        SobreProfissionalComponent,



    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LayoutModule,

    ]
})
export class AppModule { }
