'use strict';

class Silabus {
    constructor() {
        this.moduleCurrucularContentCourse = document.getElementById('moduleCurrucularContentCourse');
        this.themesyllabusEducational = document.getElementById('themesyllabusEducational');
        this.timesyllabusEducational = document.getElementById('timesyllabusEducational');
        this._listaValoresModulo = [];
        this._listaValoresTema = [];
        this._listaValoresTiempo = [];
        this.contador = new Contador();
    }

    actualizarModulos() {
        this._listaValoresModulo.push('');
        const listaHTML = this._listaValoresModulo.map(() => {
            return `
                <div class="mod">
                    <input name="moduleCurrucularContentCourse" placeholder="Escriba su Modulo">
                    <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                </div>
            `;
        }).join('');
        this.moduleCurrucularContentCourse.innerHTML = listaHTML;
        this.agregarEventosEliminar('moduleCurrucularContentCourse', this._listaValoresModulo);
        this.contador.contadorTotalModulo();
    }

    actualizarTema() {
        this._listaValoresTema.push('');
        const listaHTML = this._listaValoresTema.map(() => {
            return `
                <div class="tems">
                    <input name="themesyllabusEducational" placeholder="Escriba su Tema">
                    <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                </div>
            `;
        }).join('');
        this.themesyllabusEducational.innerHTML = listaHTML;
        this.agregarEventosEliminar('themesyllabusEducational', this._listaValoresTema);
        this.contador.contadorTemaModulo();
    }

    actualizarTiempo() {
        this._listaValoresTiempo.push('');
        const listaHTML = this._listaValoresTiempo.map(() => {
            return `
                <div class="tim">
                    <input name="timesyllabusEducational" placeholder="Escriba su Tiempo de Duracion">
                    <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                </div>
            `;
        }).join('');
        this.timesyllabusEducational.innerHTML = listaHTML;
        this.agregarEventosEliminar('timesyllabusEducational', this._listaValoresTiempo);
        this.contador.contadorDuracionModulo();
    }

    agregarEventosEliminar(name, listaValores) {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach((boton, index) => {
            boton.addEventListener('click', () => {
                listaValores.splice(index, 1);
                this.reiniciarHTML(name, listaValores);
                this.actualizarContadores();
            });
        });
    }

    reiniciarHTML(name, listaValores) {
        const targetElement = document.getElementById(name);
        const listaHTML = listaValores.map(() => {
            return `
                <div class="${name}">
                    <input name="${name}" placeholder="Escriba su ${name === 'moduleCurrucularContentCourse' ? 'Modulo' : name === 'themesyllabusEducational' ? 'Tema' : 'Tiempo'}">
                    <button type="button" class="btn-eliminar"><img src="/img/icons/borrador.png"></button>
                </div>
            `;
        }).join('');
        targetElement.innerHTML = listaHTML;
        this.agregarEventosEliminar(name, listaValores);
    }

    actualizarContadores() {
        this.contador.contadorTotalModulo();
        this.contador.contadorTemaModulo();
        this.contador.contadorDuracionModulo();
    }
}

class Contador {
    constructor() {
        this.ContadorModulos = document.getElementById('ContadorModulos');
        this.contadorClases = document.getElementById('contadorClases');
        this.contadorDuracion = document.getElementById('contadorDuracion');
    }

    contadorTotalModulo() {
        const modulos = document.getElementsByName('moduleCurrucularContentCourse');
        this.ContadorModulos.value = modulos.length;
    }

    contadorTemaModulo() {
        const temas = document.getElementsByName('themesyllabusEducational');
        this.contadorClases.value = temas.length;
    }

    contadorDuracionModulo() {
        const tiempos = document.getElementsByName('timesyllabusEducational');
        this.contadorDuracion.value = tiempos.length;
    }
}

// Instancia de la clase
document.addEventListener('DOMContentLoaded', function () {
    const silabusTotal = new Silabus();
    document.getElementById('moduloBoton').addEventListener('click', function () {
        silabusTotal.actualizarModulos();
    });
    document.getElementById('temaBoton').addEventListener('click', function () {
        silabusTotal.actualizarTema();
    });
    document.getElementById('tiempoBoton').addEventListener('click', function () {
        silabusTotal.actualizarTiempo();
    });
});