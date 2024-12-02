const tipoEleccion = 2;
const tipoRecuento = 1;

//retorna los mapas de mapas.js
const provincias = returnMapas();

/*  La variable colorPartidos almacena un arreglo de objetos que representan partidos políticos,
 donde cada objeto contiene el nombre del partido, su color principal y su color claro (para la barra de progreso). */
let colorPartidos = coloresPartidos();

//para guardar los datos filtrados y usarlos en agregar informe
let datosInforme = "";

//carteles de advertencias
var textoVerde = document.getElementById("texto-verde")
var textoAmarillo = document.getElementById("texto-amarillo")
var textoRojo = document.getElementById("texto-rojo")

//para poder cargar los distritos
let datosCargos = 0;

//para poder cargar las secciones
let datosDistritos = 0;

//almacenan los select para interactuar con el usuario
let selectAnio = document.getElementById("select-anio");
let selectCargo = document.getElementById("select-cargo");
let selectDistrito = document.getElementById("select-distrito");
let selectSeccion = document.getElementById("select-seccion")

async function cargarOptionsAnios() {
    try {
        //get a la api y guardamos en la var promesa el resultado
        var promesa = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        console.log(promesa);

        /* si devuelve un status code de 200 (success) la respuesta se convierte en json y se
        almacena en la var datos  */
        if (promesa.status == 200) {
            var datos = await promesa.json()
            console.log(`"Años para seleccionar: ${datos}"`); //responde [2023,2021,2019,2017,2015,2013,2011] al get de la promesa
            

            //se recorre la lista de datos con anio y se crea un option para cada año
            datos.forEach(anio => {
                var option = document.createElement('option'); //se crea el option para el select
                option.innerText = anio; // texto que va a tener el option
                option.value = anio; //valor que va a tener el option
                selectAnio.appendChild(option); //se agrega el option al select
            })

        }
        else {
            console.log("Error en la api");

        }

    } catch (error) {
        console.log(error);

    }
}

//invocamos la funcion
cargarOptionsAnios()

async function cargarOptionsCargo() {

    LimpiarSelect(selectCargo)
    LimpiarSelect(selectDistrito)
    LimpiarSelect(selectSeccion)

    try {
        console.log(selectAnio.value);
        var promesa = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectAnio.value)

        if (promesa.status == 200) {
            var datos = await promesa.json()
            console.log(`"Cargos de ese año en distintas elecciones: ${datos}"`);

            /*Se recorren los datos para encontrar una elección cuyo IdEleccion coincida
            con tipoEleccion. Si coincide, se asignan los cargos de esa elección
            a datosCargos y se imprimen en la consola. */
            datos.forEach(eleccion => {
                if (eleccion.IdEleccion === tipoEleccion) {
                    datosCargos = eleccion.Cargos;
                    console.log("Cargos del año seleccionado y en la eleccion situada");
                    console.log(datosCargos);

                    //creacion de un option para cada cargo en la eleccion filtrada
                    eleccion.Cargos.forEach(cargo => {
                        var option = document.createElement("option");
                        option.innerText = cargo.Cargo;
                        option.value = cargo.IdCargo;
                        selectCargo.appendChild(option);

                    })

                }

            })
        }
        else {
            console.log("Error en la api");

        }
    } catch (error) {
        console.log(error);

    }
}

function LimpiarSelect(select) {
    for (let i = select.length - 1; i > 0; i--) {
        select.remove(i);

    }

    select.selectedIndex = 0;
}


function cargarOptionsDistrito() {
    LimpiarSelect(selectDistrito)
    LimpiarSelect(selectSeccion)


    // Se recorre el arreglo datosCargos, que contiene información de los cargos y sus respectivos distritos.
    for (let i = 0; i < datosCargos.length; i++) {
        if (datosCargos[i].IdCargo == selectCargo.value) {

            datosDistritos = datosCargos[i].Distritos;
            console.log("Distritos del cargo seleccionado");
            console.log(datosDistritos);

            datosCargos[i].Distritos.forEach(distrito => {
                var option = document.createElement("option");
                option.innerText = distrito.Distrito;
                option.value = distrito.IdDistrito;
                selectDistrito.appendChild(option);
            })
        }
    }
}

function cargarOptionsSeccion() {
    LimpiarSelect(selectSeccion)

    if (selectDistrito.value != 0) {

        for (let i = 0; i < datpsDistritos.length; i++) {
            if (datosDistritos[i].IdDistrito === selectDistrito.value) {
                console.log("Secciones del distrito seleccionado");
                console.log(datosDistritos[i].SeccionesProvinciales[0].Secciones);

                datosDistritos[i].SeccionesProvinciales[0].Secciones.forEach(seccion => {
                    var option = document.createElement("option");
                    option.innerText = seccion.Seccion;
                    option.value = seccion.IdSeccion;
                    selectSeccion.appendChild(option);
                })
            }
        }
    }
}

async function Filtrar() {
    try {
        if (selectAnio.value != "" && selectCargo.value != "" && selectDistrito.value != "") {
            
        }
    } catch (error) {
        
    }
}

