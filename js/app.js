// variabes y selectores

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto);
}

// clases   

class Presupuesto{
    constructor(presupuesto){
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
    insertarPresupuesto(monto){

        //extraer valores
        const {presupuesto,restante} = monto;

        //agregar al html
        document.querySelector('#total'). textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje
        divMensaje.textContent = mensaje;
        //insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //borrar el mensaje
        setTimeout(()=>{
            divMensaje.remove();
        }, 3000)
    }
}
500
//instanciar
const ui = new UI();

let presupuesto;
// funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');
    //console.log(presupuestoUsuario);
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('ambos campos son obligatorios', 'error');   
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('cantidad no valida','error');
        return;
    }

    //generar objeto con el gasto

    const gasto = {nombre, cantidad,id:Date.now()};

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje de gasto cargado
    ui.imprimirAlerta('Gasto agregado correctamente');
    
    //imprimir gasto
    const {gastos} = presupuesto
    ui.agregarGastoListado(gastos);

    //reinicio de formulario
    formulario.reset();
}