let actualizarPendiente = false;

function actualizarEstados() {
    if (actualizarPendiente) return;

    actualizarPendiente = true;

    setTimeout(() => {

        document.querySelectorAll("input[id^='estado']").forEach(input => {
            const card = input.closest(".card"); 
            if (!card) return; 

            const estadoActivo = card.querySelector("#estadoActivo");
            const estadoDesactivo = card.querySelector("#estadoDesactivo");

            if (estadoActivo && estadoDesactivo) {
                const valor = input.value.trim().toLowerCase();
                estadoActivo.style.display = valor === "activar" ? "block" : "none";
                estadoDesactivo.style.display = valor === "desactivar" ? "block" : "none";
            }

            const botonHabilitar = card.querySelector(".habilitarButton");
            const botonDeshabilitar = card.querySelector(".deshabilitarButton");           

            if (botonHabilitar && botonDeshabilitar) {
                const valor = input.value.trim().toLowerCase();
                botonHabilitar.style.display = valor === "desactivar" ? "block" : "none";
                botonDeshabilitar.style.display = valor === "activar" ? "block" : "none";
            }
        });

        actualizarPendiente = false;
    }, 50);
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarEstados();
});

document.addEventListener("input", function (event) {
    if (event.target.matches("input[id^='estado']")) {
        actualizarEstados();
    }
});
