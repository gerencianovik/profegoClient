'use strict';

class nosotros{
    constructor(){
        this.subNav3 = document.getElementById('subNav3')
        this.subNav2 = document.getElementById('subNav2')
        this.subNav1 = document.getElementById('subNav1')
    }
    inicio(){
        this.subNav3.style.display = 'none'
        this.subNav2.style.display = 'none'
        this.subNav1.style.display = 'none'
    }
    cambio1(){
        if(this.subNav1.style.display == 'none'){
            this.subNav1.style.display = 'block'
        }else{
            this.subNav1.style.display = 'none'
        }
    }

    cambio2(){
        if(this.subNav2.style.display == 'none'){
            this.subNav2.style.display = 'block'
        }else{
            this.subNav2.style.display = 'none'
        }
    }

    cambio3(){
        if(this.subNav3.style.display == 'none'){
            this.subNav3.style.display = 'block'
        }else{
            this.subNav3.style.display = 'none'
        }
    }
}

let nosotro =  new nosotros()
window.onload = nosotro.inicio()

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bajar').addEventListener('click', function () {
        nosotro.cambio1();
    });

    document.getElementById('bajar1').addEventListener('click', function () {
        nosotro.cambio2();
    });

    document.getElementById('bajar2').addEventListener('click', function () {
        nosotro.cambio3();
    });
});