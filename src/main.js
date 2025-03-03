/// <reference types="jquery" />

const API_KEY= "3312a64fd1a51a8c07de3a9cbb8cd230";



fetch(`https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`)
    .then(respuesta => respuesta.json())
    .then(respuestaJSON =>{
        Object.keys(respuestaJSON.rates).forEach(moneda =>{
            $('#entrada').append($(`<option value="${moneda}">${moneda}</option>`));
            $('#salida').append($(`<option value="${moneda}">${moneda}</option>`));
        });
    })
    .catch(error =>{
        console.error("FALLO",error);
        $('#error').text('No se pudieron cargar las opciones.');
        $('#error').css('color','red');
    });



const $btnConvertir= $('#convertir');

$btnConvertir.on('click',convertirMoneda);

function convertirMoneda(){
    limpiarErrores();

    if(verificarInputs()){
        convertir();
    }
}


function verificarInputs(){
    const $input=$('#monedaAConvertir');
    const $entrada=$('#entrada');
    const $salida=$('#salida');

    if(!$input.val()){
        marcarError('La valor de la moneda no puede estar vacio.', 'monedaAConvertir');
        return false;
    }

    if(Number($input.val()) < 0){
        marcarError('El valor de la moneda no puede ser menor a 0', 'monedaAConvertir');
        return false;
    }

    if(!$entrada.val()){
        marcarError('Debe de seleccionar una moneda base', 'entrada');
        return false;
    }

    if(!$salida.val()){
        marcarError('Debe de seleccionar una moneda para convertir', 'salida');
        return false;
    }
    return true;
}

function limpiarErrores(){
    $('#monedaAConvertir').removeClass('error');
    $('#entrada').removeClass('error');
    $('#salida').removeClass('error');
    $('#error').text('');
}

function marcarError(mensaje, elemento){
    $(`#${elemento}`).addClass('error');
    $('#error').text(mensaje);
}


function convertir(){
    const from = $('#entrada').val();
    const to= $('#salida').val();
    const amount = $('#monedaAConvertir').val();

    fetch(`https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`)

        .then(respuesta => respuesta.json())
        .then(respuestaJSON =>{

            const rates= respuestaJSON.rates;
            const fromRate = rates[from];
            const toRate=rates[to];

            if(fromRate && toRate){
                const convertedAmount=(amount / fromRate)*toRate;
                $('#monedaConvertida').val(convertedAmount.toFixed(2));
            }
        })
        .catch(error =>console.error("FALLO",error));
};



