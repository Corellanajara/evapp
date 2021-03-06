import { Component, OnInit } from '@angular/core';
import { UserService } from '../_servicios/user.service';
import { ModalController } from '@ionic/angular';
import { InstrumentoPage } from './instrumento/instrumento.page';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
})
export class EvaluacionesPage implements OnInit {
  private usuarios = [];
  constructor(private modalCtrl:ModalController,private userService:UserService) {
    userService.listar().subscribe(usuarios=>{
      this.usuarios = usuarios;
      console.log(usuarios);
    })
  }

  ngOnInit() {
  }
  public traerUsuarios(evento){
    this.userService.listar().subscribe(usuarios => {
      console.log(usuarios);
      this.usuarios = usuarios;
      if(evento){
        evento.target.complete();
      }
    })
  }
  pendientes(evaluaciones){
    var evs = [];
    for(let i = 0 ; i < evaluaciones.length; i++){
      if(evaluaciones[i].estado == 0){
        evs.push(evaluaciones[i]);
      }
    }
    return evs;
  }
  evaluar(evaluacion){
    console.log(evaluacion);
    console.log(evaluacion.instrumento.nombre);
  }
  async evaluar(i,evaluacion,usuario) {
    console.log(i);
    console.log(evaluacion);
    console.log(usuario);
    const modal = await this.modalCtrl.create({
      component:  InstrumentoPage,
      cssClass: 'modals',
      componentProps: {
      'evaluacion': evaluacion.instrumento,
      //'indicadores':evaluacion.instrumento.indicadores,
      'usuario':usuario
    }
    });
    modal.onDidDismiss().then(modal=>{
      if(modal.data){
        evaluacion.instrumento.indicadores = modal.data.indicadores;
        evaluacion.estado = 1;
        console.log(usuario);
        this.userService.actualizar(usuario._id,usuario).subscribe(res=>{
          console.log(res);
        })
        console.log(modal.data);
      }
    });
    return await modal.present();
  }
}
