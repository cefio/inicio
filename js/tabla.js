var estado;
var reftabla;
var refestado;
var uriel="B9VVaLm2AFwZ3MioRtFhy4dkjXU/8YAlcSG3BmhQe/GOzXz8gm3tGlkiINj33X6n";
var jessica="SEhjBd2vKQwciB1pA1r8hHYx+xFpFD01gRiWPYwuazrtQA0JoKwrdDXXt0/2N/aJ";
var dias = new Array('domingo','lunes','martes','miercoles','jueves','viernes','sabado')
var ultima = new Array();
	$(document).ready(function(){

		$('#bt_entrada').click(function(){
			entrada();
            guardar();
		});
		$('#bt_salida').click(function(){
			salida();
            guardar();;
		});
		$('#bt_reiniciar').click(function(){
			//reiniciar();
			guardararchivo();
		});
		

	});
	function iniciar(t){
		alert("codigo aceptado - "+t);
		document.getElementById("titular").innerHTML = t +" - Horario";
	}
	function obtenertabla(){
		firebase.database().ref(reftabla).once('value').then(function(snapshot) {
			rellenartabla(snapshot.val());
		  });
	}
	function borrarcamara(){
		$("#cam").remove();
		document.getElementById("contenido").style.display = "block";
	}
	function obtenerestado(){
		firebase.database().ref(refestado).once('value').then(function(snapshot) {
			asignarestado(snapshot.val());
		  });
	}
	function asignarestado(e){
		estado = e;
		if(estado=="true"){
			$('#bt_salida').attr('disabled', true);
		}else{
			$('#bt_entrada').attr('disabled', true);
		}
	}
	function reiniciar(){
		localStorage.clear();
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
	function sumarhoras(){
		var hora1 = (ultima[1]).split(":"),hora2 = (ultima[2]).split(":"),t1 = new Date(),t2 = new Date();
		t1.setHours(hora1[0], hora1[1], hora1[2]);
		t2.setHours(hora2[0], hora2[1], hora2[2]);
		t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());
		//var tiempo = "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
		ultima[3]=tiempo;
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
	function guardar(){
		tabla ="";
		$('#tabla tbody tr td').each(function(){
				tabla = tabla+$(this).text()+",";
		});
		tabla = tabla.slice(0,-1);
		firebase.database().ref(reftabla).set(tabla);
	}
	function guardararchivo(){
		var fso  = new XMLHttpRequest("Scripting.FileSystemObject"); 
   		var fh = fso.CreateTextFile("Test.txt", true); 
   		fh.WriteLine("Some text goes here..."); 
   		fh.Close(); 
	}
    function limpiar(){
		$('#tabla tbody tr').each(function(){
				$(this).remove();
		});
	}
    function openQRCamera(node) {
		var reader = new FileReader();
		reader.onload = function() {
		  node.value = "";
		  qrcode.callback = function(res) {
			if(res instanceof Error) {
			  alert("No se detecto ningun QR vuelva a intentarlo");
			} else {
				if(res == uriel){
					reftabla = 'Uriel/tabla';
					refestado = 'Uriel/estado';
					obtenerestado();
					obtenertabla();
					iniciar("Uriel");
					borrarcamara();
				}
				if(res == jessica){
					reftabla = 'Jessica/tabla';
					refestado = 'Jessica/estado';
					obtenerestado();
					obtenertabla();
					iniciar("Jessica");
					borrarcamara();
				}
			}
		  };
		  qrcode.decode(reader.result);
		};
		reader.readAsDataURL(node.files[0]);
	  }
