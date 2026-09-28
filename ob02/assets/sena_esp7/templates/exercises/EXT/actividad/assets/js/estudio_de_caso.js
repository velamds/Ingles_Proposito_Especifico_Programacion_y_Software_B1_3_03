//INICIO VARIABLES GENERALES
var descripcion = "Find the correct way by making the best decisions.";
var control_de_tiempo = "300";
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","tipo":"texto","pregunta":"I want to get more information on tempfiles.","respuestas":[{"tipo":"texto","respuesta":"Well, tempfiles are those which are in the physical structure forever.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"Well, tempfiles are those which take a while to be created after being modified.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"Well, tempfiles aren’t those which take a while to be created. In fact, it’s the opposite.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"Well, tempfiles are those which do not take a while to be created after modifications.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"after","correcta":"no","texto_final":""},{"id_pregunta":"2","tipo":"texto","pregunta":"We can also say that control files contain the entries to get around…","respuestas":[{"tipo":"texto","respuesta":"the logical structure. They also contain the database name, location and timestamp of different files.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"the logical and physical structure.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"the physical structure. They also contain the database name, locations and timestamps of different files.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"the logical structure, which does not contain the database name, but its location and timestamps.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"not only the physical structure","correcta":"no","texto_final":""},{"id_pregunta":"3","tipo":"texto","pregunta":"In case of presenting a failure or deleting a file,…","respuestas":[{"tipo":"texto","respuesta":"you need to get some more help ASAP, or your documents will be removed.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"you need to back up all the information before having more problems.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"It’s okay if you have created a backup. Otherwise, you’ll be in problems.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"do not worry. All the changes made in the data are recorded!","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"synonym of document","correcta":"no","texto_final":""},{"id_pregunta":"4","tipo":"texto","pregunta":"What can you tell me about the redo log files?","respuestas":[{"tipo":"texto","respuesta":"They are always online, but it’s important that you get offline copies all the time.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"They are always offline, but it’s important that you get online copies all the time.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"They are never online, but it’s important that you get offline copies all the time.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"They are online, but you do not have to worry about making copies all the time.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"they are never offline","correcta":"no","texto_final":""},{"id_pregunta":"5","tipo":"texto","pregunta":"Don’t you think that parameter files are useless?","respuestas":[{"tipo":"texto","respuesta":"Indeed, they are pretty useless. They do not help them as much as they had to.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"These files are good; they fix the errors for us, so we do not have to do much!","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"No way. These files help us to locate and view common errors. Remember that they fix them too.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"No way! These files help us to locate and view common errors. Remember that they do not fix them!","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"find","correcta":"no","texto_final":""}]}';
//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var numero_de_preguntas = preguntas_json.preguntas.length;
var exito_puntaje = (parseInt(numero_de_preguntas) * parseInt(puntaje));
var intento_actual = 1;

var preguntas_json_original = eval("(" + preguntas_txt + ")");
/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/

function inicializar_reglas_actividad() {
    $('#cont_descripcion').html(descripcion);
    if (numero_de_preguntas > 1) {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' questions. This icon will change every time you answer each question.');
    } else {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' question. This icon will change every time you answer each question.');
    }
    if (numero_de_intentos > 1) {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempts to successfully complete the activity.');
    } else {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempt to successfully complete the activity.');
    }
    if (exito_puntaje > 1) {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' points. Each correct answer gives ');
    } else {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' point. Each correct answer gives ');
    }
    if (puntaje > 1) {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' points.');
    } else {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' point.');
    }
    msg_tiempo = 'This activity has no time limit.';
    if (control_de_tiempo !== '' && control_de_tiempo !== '0') {
        if (control_de_tiempo > 1) {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' seconds to complete the activity.';
        } else {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' second to complete the activity.';
        }
    }
    $('#cont_tiempo').html(msg_tiempo);
    logo_animation();
}

function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#modalPregunta').remove();
    $('#cont_puntos').html("0");
    pregunta_actual = 1;
    // preguntas_json.preguntas.mezclar_preguntas();
    inicializa_iconos_preguntas();
    crear_tablero();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function crear_tablero() {
    var html_txt = '';
    html_txt += '<tr class="est_caso_nodos_fila est_caso_fila_nodos_1">';
    html_txt += '<td class="nodo nodo_1"></td>';
    html_txt += '<td class="nodo nodo_2"><img src="assets/img/nodo_3.png" alt="Imagen"/><div class="selector_nodo" id="selector_2"><img id="pasos_2" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_3"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_3"><img id="pasos_3" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_4"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_4"><img id="pasos_4" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_5"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_5"><img id="pasos_5" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_6"><img src="assets/img/nodo_44.png" alt="Imagen"/><div class="selector_nodo" id="selector_6"><img id="pasos_6" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_7"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_7"><img id="pasos_7" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_8"><img src="assets/img/nodo_44.png" alt="Imagen"/><div class="selector_nodo" id="selector_8"><img id="pasos_8" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_9"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_9"><img id="pasos_9" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_10"><img src="assets/img/nodo_7.png" alt="Imagen"/><div class="selector_nodo" id="selector_10"><img id="pasos_10" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '</tr>';
    html_txt += '<tr class="est_caso_nodos_fila est_caso_fila_nodos_2">';
    html_txt += '<td class="nodo nodo_1"><img src="assets/img/nodo_17.png" alt="Imagen"/><div class="selector_nodo" id="selector_11"><img id="pasos_11" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_2"><img src="assets/img/nodo_14.png" alt="Imagen"/><div class="selector_nodo" id="selector_12"><img id="pasos_12" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_3"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_4"><img src="assets/img/nodo_18.png" alt="Imagen"/><div class="selector_nodo" id="selector_14"><img id="pasos_14" src="assets/img/pointer_estudio_caso.png"/></div></td>',
    html_txt += '<td class="nodo nodo_5"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_15"><img id="pasos_15" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_6"><img src="assets/img/nodo_23.png" alt="Imagen"/><div class="selector_nodo" id="selector_16"><img id="pasos_16" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_7"></td>';
    html_txt += '<td class="nodo nodo_8"><img src="assets/img/nodo_3.png" alt="Imagen"/><div class="selector_nodo" id="selector_18"><img id="pasos_18" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_9"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_19"><img id="pasos_19" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_10"><img src="assets/img/nodo_7.png" alt="Imagen"/><div class="selector_nodo" id="selector_02"><img id="pasos_19" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '</tr>';
    html_txt += '<tr class="est_caso_nodos_fila est_caso_fila_nodos_3">';
    html_txt += '<td class="nodo nodo_1"><img src="assets/img/nodo_43.png" alt="Imagen"/><div class="selector_nodo" id="selector_21"><img id="pasos_21" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_2"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_22"><img id="pasos_22" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_3"><img src="assets/img/nodo_31.png" alt="Imagen"/><div class="selector_nodo" id="selector_23"><img id="pasos_23" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_4"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_5"><img src="assets/img/nodo_18.png" alt="Imagen"/><div class="selector_nodo" id="selector_25"><img id="pasos_25" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_6"><img src="assets/img/nodo_26.png" alt="Imagen"/><div class="selector_nodo" id="selector_26"><img id="pasos_26" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_7"><img src="assets/img/nodo_20.png" alt="Imagen"/><div class="selector_nodo" id="selector_27"><img id="pasos_27" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_8"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_28"><img id="pasos_28" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_9"><img src="assets/img/nodo_23.png" alt="Imagen"/><div class="selector_nodo" id="selector_29"><img id="pasos_29" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_10"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '</tr>';
    html_txt += '<tr class="est_caso_nodos_fila est_caso_fila_nodos_4">';
    html_txt += '<td class="nodo nodo_1"><img src="assets/img/nodo_12.png" alt="Imagen"/><div class="selector_nodo" id="selector_31"><img id="pasos_31" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_2"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_3"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_4"><img src="assets/img/nodo_59.png" alt="Imagen"/><div class="selector_nodo" id="selector_34"><img id="pasos_34" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_5"><img src="assets/img/nodo_26.png" alt="Imagen"/><div class="selector_nodo" id="selector_35"><img id="pasos_35" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_6"><img src="assets/img/nodo_10.png" alt="Imagen"/><div class="selector_nodo" id="selector_36"><img id="pasos_36" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_7"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_37"><img id="pasos_37" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_8"><img src="assets/img/nodo_26.png" alt="Imagen"/><div class="selector_nodo" id="selector_38"><img id="pasos_38" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_9"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_10"><img src="assets/img/nodo_8.png" alt="Imagen"/><div class="selector_nodo" id="selector_40"><img id="pasos_40" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '</tr>';
    html_txt += '<tr class="est_caso_nodos_fila est_caso_fila_nodos_5">';
    html_txt += '<td class="nodo nodo_1"><img src="assets/img/nodo_10.png" alt="Imagen"/><div class="selector_nodo" id="selector_41"><img id="pasos_41" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_2"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_42"><img id="pasos_42" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_3"><img src="assets/img/nodo_31.png" alt="Imagen"/><div class="selector_nodo" id="selector_43"><img id="pasos_43" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_4"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_5"><img src="assets/img/nodo_10.png" alt="Imagen"/><div class="selector_nodo" id="selector_45"><img id="pasos_45" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_6"><img src="assets/img/nodo_7.png" alt="Imagen"/><div class="selector_nodo" id="selector_46"><img id="pasos_46" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_7"></td> <!-- .................................................................................................................................................... -->';
    html_txt += '<td class="nodo nodo_8"><img src="assets/img/nodo_10.png" alt="Imagen"/><div class="selector_nodo" id="selector_48"><img id="pasos_48" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_9"><img src="assets/img/nodo_19.png" alt="Imagen"/><div class="selector_nodo" id="selector_49"><img id="pasos_49" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '<td class="nodo nodo_10"><img src="assets/img/nodo_7.png" alt="Imagen"/><div class="selector_nodo" id="selector_50"><img id="pasos_50" src="assets/img/pointer_estudio_caso.png"/></div></td>';
    html_txt += '</tr>';

    $('#contenedor_preguntas').html(html_txt);
}

function siguiente_pregunta() {
    setTimeout(function () {
        mostrar_popup_pregunta();
    }, 1800);
    $('#actividad_pista').html('');
    pasos(pregunta_actual);
    var siguiente_pregunta = preguntas_json.preguntas[pregunta_actual - 1].pregunta;
    var siguiente_frase = preguntas_json.preguntas[pregunta_actual - 1].texto_final;
    if (preguntas_json.preguntas[pregunta_actual - 1].pista !== '') {
        siguiente_pregunta += '<img onclick="interactuar_con_pista(' + pregunta_actual + ');" id="trigger_pista_' + pregunta_actual + '" class="pista_pregunta" alt="Pista" src="../assets/img/pista_ico.png">';
        $('#actividad_pista').html('<p class="pista" id="pista_' + pregunta_actual + '" style="display: none;" >' + preguntas_json.preguntas[pregunta_actual - 1].pista + '</p>');
    }
    // preguntas_json.preguntas[pregunta_actual - 1].respuestas.mezclar_respuestas();
    var html_preguntas = '';
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        html_preguntas += '<div onclick="activar_respuesta_popup(' + i + ');"><div class="radio_button_pregunta" id="pregunta_radio_' + i + '"></div><div class="option_pregunta" id="pregunta_txt_' + i + '">' + preguntas_json.preguntas[pregunta_actual - 1].respuestas[i].respuesta + '</div></div>';
    }
    $('#cont_preguntas_actividad').html(html_preguntas);
    $('#titulo_txt_pregunta').html(siguiente_pregunta);
    $('#titulo_txt_frase').html(siguiente_frase);
    $('#respuesta_seleccionada').val('-1');
    $('#btn_responder_pregunta').css('display', 'none');
}

function pasos(pregunta_actual) {
    if (pregunta_actual === 1) {
        $("#pasos_41").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    } else if (pregunta_actual === 2) {
        $("#pasos_21").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    } else if (pregunta_actual === 3) {
        $("#pasos_23").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    } else if (pregunta_actual === 4) {
        $("#pasos_6").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    } else if (pregunta_actual === 5) {
        $("#pasos_27").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    } else {
        $("#pasos_10").animate({
            width: '300%',
            height: '450%',
            top: '-180%',
            left: '-80%'
        }, 1000, 'easeOutElastic');
    }
}

function responder_pregunta() {
    ocultar_popup_pregunta();
    if (preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].es_correcta === 'si') {
        preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].seleccionada = 'si';
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
        if (preguntas_json.preguntas.length === pregunta_actual) {
            pasos(6);
            setTimeout(function () {
                activar_contenedor('cont_resultados');
                parar_cuenta_regresiva();
                armar_resultados();
            }, 1800);
        } else {
            pregunta_actual++;
            siguiente_pregunta();
        }
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].seleccionada = 'si';
        activar_estrella(pregunta_actual, 'fallo');
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    }
}

function activar_estrella(num_pregunta, estado) {
    var obj_pregunta = $('#pregunta_' + num_pregunta);
    var imagen = '../assets/img/estrella_exito.png';
    var titulo = "CORRECT";
    if (estado === 'fallo') {
        imagen = '../assets/img/estrella_fallo.png';
        titulo = "INCORRECT";
    }
    preguntas_realizadas.push(preguntas_json.preguntas[pregunta_actual - 1]);
    obj_pregunta.fadeOut(500, function () {
        obj_pregunta.attr("src", imagen);
        obj_pregunta.attr("title", titulo);
        obj_pregunta.fadeIn(500);
    });
}

function activar_respuesta_popup(id_popup) {
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        if (i === id_popup) {
            $('#pregunta_radio_' + i).html('<div class="active_radio_center_pregunta"></div>');
        } else {
            $('#pregunta_radio_' + i).html('');
        }
    }
    $('#respuesta_seleccionada').val(id_popup);
    $('#btn_responder_pregunta').css('display', 'block');
}

function limpiar_json() {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        preguntas_json.preguntas[i].respuestas[0].seleccionada = 'no';
    }
}

function reintentar() {
    respuestas_realizadas = new Array();
    preguntas_realizadas = new Array();
    limpiar_json();
    $('#cont_puntos').html("0");
    puntaje_actual = "0";
    sum_pregunta = 1;
    intento_actual++;
    inicializar_actividad();
}

function armar_resultados() {
    ocultar_popup_pregunta();
    $('#titulo_txt_pregunta').html('');
    $('#titulo_txt_frase').html('');
    $('#actividad_pista').html('');
    if (puntaje_actual >= exito_puntaje) {
        $('#txt_pagina_resultados').html('Success <img src="../assets/img/mano_arriba.png" alt="Success"/>');
        $('.resultados_preguntas').css('display', 'block');
        $('.resultados_preguntas').html(calcular_resultados());
        $('.cont_reintentar').css('display', 'none');
    } else {
        if (intento_actual === numero_de_intentos) {
            $('#txt_pagina_resultados').html('Failure <img src="../assets/img/mano_abajo.png" alt="Failure"/>');
            $('.resultados_preguntas').css('display', 'block');
            $('.resultados_preguntas').html(calcular_resultados());
            $('.cont_reintentar').css('display', 'none');
        } else {
            $('.resultados_preguntas').css('display', 'none');
            $('.cont_reintentar').css('display', 'block');
            if ((numero_de_intentos - intento_actual) > 1) {
                msg_intentos = "You have " + (numero_de_intentos - intento_actual) + " attempts left.";
            } else {
                msg_intentos = "you have 1 try.";
            }
            $('#cantidad_intentos_restantes').html(msg_intentos);
        }
    }
}

function calcular_resultados() {
    var resultados = '';
    var tu_respuesta;
    var respuesta_correcta;
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">' + preguntas_realizadas[i].pregunta + '</p>';
            for (var j = 0; j < preguntas_realizadas[i].respuestas.length; j++) {
                if (preguntas_realizadas[i].respuestas[j].seleccionada === 'si') {
                    tu_respuesta = preguntas_realizadas[i].respuestas[j].respuesta;
                }
                if (preguntas_realizadas[i].respuestas[j].es_correcta === 'si') {
                    respuesta_correcta = preguntas_realizadas[i].respuestas[j].respuesta;
                    //respuesta_correcta = preguntas_realizadas[i].pregunta;
                }
            }
            if (preguntas_realizadas[i].correcta === 'si') {
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
            } else {
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
            }
            resultados += '<p class="subtitulo_respuesta_txt">Your answer&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer&nbsp;&nbsp;<span>' + respuesta_correcta + '</span></p>';
            if (preguntas_realizadas[i].justificacion !== '') {
                resultados += '<p class="subtitulo_respuesta_txt">Justification <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<p>&nbsp;</p>';
            resultados += '<p>&nbsp;</p>';
            resultados += '<p>&nbsp;</p>';
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}

function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}

function mostrar_popup_pregunta() {
    $('#modalPreguntaEc').css('display', 'block');
    $('#popup_overlay').fadeIn('slow');
    return false;
}

function ocultar_popup_pregunta() {
    $('#modalPreguntaEc').css('display', 'none');
    $('#popup_overlay').fadeOut('slow');
    return false;
}

function inicializa_iconos_preguntas() {
    var html_txt = '';
    for (var i = 1; i <= parseInt(numero_de_preguntas); i++) {
        html_txt += '<div class="pregunta_' + i + '"><img title="QUESTION ' + i + '" id="pregunta_' + i + '" src="../assets/img/estrella_turno_actual.png" alt="Icono"/></div>';
    }
    $('.preguntas').html(html_txt);
}


function activar_contenedor(contenedor) {
    if (contenedor === 'cont_actividad') {
        $('#cont_actividad').fadeIn(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'inicio_actividad') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeIn(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'cont_resultados') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeIn(1000);
    } else {
        console.log('ERROR GARRAFAL. NO LLEGO TIPO DE CONTENEDOR. CONTACTE AL PROVEEDOR DEL SOFTWARE.');
        return false;
    }
}

/*INICIO FUNCIONES DEL CRONOMETRO*/
function activar_cronometro() {
    if (control_de_tiempo > 0) {
        $('.tiempo_actividad').css('display', 'block');
        inicio_cuenta_regresiva(control_de_tiempo);
    } else {
        $('.tiempo_actividad').css('display', 'none');
    }
}

function inicio_cuenta_regresiva(control_de_tiempo) {
    if (typeof control !== 'undefined') {
        reinicio_cuenta_regresiva(control_de_tiempo);
    } else {
        segundos = control_de_tiempo;
        control = setInterval(cuenta_regresiva, 1000);
    }
}

function parar_cuenta_regresiva() {
    if (control_de_tiempo > 0) {
        clearInterval(control);
    }
}

function reinicio_cuenta_regresiva(control_de_tiempo) {
    clearInterval(control);
    segundos = control_de_tiempo;
    $('#cont_segundos').html(segundos);
    control = setInterval(cuenta_regresiva, 1000);
}

function cuenta_regresiva() {
    $('#cont_segundos').html(segundos);
    if (segundos === 0) {
        parar_cuenta_regresiva();
        perdio_por_tiempo();
    } else {
        segundos--;
    }
}
/*FIN FUNCIONES DEL CRONOMETRO*/

Array.prototype.mezclar_preguntas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};
Array.prototype.mezclar_respuestas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));