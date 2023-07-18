'use strict';

const formulario$3 = document.getElementById('formulario');

const validarCantida = () => {
  // esta expresion regular acepta cualquier digito (0-9), y un punto con decimales(opcional)
  const expRegCantidad = /^\d+(\.\d+)?$/;
  // obtenemos el input cantidad
  const inputCantidad = formulario$3.cantidad;

  if (expRegCantidad.test(inputCantidad.value)) {
    inputCantidad.classList.remove('formulario__input--error');
    return true;
  } else {
    inputCantidad.classList.add('formulario__input--error');
    return false;
  }
};

const formulario$2 = document.getElementById('formulario');

const validarNombre = () => {
  const expRegNombre = /[a-zA-Za-y\s]{1,40}$/;
  const inputNombre = formulario$2['nombre-receptor'];

  if (expRegNombre.test(inputNombre.value)) {
    inputNombre.classList.remove('formulario__input--error');
    return true;
  } else {
    inputNombre.classList.add('formulario__input--error');
    return false;
  }
};

const formulario$1 = document.getElementById('formulario');

const validarCorreo = () => {
  const expRegCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const inputCorreo = formulario$1['correo-receptor'];

  if (expRegCorreo.test(inputCorreo.value)) {
    inputCorreo.classList.remove('formulario__input--error');
    return true;
  } else {
    inputCorreo.classList.add('formulario__input--error');
    return false;
  }
};

const marcarPaso = (paso) => {
  document.querySelector(`.linea-pasos [data-paso="${paso}"] span`)
    .classList.add('linea-pasos__paso-check--checked');
};

const siguientePaso = () => {
  // creamos un arreglo con los pasos.
  const pasos = [...document.querySelectorAll('.linea-pasos__paso')];
  //obtenemos el paso activo
  const pasoActivo = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso');
  // obtenemos el index del paso activo
  const indexPasoActivo = pasos.indexOf(pasoActivo);
  if (indexPasoActivo < pasos.length - 1) {
    // eliminas la clase de paso activo
    pasoActivo.querySelector('span').classList.remove('linea-pasos__paso-check--active');
    // ponemos la clase de paso activo al siguiente elemento
    pasos[indexPasoActivo + 1].querySelector('span').classList.add('linea-pasos__paso-check--active');

    const id = pasos[indexPasoActivo + 1].dataset.paso;
    document.querySelector(`.formulario__body [data-paso="${id}"]`).scrollIntoView({
      inline: 'start',
      behavior: 'smooth',
    });
  }
};

const formulario = document.getElementById('formulario');
// reiniciando scroll al cargar el formulario
formulario.querySelector('.formulario__body').scrollLeft = 0;
// este evento sirve para comprobar los campos de formulario cuando el usuario corrige
formulario.addEventListener('keyup', (e) => {
  if (e.target.tagName === 'INPUT') {
    if (e.target.id === 'cantidad') {
      validarCantida();
    } else if (e.target.id === 'nombre-receptor') {
      validarNombre();
    } else if (e.target.id === 'correo-receptor') {
      validarCorreo();
    }
  }
});

const btnFormulario = document.getElementById('formulario__btn');
// este evento sirve para cuando el usuario haga click en el boton de formulario
btnFormulario.addEventListener('click', (e) => {
  e.preventDefault();

  const pasoActual = document.querySelector('.linea-pasos__paso-check--active')
    .closest('.linea-pasos__paso').dataset.paso;

  if (pasoActual === 'cantidad') {
    if (validarCantida()) {
      marcarPaso('cantidad');
      siguientePaso();
    }
  } else if (pasoActual === 'datos') {
    if (validarNombre() && validarCorreo()) {
      marcarPaso('datos');
      siguientePaso();
    }
  } else if (pasoActual === 'metodo') {
    marcarPaso('metodo');
    //  Formato de moneda
    const opciones = { style: 'currency', currency: 'ARS' };
    const formatoMoneda = new Intl.NumberFormat('es-ar', opciones);
    document.querySelector('[data-valor="cantidad"] span').innerText = formatoMoneda.format(formulario.cantidad.value);
    document.querySelector('[data-valor="nombre-receptor"] span').innerText = formulario['nombre-receptor'].value;
    document.querySelector('[data-valor="correo-receptor"] span').innerText = formulario['correo-receptor'].value;
    document.querySelector('[data-valor="metodo"] span').innerText = formulario.metodo.value;
    //  Cambiamos el texto del btn a 'Transferir'
    btnFormulario.querySelector('span').innerHTML = 'Transferir';
    //  Agregamos la clase que desabilita el boton
    btnFormulario.classList.add('formulario__btn--disabled');
    //  Ocultamos el icono de siguiente
    btnFormulario.querySelector('[data-icono="siguiente"]').classList.remove('formulario__btn-contenedor-icono--active');
    //  Mostramos el icono banco
    btnFormulario.querySelector('[data-icono="banco"]').classList.add('formulario__btn-contenedor-icono--active');

    siguientePaso();

    //  Eliminamos la clase de Disabled despues de 4 segundos
    setTimeout(() => {
      btnFormulario.classList.remove('formulario__btn--disabled');
    }, 4000);
  } else if (pasoActual === 'confirmacion' && !btnFormulario.matches('.formulario__btn--disabled')) {
    // AQUI SE HARIA UNA PETICION AL SERVIDOR, UNA REDIRECCION, ETC.

    //  Cambiamos el texto del btn a 'Transferir'
    btnFormulario.querySelector('span').innerText = 'Transfiriendo';
    //  Agregamos la clase que desabilita el boton
    btnFormulario.classList.add('formulario__btn--disabled');

    setTimeout(() => {
      formulario.classList.add('formulario--hidden');
      document.getElementById('alerta').classList.add('alerta--active');
    }, 4000);
  }
});

const linea = document.getElementById('linea-pasos');
linea.addEventListener('click', (e) => {
  // Validamos que el click sea un paso
  if (!e.target.closest('.linea-pasos__paso')) {
    return false;
  }
  const pasoActual = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso').dataset.paso;

  // Validamos el campo actual
  if (pasoActual === 'cantidad') {
    if (!validarCantida()) {
      return
    } else if (pasoActual === 'datos') {
      if (validarNombre() || !validarCorreo()) return;
    }
  }

  // Obtenemos el paso al que queremos volver
  const pasoNavegar = e.target.closest('.linea-pasos__paso');
  // Comprobamos si el icono tiene el icono de la palomita
  // Solo queremos poder dar click a los que tienen palomita
  if (pasoNavegar.querySelector('.linea-pasos__paso-check--checked')) {
    const pasoActual = linea.querySelector('.linea-pasos__paso-check--active');
    pasoActual.classList.remove('linea-pasos__paso-check--active');
    // Obtenemos el identificador del paso a navegar
    const id = pasoNavegar.dataset.paso;
    // Agregamos la clase de active al nuevo paso
    linea.querySelector(`[data-paso="${id}"] span`).classList.add('linea-pasos__paso-check--active');
    // Nos aseguramos de que el texto del boton sea siguiente
    const btnFormulario = document.querySelector('#formulario__btn');
    btnFormulario.querySelector('span').innerText = 'Siguiente';
    // Nos aseguramos de ocultar el icono de banco
    btnFormulario.querySelector('[data-icono="banco"]').classList.remove('formulario__btn-contenedor-icono--active');
    // Nos aseguramos de mostrar el icono siguiente
    btnFormulario.querySelector('[data-icono="siguiente"]').classList.add('formulario__btn-contenedor-icono--active');
    // Nos aseguramos de que no tenga la clase de disabled
    btnFormulario.classList.remove('formulario__btn--disabled');
    // Navegamos al paso
    document.querySelector(`.formulario__body [data-paso="${id}"]`).scrollIntoView({
      inline: 'start',
      behavior: 'smooth',
    });
  }
});
//# sourceMappingURL=bundle.js.map
