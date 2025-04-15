'use strict';

class SeleccionEdades {
    constructor() {
        this._idPermisos = document.getElementById('edadRango');
        this._permisos = document.getElementById('rangeAgeTeacher');
        this._listaValores = [];
        this._idPermisos.addEventListener('change', () => this.permisosListaedad());
    }

    permisosListaedad() {
        const valorSeleccionado = this._idPermisos.value;
        if (valorSeleccionado && !this._listaValores.includes(valorSeleccionado)) {
            this._listaValores.push(valorSeleccionado);
            this.actualizarLista();
        }
    }

    actualizarLista() {
        const listaHTML = this._listaValores.map(valor => `
            <li class="input-group mt-1 w-75">
                <input name="edadesEscogidas" class="form-control" value="${valor}" readonly>
                <button type="button" class="btn-eliminar btn btn-danger input-group-text">Eliminar</button>
            </li>
        `).join('');
        this._permisos.innerHTML = `<ul>${listaHTML}</ul>`;
        this.agregarEventosEliminar();
    }

    agregarEventosEliminar() {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const li = event.target.parentElement;
                const input = li.querySelector('input');
                const valor = input.value;
                this._listaValores = this._listaValores.filter(item => item !== valor);
                li.remove();
            });
        });
    }
}

// Instancia de la clase
document.addEventListener('DOMContentLoaded', () => {
    const darPermisosEdades = new SeleccionEdades();
});