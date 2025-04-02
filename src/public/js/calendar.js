document.addEventListener('DOMContentLoaded', function () {
    var dateCoursInit = document.getElementById('fechaInicio').value; // Fecha de inicio
    var dateCoursFin = document.getElementById('fechaFin').value;   // Fecha de fin

    // Convertir el formato de la fecha al formato adecuado
    var startDateParts = dateCoursInit.split('/');
    var endDateParts = dateCoursFin.split('/');
    var startDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
    var endDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);

    function createCalendar() {
        var calendarDiv = document.getElementById('calendar');
        calendarDiv.innerHTML = ''; // Limpiar el contenido previo

        // Crear encabezado del calendario con días de la semana
        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            var dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarDiv.appendChild(dayElement);
        });

        var currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        var firstDay = currentDate.getDay(); // Primer día del mes

        // Rellenar los días antes del primer día del mes
        for (var i = 0; i < firstDay; i++) {
            var emptyElement = document.createElement('div');
            calendarDiv.appendChild(emptyElement);
        }

        // Rellenar los días del mes
        while (currentDate.getMonth() === startDate.getMonth()) {
            var dateElement = document.createElement('div');
            dateElement.className = 'calendar-day';
            dateElement.textContent = currentDate.getDate();

            // Resaltar los días dentro del rango del curso
            if (currentDate >= startDate && currentDate <= endDate) {
                dateElement.classList.add('highlight');
            }

            calendarDiv.appendChild(dateElement);

            // Avanza al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createCalendar();
});