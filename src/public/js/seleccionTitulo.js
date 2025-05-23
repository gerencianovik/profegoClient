'use strict';

class SeleccionTitulos {
    constructor() {
        this._idPermisos = document.getElementById('titulosElecciones');
        this._permisos = document.getElementById('titulosss');
        this._listaValores = [];
        this._idPermisos.addEventListener('change', () => this.permisosLista());
    }

    permisosLista() {
        const valorSeleccionado = this._idPermisos.value;
        if (valorSeleccionado && !this._listaValores.includes(valorSeleccionado)) {
            this._listaValores.push(valorSeleccionado);
            this.actualizarLista();
        }
    }

    actualizarLista() {
        const listaHTML = this._listaValores.map(valor => {
            if (valor === 'titulo') {
                return `
                    <li class="input-group mt-1 w-75">
                        <input name="tituloEscogidas" class="form-control" placeholder="Escriba su título">
                        <button type="button" class="btn-eliminar btn btn-danger input-group-text">Eliminar</button>
                    </li>
                `;
            } else {
                return `
                    <li class="input-group mt-1 w-75">
                        <input name="tituloEscogidas" class="form-control" value="${valor}" readonly>
                        <button type="button" class="btn-eliminar btn btn-danger input-group-text">Eliminar</button>
                    </li>
                `;
            }
        }).join('');
        this._permisos.innerHTML = `<ul>${listaHTML}</ul>`;
        this.agregarEventosEliminar();
    }

    agregarEventosEliminar() {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const li = event.target.parentElement;
                const input = li.querySelector('input');
                const valor = input.hasAttribute('readonly') ? input.value : 'titulo';
                this._listaValores = this._listaValores.filter(item => item !== valor);
                li.remove();
            });
        });
    }
}

// Instancia de la clase
document.addEventListener('DOMContentLoaded', () => {
    const darPermisosTitulos = new SeleccionTitulos();
});