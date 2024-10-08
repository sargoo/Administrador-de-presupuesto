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
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        
        this.restante = this.presupuesto - gastado; 
        
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
        
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

    mostrarGastos(gastos){

        //eliminar el html previo

        this.limpiarHTML();

        //iterar sobre los gastos

        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            //crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            
            //agregar html del gasto
            nuevoGasto.innerHTML = `${nombre}<span class = "badge badge-primary badge-pill"> $ ${cantidad}`;
            

            //boton para borrar el gasto 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'borrar &times';
            nuevoGasto.appendChild(btnBorrar);
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
          
            //agregar al html
            gastoListado.appendChild(nuevoGasto);
        });

    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
                document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){

        const restanteDiv = document.querySelector('.restante');
        const {presupuesto, restante} = presupuestoObj;

        if( (presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        }
        else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//instanciar
const ui = new UI();

let presupuesto;
// funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = Number(prompt('Cual es tu presupuesto?'));
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
    const {gastos, restante} = presupuesto;
    
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicio de formulario
    formulario.reset();
}

function eliminarGasto(id){
    //elimina los gastos del objeto
    presupuesto.eliminarGasto(id);
    //elimina los gasto del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
}