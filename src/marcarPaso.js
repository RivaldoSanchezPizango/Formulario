const marcarPaso = (paso) => {
  document.querySelector(`.linea-pasos [data-paso="${paso}"] span`)
    .classList.add('linea-pasos__paso-check--checked');
}

export default marcarPaso;