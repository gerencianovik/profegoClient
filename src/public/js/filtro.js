'use strict';

class aparicion{
    constructor(){
        this.serviciosFiltros = document.getElementById('serviciosFiltros')
    }
    aparecer(){
        if(this.serviciosFiltros.style.display == 'none'){
            this.serviciosFiltros.style.display = 'block'
        }else{
            this.serviciosFiltros.style.display = 'none'
        }
    }
}

let apariciones = new aparicion()
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fil').addEventListener('click', function () {
        apariciones.aparecer();
    });
});