$(document).ready(function(){
    M.AutoInit();
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems);
    
    $( "#abajo" ).click(function() {
      calcularTotal();
    });
    $( "#arriba" ).click(function() {
      calcularImporte();
    });
  });
  function calcularTotal(){
    var retiva,retisr,total,subtotal,iva,importe;
    importe = Number($('#importe').val());
    iva = importe*0.16;
    $('#iva').text(iva);
    subtotal = iva + importe;
    $('#subtotal').text(subtotal);
    retiva = importe*0.1066666667;
    $('#retiva').text(retiva);
    retisr = importe*0.10;
    $('#retisr').text(retisr);
    total = subtotal - retiva - retisr;
    $('.totall label').addClass('active');
    $('#total').val(total);
  }
  function calcularImporte(){
    var retiva,retisr,total,subtotal,iva,importe;
    total = Number($('#total').val());
    importe = redondeo(total/0.9533333333);
    retisr = importe*0.10;
    $('#retisr').text(retisr);
    retiva = importe*0.1066666667;
    $('#retiva').text(retiva);
    iva = importe*0.16;
    subtotal = importe + iva;
    $('#subtotal').text(subtotal);
    $('#iva').text(iva);
    $('.totall label').addClass('active');
    $('#importe').val(importe);
  }
  function redondeo(r) {
    var v;
    v = Math.floor(r);
    v = v+0.99;
    if(r>v){
      return Math.round(r);
    }else{
      return r;
    } 
  }