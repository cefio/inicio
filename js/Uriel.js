var estado=localStorage.getItem("uriel/estado");
	var tabla=localStorage.getItem("uriel/tabla");
	var dias = new Array('domingo','lunes','martes','miercoles','jueves','viernes','sabado')
	var ultima = new Array();
	$(document).ready(function(){
		console.log(tabla);
		console.log(estado)
		if(estado==null){
			estado="true"
		}
		rellenartabla();
		if (typeof(Storage) !== "undefined") {
    		alert("si");
		} else {
    		alert("no");
		}
		if(estado=="true"){
			$('#bt_salida').attr('disabled', true);
		}else{
			$('#bt_entrada').attr('disabled', true);
		}
		$('#bt_entrada').click(function(){
			entrada();
            guardar();
		});
		$('#bt_salida').click(function(){
			salida();
            guardar();
            limpiar();
            rellenartabla();
		});
		$('#bt_reiniciar').click(function(){
			//reiniciar();
			guardararchivo();
		});
		

	});
	function reiniciar(){
		localStorage.clear();
	}
	function rellenartabla(){
		var i=0;
		if(tabla==null){
			tabla = new Array();
		}else{
			tabla = tabla.split(",");
		}
		while(i<tabla.length-1){
			
			if(tabla[i+3]=="00:00:00"){
				var fila='<tr id="ultima"><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
			}else{
				var fila='<tr><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
			}
			i=i+4;
			$('#tabla').append(fila);
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
			localStorage.setItem("uriel/estado", estado);
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
			localStorage.setItem("uriel/estado", estado);
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
		$('#ultima td').each(function(indice){			
			$(this).remove();
		});
	}
	function guardar(){
		tabla ="";
		$('#tabla tbody tr td').each(function(){
				tabla = tabla+$(this).text()+","
		});
		tabla = tabla.slice(0,-1);
		localStorage.setItem("uriel/tabla",tabla);
		console.log(localStorage.getItem("uriel/tabla"));
	}
	function guardararchivo(){
		$.ajax({
			     type: "POST",
			     url: "funcion.php",
			     data: { "codigo" :  "codigo" },
			     success: function(data){
					alert(data);
			     }
			 });
	}
    function limpiar(){
		$('#tabla tbody tr td').each(function(){
				$(this).remove();
		});
	}