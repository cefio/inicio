var estado = "true";
var reftabla= 'Uriel/tabla';
var refestado = 'Uriel/estado';
var refsalario = 'Salarios/Uriel';
var uriel="B9VVaLm2AFwZ3MioRtFhy4dkjXU/8YAlcSG3BmhQe/GOzXz8gm3tGlkiINj33X6n";
var jessica="SEhjBd2vKQwciB1pA1r8hHYx+xFpFD01gRiWPYwuazrtQA0JoKwrdDXXt0/2N/aJ";
var dias = new Array('domingo','lunes','martes','miercoles','jueves','viernes','sabado')
var dat = new Array();
var ultima = new Array();

	$(document).ready(function(){
		M.AutoInit();
		var elems = document.querySelectorAll('.timepicker');
    	var instances = M.Timepicker.init(elems, {
			twelveHour:false
		});
		var elems = document.querySelectorAll('.fixed-action-btn');
		var instances = M.FloatingActionButton.init(elems, {
			hoverEnabled: false
		});
		obtenerestado();
		
		obtenertabla();
		
		iniciar("Uriel");
		
		
		$('#bt_entrada').click(function(){
			entrada();
            guardar();
		});
		$('#bt_salida').click(function(){
			salida();
            guardar();;
		});
		$('#horat').click(function(){
			salariocal();
		});
		$('#redondear').click(function(){
			salariocal();
		});
		$('#agregarh').click(function(){
			var str;
			if($('#dia option:selected').text()==""||$('#horai').val()==""||$('#horaf').val()==""){
				M.toast({html: '<p><i class="material-icons left yellow-text">error</i>Hay datos vacios</p>',displayLength:900});
			}else{
				str = $('#dia option:selected').text()+","+$('#horai').val()+":00,"+$('#horaf').val()+":00,00:00:00";
				salidav(str);
				M.toast({html: '<p><i class="material-icons left green-text">done_all</i>Hora agregada</p>',displayLength:900});
			}
			var tabla = String(ordenar(matiztabla()));
			limpiart()
			rellenartabla(tabla);
			guardar();
		});
		$('#update').click(function(){
			cambiar2();
				obtenertabla();
				calcularhoras();
		});
		
		$('#uriel').click(function(){
			if ($('#pagost').find('i').text() == 'date_range'){
				$('#pagost').find('i').text('monetization_on')
			}
			reftabla = 'Uriel/tabla';
				refestado = 'Uriel/estado';
				refsalario= 'Salarios/Uriel';
				cambiar2();
				obtenertabla();
				iniciar("Uriel");
				obtenerestado();
		});
		$('#jessica').click(function(){
			if ($('#pagost').find('i').text() == 'date_range'){
				$('#pagost').find('i').text('monetization_on')
			}
			reftabla = 'Jessica/tabla';
				refestado = 'Jessica/estado';
				refsalario= 'Salarios/Jessica'
				obtenertabla();
				cambiar2();
				iniciar("Jessica");
				obtenerestado();
		});
		$('#carlos').click(function(){
			if ($('#pagost').find('i').text() == 'date_range'){
				$('#pagost').find('i').text('monetization_on')
			}
			reftabla = 'Carlos/tabla';
				refestado = 'Carlos/estado';
				refsalario= 'Salarios/Carlos'
				obtenertabla();
				cambiar2();
				iniciar("Gerardo");
				obtenerestado();
		});
		$('#pagost').click(function(){
			if ($(this).find('i').text() == 'monetization_on'){
				$(this).find('i').text('date_range');
				cambiar();
				recu();
				rellenarpagos();
			} else {
				$(this).find('i').text('monetization_on');
				obtenertabla();
				cambiar2();
			}
			
		});
		
		$('#cantidad').keyup(function(){
			salariocal();
		});
		
		

	});
	function obtenerestado(){
		firebase.database().ref(refestado).once('value').then(function(snapshot) {
			asignarestado(snapshot.val());
		  });
	}
	function asignarestado(e){
		estado = e;
		if(estado=="true"){
			$('#bt_salida').attr('disabled', true);
			$('#bt_entrada').attr('disabled', false);
		}else{
			$('#bt_entrada').attr('disabled', true);
			$('#bt_salida').attr('disabled', false);
		}
	}
	function rellenarpagos(datt){
		var tmp;
		for(var i = 0;i<datt.length;i++){
			tmp = datt[i].salario.split("-");
			var fila='<tr><td>'+tmp[0]+'</td><td>'+tmp[1]+'</td></tr>';
			$('#tabla').append(fila);
		}
	}
	function recu(){
		firebase.database().ref(refsalario).once('value').then(function(snapshot) {
			rellenarpagos(Object.values(snapshot.val()));
		  });
	}
	
	function calcularhoras(){
		var horast = new Array();
		var total;
		$('#tabla tbody tr').each(function(){
			$(this).find('td').eq(3).each(function () {
				horast.push($(this).text());
            })
		});
		total=horast[0];
		for(var i=1;i < horast.length;i++){
			total = sumarhoras(total,horast[i]);
		}
		document.getElementById("horatt").innerHTML =  total;
	}
	function iniciar(t){
		document.getElementById("titular").innerHTML = t;
	}
	function obtenertabla(){
		firebase.database().ref(reftabla).once('value').then(function(snapshot) {
			rellenartabla(snapshot.val());
		  });
	}
	function rellenartabla(tabla){
		var i=0;
		if(tabla==""){
			tabla = new Array();
		}else{
			tabla = tabla.split(",");
		}
		while(i<tabla.length-1){
			
			if(tabla[i+3]=="00:00:00"){
				var fila='<tr id="ultima"><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
				$('#tabla').append(fila);
			}else{
				var fila='<tr><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
				$('#tabla').append(fila);
			}
			i=i+4;
		}
		calcularhoras();
	}
	function salariocal() {
		var sal,pago;
		var horastl = $('#horatt').text();
		horastl = horastl.split(":");
		pago= Number($('#cantidad').val());
		if( $('#redondear').prop('checked') ) {
			sal=(Number(horastl[0])*pago)+((Number(horastl[1]/60)*pago));
			sal = Math.round(sal);
		}else{
			sal=(Number(horastl[0])*pago)+((Number(horastl[1]/60)*pago));
		}
		
		$('#ho').text(sal);
	}
	function salario(){
		if($('#cantidad').val()==""){
			M.toast({html: '<p><i class="material-icons left yellow-text">error</i>Cantidad vacia</p>',displayLength:900});
		}else{
			var sal = $('#ho').text();
			limpiar();
			sal = "$"+sal+"-"+fecha();
			firebase.database().ref(refsalario).push({salario: sal})
			M.toast({html: '<p><i class="material-icons left yellow-text">done_all</i>Salario agregado</p>',displayLength:900});
		}
	}
	function sumarhoras(hr1,hr2){
		var hora1 = hr1.split(":"),hora2 = hr2.split(":"),horas,minutos,segundos,tmp;
		horas = Number(hora1[0])+Number(hora2[0]);
		minutos= Number(hora1[1])+Number(hora2[1]);
		segundos=Number(hora1[2])+Number(hora2[2]);
		if(minutos>60){
			tmp = Math.floor(minutos/60);
			horas = horas + tmp;
			tmp = minutos % 60;
			minutos = tmp;
			if(segundos>60){
				tmp = Math.floor(segundos/60);
				minutos = minutos + tmp;
				tmp = segundos % 60;
				segundos = tmp;
			}
		}
		var tiempo = (horas> 9 ? "" : "0")+horas+":"+(minutos > 9 ? "" : "0")+minutos+":"+(segundos > 9 ? "" : "0")+segundos;
		return tiempo;
	}
	function fecha(){
		var hoy = new Date();
		var dd = hoy.getDate();
		var mm = hoy.getMonth()+1;
		var yyyy = hoy.getFullYear();
		dd = addZero(dd);
        mm = addZero(mm);
        return dd+'/'+mm+'/'+yyyy;
	}
	function addZero(i) {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	}
	function limpiart(){
		$('#tabla tbody tr').each(function(){
				$(this).remove();
		});
	}
	function cambiar(){
		limpiart();
		$('#tabla thead tr').each(function(){
				$(this).remove();
		});
		var fila='<tr><td>Pago</td><td>Fecha</td></tr>';
		$(".titulo").html(fila);
	}
	function cambiar2(){
		limpiart();
		$('#tabla thead tr').each(function(){
				$(this).remove();
		});
		var fila='<tr><td>Dia</td><td>Entrada</td><td>Salida</td><td>Tiempo</td></tr>';
		$(".titulo").html(fila);
	}
	
    function limpiar(){
		calcularhoras();
		$('#tabla tbody tr').each(function(){
				$(this).remove();
		});
		firebase.database().ref(reftabla).set("");
		firebase.database().ref(refestado).set("true");
	}
	function salidav(str){
		var dat = str.split(",");
		dat[3]=restahorasv(dat);
		var fila='<tr><td>'+dat[0]+'</td><td>'+dat[1]+'</td><td>'+dat[2]+'</td><<td>'+dat[3]+'</td></tr>';
		if(ult==null){
			$('#tabla').append(fila);
		}else{
			$('#ultima').before(fila);
		}
	}
	function guardar(){
		tabla ="";
		$('#tabla tbody tr td').each(function(){
				tabla = tabla+$(this).text()+",";
		});
		tabla = tabla.slice(0,-1);
		firebase.database().ref(reftabla).set(tabla);
	}
	function restahorasv(dat){
		var hora1 = (dat[1]).split(":"),hora2 = (dat[2]).split(":"),t1 = new Date(),t2 = new Date();
		t1.setHours(hora1[0], hora1[1], hora1[2]);
		t2.setHours(hora2[0], hora2[1], hora2[2]);
		t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());
		//var tiempo = "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
		var tiempo = (t1.getHours() > 10 ? "" : "0")+t1.getHours()+":"+(t1.getMinutes() > 10 ? "" : "0")+t1.getMinutes()+":"+(t1.getSeconds() > 10 ? "" : "0")+t1.getSeconds();
		return tiempo;
	}
	function restahoras(){
		var hora1 = (ultima[1]).split(":"),hora2 = (ultima[2]).split(":"),t1 = new Date(),t2 = new Date();
		t1.setHours(hora1[0], hora1[1], hora1[2]);
		t2.setHours(hora2[0], hora2[1], hora2[2]);
		t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());
		//var tiempo = "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
		var tiempo = (t1.getHours() > 10 ? "" : "0")+t1.getHours()+":"+(t1.getMinutes() > 10 ? "" : "0")+t1.getMinutes()+":"+(t1.getSeconds() > 10 ? "" : "0")+t1.getSeconds();
		ultima[3]=tiempo;
	}
	function entrada(){
		var fecha = new Date();
		var dia = dias[fecha.getDay()];
		var fila='<tr id="ultima"><td>'+dia+'</td><td>'+fecha.toLocaleTimeString()+'</td><td>00:00:00</td><<td>00:00:00</td></tr>';
		if(estado=="true"){
			$('#bt_entrada').attr('disabled', true);
			$('#bt_salida').attr('disabled', false);
			estado="false";
			firebase.database().ref(refestado).set(estado);
		}
		$('#tabla').append(fila);
	}
	function salida(){
		datos_ultima();
		var fecha = new Date();
		ultima[2]= fecha.toLocaleTimeString();
		eliminar();
		restahoras();
		var fila='<tr><td>'+ultima[0]+'</td><td>'+ultima[1]+'</td><td>'+ultima[2]+'</td><<td>'+ultima[3]+'</td></tr>';
		$('#tabla').append(fila);
		$('#bt_entrada').attr('disabled', false);
		if(estado=="false"){
			$('#bt_entrada').attr('disabled', false);
			$('#bt_salida').attr('disabled', true);
			estado="true";
			firebase.database().ref(refestado).set(estado);
		}
		calcularhoras();
	}
	function datos_ultima(){
		$('#ultima td').each(function(indice){			
			ultima[indice] = $(this).text();
		});
	}
	function eliminar(){
		$('#tabla tbody #ultima').each(function(indice){			
			$(this).remove();
		});
	}
	function ordenar(matrix){
		var temp,d1,d2;
		for(var i=1;i < matrix.length;i++){
			for (var j=0 ; j < matrix.length- 1; j++){
				d1=diastr(matrix[j][0]);
				d2=diastr(matrix[j+1][0]);
                if (d1 > d2){
                    temp = matrix[j];
                    matrix[j] = matrix[j+1];
                    matrix[j+1] = temp;
                }
            }
		}
		return matrix;
	}
	function diastr(dia) {
		if(dia=="lunes"){
			return 1;
		}else{
			if(dia=="martes"){
				return 2;
			}else{
				if(dia=="miercoles"){
					return 3;
				}else{
					if(dia=="jueves"){
						return 4;
					}else{
						if(dia=="viernes"){
							return 5;
						}else{
							if(dia=="sabado"){
								return 6;
							}else{
								if(dia=="domingo"){
									return 7;
								}
							}
						}
					}
				}
			}
		}
	} 
	function matiztabla() {
		var matrix=new Array;
		var array= new Array;
		$('#tabla tbody tr').each(function(){
            array=[];
			$(this).find('td').each(function () {
                array.push($(this).text());
            });
            matrix.push(array);
		});
		return matrix;
	}