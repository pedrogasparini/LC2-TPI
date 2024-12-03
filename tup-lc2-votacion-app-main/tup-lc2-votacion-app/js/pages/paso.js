const tipoEleccion = 1;
const tipoRecuento = 1;

const provincias = returnMapas();

let colorPartidos = coloresPartidos();

let datosInforme = "";

var textoVerde = document.getElementById("texto-verde")
var textoAmarillo = document.getElementById("texto-amarillo")
var textoRojo = document.getElementById("texto-rojo")

let datosCargos = 0;

let datosDistritos = 0;

let selectAnio = document.getElementById("select-anio");
let selectCargo = document.getElementById("select-cargo");
let selectDistrito = document.getElementById("select-distrito");
let selectSeccion = document.getElementById("select-seccion")

async function cargarOptionsAnios() {
    try {
        var promesa = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        console.log(promesa);

        if (promesa.status == 200) {
            var datos = await promesa.json()
            console.log("Años para seleccionar"); 
            console.log(datos);
            

            datos.forEach(anio => {
                var option = document.createElement("option"); 
                option.innerText = anio; 
                option.value = anio;
                selectAnio.appendChild(option); 
            })

        }
        else {
            console.log("Error en la api");

        }

    } catch (error) {
        console.log(error);

    }
}

cargarOptionsAnios()

async function cargarOptionsCargo() {

    LimpiarSelect(selectCargo)
    LimpiarSelect(selectDistrito)
    LimpiarSelect(selectSeccion)

    try {
        console.log(selectAnio.value);
        var promesa = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectAnio.value);
        console.log(promesa);
        

        if (promesa.status == 200) {
            var datos = await promesa.json()
            console.log("Cargos de ese año en distintas elecciones:");
            console.log(datos);

            datos.forEach(eleccion => {
                if (eleccion.IdEleccion === tipoEleccion) {
                    datosCargos = eleccion.Cargos;
                    console.log("Cargos del año seleccionado y en la eleccion situada");
                    console.log(datosCargos);

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
    for ( i = select.length - 1; i > 0; i--) {
        select.remove(i);

    }

    select.selectedIndex = 0;
}


function cargarOptionsDistrito() {
    LimpiarSelect(selectDistrito)
    LimpiarSelect(selectSeccion)


    for ( i = 0; i < datosCargos.length; i++) {
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

    console.log("Valor de selectDistrito.value:", selectDistrito.value)
    console.log("Estructura de datosDistritos:", datosDistritos);


    if (selectDistrito.value != 0) {
        for ( i = 0; i < datosDistritos.length; i++) {
            if (datosDistritos[i].IdDistrito == selectDistrito.value) {
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
        if (selectAnio.value != "" && selectCargo.value != "" && selectDistrito.value != "" && validarSeccionArgentina()) {

            let anioEleccion = selectAnio.value;
            let categoriaId = selectCargo.value;
            let distritoId = selectDistrito.value;
            let seccionId = selectSeccion.value;
            let circuitoId = '';
            let mesaId = '';

            textoAmarillo.style.visibility = "hidden"
            textoRojo.style.visibility = "hidden"
            textoVerde.style.visibility = "hidden"

            var promesa = await fetch(`https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`)
            console.log(promesa);

            if (promesa.status == 200) {
                var datos = await promesa.json();
                console.log(datos);

                datosInforme = datos;
                cambiarTituloSubtitulo(datos)
                cambiarRecuadros(datos)
                cambiarMapa()
                cambiarAgrupacionesPoliticas(datos)
                cambiarBarras(datos)
                document.getElementById("sec-contenido").style.visibility = "visible"
            }
            else {
                cambiarTituloSubtitulo()
                textoRojo.style.visibility = "visible"
            }
        }
        else {
            textoAmarillo.innerText = "Complete todos los campos solicitados!"
            textoAmarillo.style.visibility = "visible"
        }
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("texto-amarillo").innerText = 'Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR';
document.getElementById("texto-amarillo").style.visibility = "visible";
document.getElementById("texto-amarillo").style.color = "black";
document.getElementById("sec-titulo").style.visibility = "hidden";
document.getElementById("sec-contenido").style.visibility = "hidden"

function validarSeccionArgentina() {
    if (selectDistrito.value == 0) {
        return true
    }
    if (selectSeccion.value != "") {
        return true
    } else {
        return false
    }
}

function cambiarTituloSubtitulo(datos = "") {
    let seccion = document.getElementById("sec-titulo");
    let eleccion = 0;

    if (tipoEleccion == 1) {
        eleccion = "Paso"
    } else {
        eleccion = "Generales"
    }

    seccion.style.visibility = "visible";
    seccion.innerHTML = 
    `<section id="sec-titulo">
    <h2>Elecciones ${selectAnio.value} | ${eleccion} </h2>
    <p class="texto-path"> ${selectAnio.value} > ${eleccion} >
    ${selectCargo.options[selectCargo.selectedIndex].textContent}
    > ${selectDistrito.options[selectDistrito.selectedIndex].textContent} > 
    ${selectSeccion.options[selectSeccion.selectedIndex].textContent} </p>
    </section>`

    if (datos != "") {
        if (datos.estadoRecuento.cantidadElectores == 0) {
            textoAmarillo.innerText = "No se encontro info para la request"
            textoAmarillo.style.visibility = "visible"
        }
    }
}

function cambiarMapa() {
    divMapa = document.getElementById("mapa")
    divMapa.innerHTML = `<div class="title">${selectDistrito.options[selectDistrito.selectedIndex].textContent}</div>
        ${provincias[selectDistrito.value]}`
}

function cambiarRecuadros(datos) {
    let mesas = document.getElementById("mesas-escrutadas")
    let electores = document.getElementById("electores")
    let participacion = document.getElementById("part-escrutado")

    mesas.innerHTML = `<img src="img/icons/img1.png" style="width: 70px; margin-right: 10px;"/> <!--Icono urna--> Mesas escrutadas: ${datos.estadoRecuento.mesasTotalizadas}`
    electores.innerHTML = `<img src="img/icons/img3.png" style="width: 70px; margin-right: 10px;"/> <!--Icono personas-->  Electores: ${datos.estadoRecuento.cantidadElectores}`
    participacion.innerHTML = `<img src="img/icons/img4.png" style="width: 70px; margin-right: 10px;"/> <!--Icono manos--> Participación sobre escrutado: ${datos.estadoRecuento.participacionPorcentaje}%`
}

function cambiarAgrupacionesPoliticas(datos) {

    let color = 0
    let colorClaro = 0
    
    let divAgrupaciones = document.getElementById("agrup-politicas")
    let htmlAgrupaciones =
        `<div class="title" id="title-agrup-politicas">Agrupaciones Políticas</div>
        <div class="info-agrupaciones">`

    for (var i = 0; i < datos.valoresTotalizadosPositivos.length; i++) {

        for (var x = 0; x < colorPartidos.length; x++){
            if(datos.valoresTotalizadosPositivos[i].nombreAgrupacion == colorPartidos[x].nombre){
                color = colorPartidos[x].color
                colorClaro = colorPartidos[x].colorClaro
                break
            }
            else{
                color = colorPartidos[5].color
                colorClaro = colorPartidos[5].colorClaro
            }
        }

        htmlAgrupaciones +=
            `<div class="nombre-agrupacion">${datos.valoresTotalizadosPositivos[i].nombreAgrupacion}
            <hr>
            </div>`

        if (datos.valoresTotalizadosPositivos[i].listas) {
            for (var j = 0; j < datos.valoresTotalizadosPositivos[i].listas.length; j++) {
                htmlAgrupaciones +=
                    `<div class="div-agrupaciones">
                    <div><b>${datos.valoresTotalizadosPositivos[i].listas[j].nombre}</b></div>
                    <div>${(datos.valoresTotalizadosPositivos[i].listas[j].votos * 100) / datos.estadoRecuento.cantidadVotantes}% <br>${datos.valoresTotalizadosPositivos[i].listas[j].votos} votos</div>
                </div>
                <div class="progress" style="background: ${colorClaro};">
                    <div class="progress-bar" style="width:${datos.valoresTotalizadosPositivos[i].votosPorcentaje}%; background: ${color};">
                        <span class="progress-bar-text">${datos.valoresTotalizadosPositivos[i].votosPorcentaje}%</span>
                    </div>
                </div>`
            }
        }
        else {
            htmlAgrupaciones +=
                `<div class="div-agrupaciones">
                    <div><b></b></div>
                    <div>${datos.valoresTotalizadosPositivos[i].votosPorcentaje}% <br>${datos.valoresTotalizadosPositivos[i].votos} votos</div>
                </div><div class="progress" style="background: ${colorClaro};">
                    <div class="progress-bar" style="width:${datos.valoresTotalizadosPositivos[i].votosPorcentaje}%; background: ${color};">
                        <span class="progress-bar-text">${datos.valoresTotalizadosPositivos[i].votosPorcentaje}%</span>
                    </div>
                </div>`
        }
    }

    htmlAgrupaciones += `</div>`
    divAgrupaciones.innerHTML = htmlAgrupaciones
}

function cambiarBarras(datos) {
    let color = ""
    let divBarras = document.getElementById("barras")
    let htmlBarras = 
    `<div class="title">Resumen de votos</div>
     <div class="grid">`

    for (var i = 0; i < datos.valoresTotalizadosPositivos.length && i < 7; i++){ 
        
        for (var x = 0; x < colorPartidos.length; x++){
            if(datos.valoresTotalizadosPositivos[i].nombreAgrupacion == colorPartidos[x].nombre){
                color = colorPartidos[x].color
                break
            }
            else{
                color = colorPartidos[5].color
            }
        }

        htmlBarras += 
        `<div class="bar" style="--bar-value:${datos.valoresTotalizadosPositivos[i].votosPorcentaje}%; --bar-color: ${color};"
        data-name="${datos.valoresTotalizadosPositivos[i].nombreAgrupacion}"></div>`
    }

    divBarras.innerHTML = htmlBarras 
}

function agregarInforme() {
    let informe = {
        anio: selectAnio.value,
        tipo: 'Paso', 
        recuento: 'Provisorio',
        cargo: selectCargo.options[selectCargo.selectedIndex].textContent,
        distrito: selectDistrito.options[selectDistrito.selectedIndex].textContent,
        svgDistrito: provincias[selectDistrito.value],
        seccion: selectSeccion.options[selectSeccion.selectedIndex].textContent,
        datos: datosInforme
    };


    var informesLocal = localStorage.getItem('informes');
    console.log(informesLocal)
    informesLocal = JSON.parse(informesLocal);
    var enInformes = false;

    for (var i = 0; i < informesLocal.length; i++) {
        if (JSON.stringify(informesLocal[i]) === JSON.stringify(informe)) {
            enInformes = true;
            break;
        }
    }

    if (!enInformes) {
        informesLocal.push(informe);

        localStorage.setItem('informes', JSON.stringify(informesLocal));
        console.log('informe agregado correctamente');
        textoVerde.innerText = "Informe agregado con exito!!"
        textoVerde.style.visibility = "visible"
    } else {

        textoAmarillo.innerText = "No se puede agregar un informe ya existente"
        textoAmarillo.style.visibility = "visible"
        console.log('El JSON ya existe, no se puede agregar.');
    }
}

