//INICIO VARIABLES GENERALES
var descripcion = "Read each statement and write the correct answer in the gap.";
var control_de_tiempo = "240";
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","tipo":"letrao","pregunta":"Any good company needs to ___up with internet computing.","orientacion":"or","pos_x":"8","pos_y":"10","respuestas":[{"tipo":"letrao","respuesta":"keep","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"2","tipo":"letrao","pregunta":"I’m not sure why a company decides to use the client/server application architecture. I’d _______ on the multi-tier.","orientacion":"su","pos_x":"9","pos_y":"5","respuestas":[{"tipo":"letrao","respuesta":"settle","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"3","tipo":"letrao","pregunta":"Let me _______ over the client/server architecture. It is simple.","orientacion":"su","pos_x":"6","pos_y":"6","respuestas":[{"tipo":"letrao","respuesta":"go","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"4","tipo":"letrao","pregunta":"I always ______ on multitier architecture. It’s very reliable.","orientacion":"or","pos_x":"5","pos_y":"7","respuestas":[{"tipo":"letrao","respuesta":"count","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"5","tipo":"letrao","pregunta":"The multi-tier servers as a bridge to ________ on information between the client and the database server.","orientacion":"or","pos_x":"7","pos_y":"5","respuestas":[{"tipo":"letrao","respuesta":"pass","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"}]}';
var matriz = "17x17";
var preguntas_horizontal = [];
var preguntas_vertical = [];
var posicion = [];
var respuesta = [];

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
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
    $('#btn_actividad_container').html('');
    $('#cont_puntos').html("0");
    $('#contenedor_droppables').html('');
    $('#contenedor_preguntas').html('');
    pregunta_actual = 1;
    inicializa_preguntas();
    icicializar_tablero();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function icicializar_tablero() {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        var longitud_palabra = preguntas_json.preguntas[i].respuestas[0].respuesta.length;
        if (preguntas_json.preguntas[i].orientacion === 'or') {
            for (var j = 0; j < longitud_palabra; j++) {
                var obj = {
                    pos_x: (parseInt(preguntas_json.preguntas[i].pos_x) + j),
                    pos_y: preguntas_json.preguntas[i].pos_y,
                    ini_x: preguntas_json.preguntas[i].pos_x,
                    ini_y: preguntas_json.preguntas[i].pos_y
                }
                posicion.push(obj);
            }
        }
        if (preguntas_json.preguntas[i].orientacion === 'su') {
            for (var j = 0; j < longitud_palabra; j++) {
                var obj = {
                    pos_x: preguntas_json.preguntas[i].pos_x,
                    pos_y: (parseInt(preguntas_json.preguntas[i].pos_y) + j),
                    ini_x: preguntas_json.preguntas[i].pos_x,
                    ini_y: preguntas_json.preguntas[i].pos_y

                }
                posicion.push(obj);
            }
        }
    }
    pintar_tablero();
    for (var k = 0; k < preguntas_horizontal.length; k++) {
        var contador = (k + 1);
        $('#span_' + preguntas_horizontal[k].pos_y + '_' + preguntas_horizontal[k].pos_x).html(contador);
    }
    for (var k = 0; k < preguntas_vertical.length; k++) {
        var contador = (k + 1);
        $('#span_' + preguntas_vertical[k].pos_y + '_' + preguntas_vertical[k].pos_x).html(contador);
    }
}

function pintar_tablero() {
    var partes = matriz.split("x");
    var html_txt = '';
    $('#contenedor_preguntas').html('');
    html_txt += '<table>';
    for (var i = 0; i < partes[0]; i++) {
        html_txt += '<tr>';
        for (var j = 0; j < partes[1]; j++) {
            var control = 0;
            for (var k = 0; k < posicion.length; k++) {
                if ((j == posicion[k].pos_x) && (i == posicion[k].pos_y) && (control == 0)) {
                    html_txt += '<td><span id="span_' + i + '_' + j + '"></span><label id="' + i + '_' + j + '"></label></td>';
                    control = 1;
                }
            }
            if (control == 0) {
                html_txt += '<td bgcolor="#0b4c5e"><img src="assets/img/bg_crucigrama_td.png" style="width:100%;height:100%;position:absolute;top:0;left:0;"/><label id="' + i + '_' + j + '"></label></td>';
            }
        }
        html_txt += '</tr>';
    }
    html_txt += '</table>';
    $('#contenedor_preguntas').html(html_txt);
}
function borrar_input_h(pos_x, pos_y, num, num_id) {
    var longitud = $('#length_h_' + num).val();
    for (var i = 0; i < longitud; i++) {
        var x = (parseInt(pos_x) + i);
        var y = pos_y;
        var id = y + '_' + x;
        $('#' + id).html('');
        $('#respuesta_h_' + num).val('');
    }
    preguntas_horizontal[num_id].seleccionada = 'no';
    preguntas_horizontal[num_id].tu_respuesta = '';
    preguntas_horizontal[num_id].es_correcta = 'no';
    if (preguntas_horizontal[num_id].puntaje > 0) {
        preguntas_horizontal[num_id].puntaje = 0;
        puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    }
    if (preguntas_horizontal[num_id].puntaje > 0) {
        puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    }
    respuesta = [];
    $('#check_cerrar_h_' + num).hide();
    $('#respuesta_h_' + num).attr('readonly', false);
    $('#btn_actividad_container button').css('display', 'none');
}

function limpiar_letra(letra) {
    var letra = letra.toLowerCase(); // a minusculas
    letra = letra.replace('á', 'a');
    letra = letra.replace('à', 'a');
    letra = letra.replace('ä', 'a');
    letra = letra.replace('â', 'a');
    letra = letra.replace('å', 'a');
    letra = letra.replace('é', 'e');
    letra = letra.replace('è', 'e');
    letra = letra.replace('ë', 'e');
    letra = letra.replace('ê', 'e');
    letra = letra.replace('í', 'i');
    letra = letra.replace('ì', 'i');
    letra = letra.replace('ï', 'i');
    letra = letra.replace('î', 'i');
    letra = letra.replace('ó', 'o');
    letra = letra.replace('ò', 'o');
    letra = letra.replace('ö', 'o');
    letra = letra.replace('ô', 'o');
    letra = letra.replace('ú', 'u');
    letra = letra.replace('ù', 'u');
    letra = letra.replace('ü', 'u');
    letra = letra.replace('û', 'u');
    letra = letra.replace('ý', 'y');
    letra = letra.replace('ÿ', 'y');
    letra = letra.replace('ñ', 'n');
    letra = letra.replace('ç', 'c');
    return letra;
}

function my_horizontal(e, pos_x, pos_y, num, num_id) {

    if ($('#respuesta_h_' + num).attr('readonly') === 'readonly') {
        return false;
    }
    if (e.keyCode == 9) {  //tab pressed
        e.preventDefault(); // stops its action
        return false;
    }
    var keynum;
    var longitud = $('#length_h_' + num).val();
    if (window.event) { // IE                    
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                   
        keynum = e.which;
    }
    if (e.key !== 'Dead') {
        var obj = {
            'letra': limpiar_letra(e.key)
        }
        respuesta.push(obj);
    }

    if ((e.keyCode == 8) || (e.keyCode == 46) || (e.keyCode == 13)) {
        for (var i = 0; i < longitud; i++) {
            var x = (parseInt(pos_x) + i);
            var y = pos_y;
            var id = y + '_' + x;
            $('#' + id).html('');
            $('#respuesta_h_' + num).val('');
        }
        preguntas_horizontal[num_id].seleccionada = 'no';
        preguntas_horizontal[num_id].tu_respuesta = '';
        preguntas_horizontal[num_id].es_correcta = 'no';
        if (preguntas_horizontal[num_id].puntaje > 0) {
            preguntas_horizontal[num_id].puntaje = 0;
            puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
        }
        $('#check_cerrar_h_' + num).hide();
        respuesta = [];
    }

    if (longitud == respuesta.length) {
        console.log(respuesta);
        var letra = '';
        var respuesta_correcta = '';
        var letra_mimuscula = '';
        var count_horizontal = 0;
        var count_vertical = 0;
        for (var i = 0; i < respuesta.length; i++) {
            var x = (parseInt(pos_x) + i);
            var y = pos_y;
            var id = y + '_' + x;
            $('#' + id).html(respuesta[i].letra);
            letra += respuesta[i].letra;
        }
        letra_mimuscula = letra.toLowerCase();
        preguntas_horizontal[num_id].seleccionada = 'si';
        preguntas_horizontal[num_id].tu_respuesta = letra_mimuscula;
        respuesta_correcta = preguntas_horizontal[num_id].respuesta.toLowerCase();
        if (respuesta_correcta === preguntas_horizontal[num_id].tu_respuesta) {
            preguntas_horizontal[num_id].es_correcta = 'si';
            preguntas_horizontal[num_id].puntaje = parseInt(puntaje);
            puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
        } else {
            preguntas_horizontal[num_id].es_correcta = 'no';
        }
        for (var i = 0; i < preguntas_horizontal.length; i++) {
            if (preguntas_horizontal[i].seleccionada === 'si') {
                count_horizontal++;
            }
        }

        for (var i = 0; i < preguntas_vertical.length; i++) {
            if (preguntas_vertical[i].seleccionada === 'si') {
                count_vertical++;
            }
        }

        var count_total = (parseInt(count_horizontal) + parseInt(count_vertical));
        if (numero_de_preguntas === count_total) {
            $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
        }
        $('#respuesta_h_' + num).val(letra);
        $('#respuesta_h_' + num).attr('readonly', true);
        $('#check_cerrar_h_' + num).show();
        respuesta = [];
    }
}
function borrar_input_v(pos_x, pos_y, num, num_id) {
    var longitud = $('#length_v_' + num).val();
    for (var i = 0; i < longitud; i++) {
        var y = (parseInt(pos_y) + i);
        var x = pos_x;
        var id = y + '_' + x;
        $('#' + id).html('');
        $('#respuesta_v_' + num).val('');
    }
    preguntas_vertical[num_id].seleccionada = 'no';
    preguntas_vertical[num_id].tu_respuesta = '';
    preguntas_vertical[num_id].es_correcta = 'no';
    if (preguntas_vertical[num_id].puntaje > 0) {
        preguntas_vertical[num_id].puntaje = 0;
        puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    }
    if (preguntas_vertical[num_id].puntaje > 0) {
        puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    }
    respuesta = [];
    $('#check_cerrar_v_' + num).hide();
    $('#respuesta_v_' + num).attr('readonly', false);
    $('#btn_actividad_container button').css('display', 'none');
}

function my_vertical(e, pos_x, pos_y, num, num_id) {
    if ($('#respuesta_v_' + num).attr('readonly') === 'readonly') {
        return false;
    }
    if (e.keyCode == 9) {  //tab pressed
        e.preventDefault(); // stops its action
        return false;
    }
    var keynum;
    var longitud = $('#length_v_' + num).val();
    if (window.event) { // IE                    
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                   
        keynum = e.which;
    }
    
    if (e.key !== 'Dead') {
        var obj = {
            'letra': limpiar_letra(e.key)
        }
        respuesta.push(obj);
    }

    if ((e.keyCode == 8) || (e.keyCode == 46) || (e.keyCode == 13)) {
        for (var i = 0; i < longitud; i++) {
            var y = (parseInt(pos_y) + i);
            var x = pos_x;
            var id = y + '_' + x;
            $('#' + id).html('');
            $('#respuesta_v_' + num).val('');
        }
        preguntas_vertical[num_id].seleccionada = 'no';
        preguntas_vertical[num_id].tu_respuesta = '';
        preguntas_vertical[num_id].es_correcta = 'no';
        if (preguntas_vertical[num_id].puntaje > 0) {
            preguntas_vertical[num_id].puntaje = 0;
            puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
        }
        if (preguntas_vertical[num_id].puntaje > 0) {
            puntaje_actual = parseInt(puntaje_actual) - parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
        }

        respuesta = [];
    }

    if (longitud == respuesta.length) {
        var letra = '';
        var respuesta_correcta = '';
        var letra_mimuscula = '';
        var count_horizontal = 0;
        var count_vertical = 0;
        for (var i = 0; i < respuesta.length; i++) {
            var y = (parseInt(pos_y) + i);
            var x = pos_x;
            var id = y + '_' + x;
            $('#' + id).html(respuesta[i].letra);
            letra += respuesta[i].letra;
        }
        letra_mimuscula = letra.toUpperCase();
        preguntas_vertical[num_id].seleccionada = 'si';
        preguntas_vertical[num_id].tu_respuesta = letra_mimuscula;
        respuesta_correcta = preguntas_vertical[num_id].respuesta.toUpperCase();
        if (respuesta_correcta === preguntas_vertical[num_id].tu_respuesta) {
            preguntas_vertical[num_id].es_correcta = 'si';
            preguntas_vertical[num_id].puntaje = parseInt(puntaje);
            puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
        } else {
            preguntas_vertical[num_id].es_correcta = 'no';
        }
        for (var i = 0; i < preguntas_horizontal.length; i++) {
            if (preguntas_horizontal[i].seleccionada === 'si') {
                count_horizontal++;
            }
        }

        for (var i = 0; i < preguntas_vertical.length; i++) {
            if (preguntas_vertical[i].seleccionada === 'si') {
                count_vertical++;
            }
        }

        var count_total = (parseInt(count_horizontal) + parseInt(count_vertical));
        if (numero_de_preguntas === count_total) {
            $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
        }
        $('#respuesta_v_' + num).val(letra);
        $('#respuesta_v_' + num).attr('readonly', true);
        $('#check_cerrar_v_' + num).show();
        respuesta = [];
    }
}
function responder_pregunta() {
    activar_contenedor('cont_resultados');
    parar_cuenta_regresiva();
    armar_resultados();
}
function inicializa_preguntas() {
    var html_txt = '';
    $('#contenedor_droppables').html('');
    var preguntas_h = ordenar_preguntas_h('or');
    if (preguntas_h.length > 0) {
        html_txt += '<div class="palabras_horizontales">';
        html_txt += '<span>Across</span>';
        html_txt += '<div>';
        for (var i = 0; i < preguntas_h.length; i++) {
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_h[i]);
            var partes = resultado.split('*****');
            html_txt += '<div class="pista_palabra_crucigrama" id="pista_' + (i + 1) + '">';
            if (preguntas_h[i].tipo === 'letrao') {
                html_txt += '<p><span>' + (i + 1) + '.</span>';
                html_txt += preguntas_h[i].pregunta;
                html_txt += '</p>';
            } else {
                html_txt += '<p><span>' + (i + 1) + '.</span>';
                html_txt += '<img onclick="mostrar_popup_resultado(\'Question ' + (i + 1) + '\', \'' + partes[0] + '\');" src="assets/img/' + partes[1] + '" alt="Imagen"/>';
            }
            html_txt += '<input type="hidden" id="length_h_' + (i + 1) + '" value="' + preguntas_h[i].respuesta.length + '"  >';
            html_txt += '<span><input maxlength="' + preguntas_h[i].respuesta.length + '" size="20"  id="respuesta_h_' + (i + 1) + '" onkeydown="return my_horizontal(event, ' + preguntas_h[i].pos_x + ', ' + preguntas_h[i].pos_y + ', ' + (i + 1) + ', ' + i + ' )"/> ';
            html_txt += '<img class="check" id="check_cerrar_h_' + (i + 1) + '" onclick="borrar_input_h(' + preguntas_h[i].pos_x + ', ' + preguntas_h[i].pos_y + ', ' + (i + 1) + ', ' + i + ')" src="assets/img/cerrar_btn.png" alt="Imagen" style="display:none;"/>';
            html_txt += '</span>';
            html_txt += '</div>';
        }
        html_txt += '</div>';
        html_txt += '</div>';
    }
    var preguntas_v = ordenar_preguntas_v('su');
    if (preguntas_v.length > 0) {
        html_txt += '<div class="palabras_verticales">';
        html_txt += '<span>Down</span>';
        html_txt += '<div>';
        for (var i = 0; i < preguntas_v.length; i++) {
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_v[i]);
            var partes = resultado.split('*****');
            html_txt += '<div class="pista_palabra_crucigrama" id="pista_' + (i + 1) + '">';
            if (preguntas_v[i].tipo === 'letrao') {
                html_txt += '<p><span>' + (i + 1) + '.</span>';
                html_txt += preguntas_v[i].pregunta;
                html_txt += '</p>';
            } else {
                html_txt += '<p><span>' + (i + 1) + '.</span>';
                html_txt += '<img onclick="mostrar_popup_resultado(\'Question ' + (i + 1) + '\', \'' + partes[0] + '\');" src="assets/img/' + partes[1] + '" alt="Imagen"/>';
            }
            html_txt += '<input type="hidden" id="length_v_' + (i + 1) + '" value="' + preguntas_v[i].respuesta.length + '"  >';
            html_txt += '<span><input maxlength="' + preguntas_v[i].respuesta.length + '" size="20"  id="respuesta_v_' + (i + 1) + '" onkeydown="return my_vertical(event, ' + preguntas_v[i].pos_x + ', ' + preguntas_v[i].pos_y + ', ' + (i + 1) + ', ' + i + ')"/> ';
            html_txt += '<img class="check" id="check_cerrar_v_' + (i + 1) + '" onclick="borrar_input_v(' + preguntas_v[i].pos_x + ', ' + preguntas_v[i].pos_y + ', ' + (i + 1) + ', ' + i + ')" src="assets/img/cerrar_btn.png" alt="Imagen" style="display:none;"/>';
            html_txt += '</span>';
            html_txt += '</div>';
        }
        html_txt += '</div>';
    }

    $('#contenedor_droppables').html(html_txt);
}

function ordenar_preguntas_h(orientacion) {
    for (var i = 0; i < numero_de_preguntas; i++) {
        if (preguntas_json.preguntas[i].orientacion === orientacion) {
            var obj = {
                'id_pregunta': preguntas_json.preguntas[i].id_pregunta,
                'pregunta': preguntas_json.preguntas[i].pregunta,
                'tipo': preguntas_json.preguntas[i].tipo,
                'orientacion': preguntas_json.preguntas[i].orientacion,
                'pos_x': preguntas_json.preguntas[i].pos_x,
                'pos_y': preguntas_json.preguntas[i].pos_y,
                'respuesta': preguntas_json.preguntas[i].respuestas[0].respuesta,
                'es_correcta': preguntas_json.preguntas[i].respuestas[0].es_correcta,
                'seleccionada': preguntas_json.preguntas[i].respuestas[0].seleccionada,
                'tu_respuesta': '',
                'puntaje': 0
            }
            preguntas_horizontal.push(obj);
        }
    }
    return preguntas_horizontal;
}

function ordenar_preguntas_v(orientacion) {
    for (var i = 0; i < numero_de_preguntas; i++) {
        if (preguntas_json.preguntas[i].orientacion === orientacion) {
            var obj = {
                'id_pregunta': preguntas_json.preguntas[i].id_pregunta,
                'pregunta': preguntas_json.preguntas[i].pregunta,
                'tipo': preguntas_json.preguntas[i].tipo,
                'orientacion': preguntas_json.preguntas[i].orientacion,
                'pos_x': preguntas_json.preguntas[i].pos_x,
                'pos_y': preguntas_json.preguntas[i].pos_y,
                'respuesta': preguntas_json.preguntas[i].respuestas[0].respuesta,
                'es_correcta': preguntas_json.preguntas[i].respuestas[0].es_correcta,
                'seleccionada': preguntas_json.preguntas[i].respuestas[0].seleccionada,
                'tu_respuesta': '',
                'puntaje': 0

            }
            preguntas_vertical.push(obj);
        }
    }
    return preguntas_vertical;
}


function generar_pregunta_de_acuerdo_a_su_tipo(pregunta) {
    var respuesta = '';
    var img_tipo;
    switch (pregunta.tipo) {
        case 'letrao':
            respuesta = pregunta.pregunta;
            img_tipo = 'icono_letrao.png';
            break;
        case 'audio':
            respuesta = '<audio controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/mpeg\\'>";
            respuesta += "NO SOPORTA AUDIOS";
            respuesta += "</audio>";
            img_tipo = 'icono_audio.png';
            break;
        case 'imagen':
            respuesta = "<img class=\\'img_droppable\\' src=\\'" + pregunta.pregunta + "\\' alt=\\'Imagen\\'/>";
            img_tipo = 'icono_imagen.png';
            break;
        case 'video':
            respuesta = '<video controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/mp4\\'>";
            respuesta += "NO SOPORTA VIDEOS";
            respuesta += "</video>";
            img_tipo = 'icono_video.png';
            break;
        default:
            respuesta = 'NO EXISTE EL TIPO DE CONTENIDO ' + pregunta.tipo + ' PARA LA PREGUNTA: ' + pregunta.pregunta;
            img_tipo = 'icono_letrao.png';
    }
    return respuesta + '*****' + img_tipo;
}

function generar_pregunta_de_acuerdo_a_su_tipo_para_resultado(pregunta) {
    var respuesta = '';
    var img_tipo;
    switch (pregunta.tipo) {
        case 'letrao':
            respuesta = pregunta.pregunta;
            img_tipo = 'icono_letrao.png';
            break;
        case 'audio':
            respuesta = '<audio controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/mpeg\\'>";
            respuesta += "NO SOPORTA AUDIOS";
            respuesta += "</audio>";
            img_tipo = 'icono_audio.png';
            break;
        case 'imagen':
            respuesta = "<img class=\\'img_droppable\\' src=\\'" + pregunta.pregunta + "\\' alt=\\'Imagen\\'/>";
            img_tipo = 'icono_imagen.png';
            break;
        case 'video':
            respuesta = '<video controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/mp4\\'>";
            respuesta += "NO SOPORTA VIDEOS";
            respuesta += "</video>";
            img_tipo = 'icono_video.png';
            break;
        default:
            respuesta = 'NO EXISTE EL TIPO DE CONTENIDO PARA RESULTADO ' + pregunta.tipo + ' PARA LA PREGUNTA: ' + pregunta.pregunta;
            img_tipo = 'icono_letrao.png';
    }
    return respuesta + '*****' + img_tipo;
}

function reintentar() {
    $('#btn_actividad_container').html('');
    preguntas_horizontal = [];
    preguntas_vertical = [];
    posicion = [];
    respuesta = [];
    $('#cont_puntos').html("0");
    puntaje_actual = "0";
    intento_actual++;
    inicializar_actividad();
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

function mostrar_contenedor_resultados() {
    $('#cont_actividad').fadeOut(1000);
    $('#inicio_actividad').fadeOut(1000);
    $('#cont_resultados').fadeIn(1000);
    $('#pantalla_invisible').css('display', 'none');
    ocultar_popup_pregunta();
}

function armar_resultados() {
    ocultar_popup_resultado();
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
                msg_intentos = "You have 1 try.";
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
    if ((preguntas_horizontal.length > 0) || (preguntas_vertical.length > 0)) {
        if (preguntas_horizontal.length > 0) {
            for (var i = 0; i < preguntas_horizontal.length; i++) {
                var resultado = generar_pregunta_de_acuerdo_a_su_tipo_para_resultado(preguntas_horizontal[i]);
                var partes = resultado.split('*****');
                resultados += '<div class="cont_pregunta">';
                resultados += '<p class="numero_pregunta">' + partes[0] + '</p>';
                if (preguntas_horizontal[i].seleccionada === 'si') {
                    tu_respuesta = preguntas_horizontal[i].tu_respuesta;
                    respuesta_correcta = preguntas_horizontal[i].respuesta;
                }
                if (preguntas_horizontal[i].es_correcta === 'si') {
                    class_respuesta = 'txt_respuesta_correcta';
                    imagen_respuesta = 'estrella_exito.png';
                } else {
                    class_respuesta = 'txt_respuesta_incorrecta';
                    imagen_respuesta = 'estrella_fallo.png';
                }
                resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta.toUpperCase() + '</span></p>';
                resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + respuesta_correcta.toUpperCase() + '</span></p>';
                //            resultados += '<p class="subtitulo_respuesta_txt">' . $lang['pregunta_justificacion'] . ': <span class="justificacion">' + preguntas_horizontal[i].justificacion + '</span></p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
                resultados += '</div>';
            }
        }
        if (preguntas_vertical.length > 0) {
            for (var i = 0; i < preguntas_vertical.length; i++) {
                var resultado = generar_pregunta_de_acuerdo_a_su_tipo_para_resultado(preguntas_vertical[i]);
                var partes = resultado.split('*****');
                resultados += '<div class="cont_pregunta">';
                resultados += '<p class="numero_pregunta">' + partes[0] + '</p>';
                if (preguntas_vertical[i].seleccionada === 'si') {
                    tu_respuesta = preguntas_vertical[i].tu_respuesta;
                    respuesta_correcta = preguntas_vertical[i].respuesta;
                }
                if (preguntas_vertical[i].es_correcta === 'si') {
                    class_respuesta = 'txt_respuesta_correcta';
                    imagen_respuesta = 'estrella_exito.png';
                } else {
                    class_respuesta = 'txt_respuesta_incorrecta';
                    imagen_respuesta = 'estrella_fallo.png';
                }
                resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta.toUpperCase() + '</span></p>';
                resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + respuesta_correcta.toUpperCase() + '</span></p>';
                //            resultados += '<p class="subtitulo_respuesta_txt">' . $lang['pregunta_justificacion'] . ': <span class="justificacion">' + preguntas_horizontal[i].justificacion + '</span></p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<p>&nbsp;</p>';
                resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
                resultados += '</div>';
            }
        }
    } else {
        resultados = '<div style="font-size:xx-large;letra-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}

function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}

function mostrar_popup_resultado(titulo, mensaje) {
    $('#titulo').html(titulo);
    $('#mensaje').html(mensaje);
    $('#modal_crucigrama').css('display', 'block');
    $('#popup_overlay').fadeIn('slow');
    return false;
}

function ocultar_popup_resultado() {
    mostrar_popup_resultado('', '');
    $('#modal_crucigrama').css('display', 'none');
    $('#popup_overlay').fadeOut('slow');
    return false;
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

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));