const formulario = document.getElementById('formulario');

const validarCantida = () => {
  // esta expresion regular acepta cualquier digito (0-9), y un punto con decimales(opcional)
  const expRegCantidad = /^\d+(\.\d+)?$/;
  // obtenemos el input cantidad
  const inputCantidad = formulario.cantidad;

  if (expRegCantidad.test(inputCantidad.value)) {
    inputCantidad.classList.remove('formulario__input--error');
    return true;
  } else {
    inputCantidad.classList.add('formulario__input--error');
    return false;
  }
}

export default validarCantida;