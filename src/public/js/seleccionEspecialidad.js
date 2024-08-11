'use strict';

class SeleccionEspecialidades {
    constructor() {
        this._idPermisos = document.getElementById('especial');
        this._permisos = document.getElementById('especialidad');
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
            if (valor === 'especial') {
                return `
                    <li>
                        <input name="especialidadesEscogidas" placeholder="Escriba su especialidad">
                        <button type="button" class="btn-eliminar">Eliminar</button>
                    </li>
                `;
            } else {
                return `
                    <li>
                        <input name="especialidadesEscogidas" value="${valor}" readonly>
                        <button type="button" class="btn-eliminar">Eliminar</button>
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
                const valor = input.value;
                this._listaValores = this._listaValores.filter(item => item !== valor);
                li.remove();
            });
        });
    }
}

// Instancia de la clase
document.addEventListener('DOMContentLoaded', () => {
    const darPermisosEspecialidades = new SeleccionEspecialidades();
});