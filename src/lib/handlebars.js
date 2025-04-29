const timeago = require('timeago.js');
const { descifrarDatos } = require('./encrypDates');

const helpers = {};

helpers.formatTimeAgo = (savedTimestamp) => {
    return timeago.format(savedTimestamp);
};

// Agregar el helper ifCond
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

helpers.descifrar = function(cifrado) {
  return descifrarDatos(cifrado);
};

// Helper para obtener iniciales del nombre
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

// Helper para verificar el rol de teacher
helpers.ifCond = function(v1, operator, v2, options) {
  if (operator === '==') {
      return v1 == v2 ? options.fn(this) : options.inverse(this);
  }
  return options.inverse(this);
};
module.exports = helpers;