function actualizarEstados() {
    document.querySelectorAll("input[id^='estado']").forEach(input => {
        const estadoActivo = input.nextElementSibling;
        const estadoDesactivo = estadoActivo.nextElementSibling;
        if (!estadoActivo || !estadoDesactivo) return;

        const valor = input.value;
        if (valor === "Activar") {
            estadoActivo.style.display = "inline";
            estadoDesactivo.style.display = "none";
        } else if (valor === "Desactivar") {
            estadoActivo.style.display = "none";
            estadoDesactivo.style.display = "inline";
        } else {
            estadoActivo.style.display = "none";
            estadoDesactivo.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(actualizarEstados, 500);
});

document.addEventListener("input", function (event) {
    if (event.target.matches("input[id^='estado']")) {
        actualizarEstados();
    }
});