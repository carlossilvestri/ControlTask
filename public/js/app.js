import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
/*import a1 from './agregado/sb-admin-2.min';
import a2 from './agregado/popper.min';
import a3 from './agregado/bootstrap.min';
import a4 from './agregado/headroom.min';
import a5 from './agregado/bootstrap.bundle.min';
import a6 from './agregado/jquery.easing.min';
import a7 from './agregado/jquery.waypoints.min';
import a8 from './agregado/sb-admin-2.min';*/

import { actualizarAvance } from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})