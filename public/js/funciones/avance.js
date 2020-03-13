import Swal from 'sweetalert2';
export const actualizarAvance = () => {
    const porcentaje = document.querySelector('#porcentaje');
    if (porcentaje) {
        //Seleccionar las tareas existentes
        const tareas = document.querySelectorAll('li.tareaa');

        //Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        //Calcular el avance
        //Math.round redondea el numero para que sea un numero entero.
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        //Mostrar el avance
        porcentaje.style.width = avance + '%';
        if (avance === 100) {
            Swal.fire(
                '¡Completaste el Proyecto!',
                'Felicidades has terminado tus tareas.',
                'success'
            );
        }
    }

}