import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientess');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }
        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas eliminar este tarea?',
                text: "¡Una tarea eliminado no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar.',
                cancelButtonText: 'No, cancelar.'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    //Enviar el delete por medio de axios (En delete necesita enviarle los params)
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                //Eliminar el nodo (El HTML)
                                //Para eliminar la tarea, hay que subir hasta el padre y de ahi mandarle al hijo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Seleccionar el badge
                                var num = document.getElementById('badge');
                                var numInt = Number.parseInt(num.innerText);
                                numInt = numInt - 1;
                                //Actualizar el numero del badge:
                                num.innerHTML = numInt;

                                //Opcional una alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'

                                );
                                actualizarAvance();

                            }
                        })
                }
            })
        }
    })
}
export default tareas;