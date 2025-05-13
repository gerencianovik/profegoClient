const timeago = require('timeago.js');
const { descifrarDatos } = require('./encrypDates');

const helpers = {};

// Formateador de fecha relativa
helpers.formatTimeAgo = (savedTimestamp) => {
    return timeago.format(savedTimestamp);
};

// Helper condicional mejorado
helpers.ifCond = function(v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
};

// Helper para manejar objetos y arrays
helpers.contains = function(array, value, options) {
  // Si recibimos los parámetros en formato antiguo
  if (arguments.length === 3) {
      if (!array || !value) return options.inverse(this);
      
      const found = array.some(item => {
          if (typeof item === 'object' && item !== null) {
              return item.value == value || item == value;
          }
          return item == value;
      });
      return found ? options.fn(this) : options.inverse(this);
  }
  // Si recibimos los parámetros en formato nuevo (options como último parámetro)
  else if (arguments.length === 2) {
      options = value;
      return options.inverse(this);
  }
};

// Helper para mostrar valores de objetos
helpers.displayValue = function(obj, property) {
    if (!obj) return '';
    if (typeof obj === 'object') {
        return obj[property] || obj.value || obj.name || obj.label || '';
    }
    return obj;
};

// Helper de igualdad extendida
helpers.eq = function(a, b, options) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return JSON.stringify(a) === JSON.stringify(b) ? options.fn(this) : options.inverse(this);
    }
    return a == b ? options.fn(this) : options.inverse ? options.inverse(this) : '';
};

// Helper para descifrado
helpers.descifrar = function(cifrado) {
    return descifrarDatos(cifrado);
};

// Helper para obtener iniciales
helpers.getInitials = function(nombreCifrado) {
    try {
        const nombre = descifrarDatos(nombreCifrado) || 'Usuario';
        const names = nombre.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    } catch (error) {
        console.error('Error al obtener iniciales:', error);
        return 'US';
    }
};

// Helper para verificación de rol
helpers.isTeacherRole = function(role, options) {
    return role === 'teacher' ? options.fn(this) : options.inverse(this);
};

helpers.isStudentRole = function(role, options) {
    return role === 'student' ? options.fn(this) : options.inverse(this);
};

// Helper para truncar texto
helpers.truncate = function(str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + '...';
    }
    return str;
};

module.exports = helpers;