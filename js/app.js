///variables
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');;


///eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}




///classes

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }
        else{
            divMensaje.classList.add('alert-success');
            }      
        divMensaje.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divMensaje, formulario);  
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    
}

let ui = new UI();
let presupuesto;

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Indique su presupuesto semanal');
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario); 
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('todos los campos son obligatorios', 'error');
    }
    else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
    }
    else{
        ui.imprimirAlerta('Gasto agregado correctamente', 'correcto');
    }
    setTimeout(() => {
        formulario.reset();
    }, 3000);

    const gasto = { nombre, cantidad,id: Date.now()}

    presupuesto.nuevoGasto(gasto);
    console.log(gasto);
}


    