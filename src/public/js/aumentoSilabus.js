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
        this.renderizarLista('moduleCurrucularContentCourse', this._listaValoresModulo, 'Modulo');
    }

    actualizarTema() {
        this._listaValoresTema.push('');
        this.renderizarLista('themesyllabusEducational', this._listaValoresTema, 'Tema');
    }

    actualizarTiempo() {
        this._listaValoresTiempo.push('');
        this.renderizarLista('timesyllabusEducational', this._listaValoresTiempo, 'Tiempo de Duracion');
    }

    renderizarLista(name, listaValores, tipo) {
        const listaHTML = listaValores.map((_, index) => {
            return `
            <div class="${name} mod col-11" data-index="${index}">
                <div class="row align-items-center">
                    <div class="col-10 mb-2">
                        <input class="w-100 form-control" name="${name}" placeholder="Escriba su ${tipo}">
                    </div>
                    <div class="col-2 mb-2">
                        <button type="button" class="shadow btn-eliminar p-1"><img class="img-fluid" src="/img/icons/borrador.png"></button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        document.getElementById(name).innerHTML = listaHTML;
        this.agregarEventosEliminar(name, listaValores);
        this.actualizarContadores();
    }

    agregarEventosEliminar(name, listaValores) {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach((boton, index) => {
            boton.addEventListener('click', (e) => {
                const divEliminado = e.target.closest(`.${name}`);
                const indexEliminado = divEliminado.getAttribute('data-index');
                listaValores.splice(indexEliminado, 1);
                divEliminado.remove();
                this.actualizarContadores();
            });
        });
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
