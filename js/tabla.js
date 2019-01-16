var estado;
var reftabla;
var refestado;
var refsalario;
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

	});
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
			$('#bt_entrada').attr('disabled', false);
		}else{
			$('#bt_entrada').attr('disabled', true);
			$('#bt_salida').attr('disabled', false);
		}
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
				tabla[i+1] = tabla[i+1].replace(/ AM/g, "");
				tabla[i+1] = tabla[i+1].replace(/ PM/g, "");
				tabla[i+2] =tabla[i+2].replace(/ AM/g, "");
				tabla[i+2] = tabla[i+2].replace(/ PM/g, "");
				var fila='<tr id="ultima"><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
				$('#tabla').append(fila);
			}else{
				tabla[i+1] = tabla[i+1].replace(/ AM/g, "");
				tabla[i+1] = tabla[i+1].replace(/ PM/g, "");
				tabla[i+2] =tabla[i+2].replace(/ AM/g, "");
				tabla[i+2] = tabla[i+2].replace(/ PM/g, "");
				var fila='<tr><td>'+tabla[i+0]+'</td><td>'+tabla[i+1]+'</td><td>'+tabla[i+2]+'</td><<td>'+tabla[i+3]+'</td></tr>';
				$('#tabla').append(fila);
			}
			i=i+4;
		}
		calcularhoras();
	}
	function entrada(){
		var fecha = new Date();
		var dia = dias[fecha.getDay()];
		var horaentrada = fecha.toLocaleTimeString();
		horaentrada.replace(/ AM/g, "");
		horaentrada.replace(/ PM/g, "");
		var fila='<tr id="ultima"><td>'+dia+'</td><td>'+horaentrada+'</td><td>00:00:00</td><<td>00:00:00</td></tr>';
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
		ultima[2].replace(/ AM/g, "");
		ultima[2].replace(/ PM/g, "");
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
	function restahoras(){
		var hora1 = (ultima[1]).split(":"),hora2 = (ultima[2]).split(":"),t1 = new Date(),t2 = new Date();
		t1.setHours(hora1[0], hora1[1], hora1[2]);
		t2.setHours(hora2[0], hora2[1], hora2[2]);
		t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());
		var tiempo = (t1.getHours() > 9 ? "" : "0")+t1.getHours()+":"+(t1.getMinutes() > 9 ? "" : "0")+t1.getMinutes()+":"+(t1.getSeconds() > 9 ? "" : "0")+t1.getSeconds();
		ultima[3]=tiempo;
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
	

	function openQRCamera(node) {
		var reader = new FileReader();
		reader.onload = function() {
		  node.value = "";
		  qrcode.callback = function(res) {
			if(res instanceof Error) {
			  alert("No se detecto ningun QR vuelva a intentarlo");
			} else {
				loguear(res);
			}
		  };
		  qrcode.decode(reader.result);
		};
		reader.readAsDataURL(node.files[0]);
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
	function loguear(qr){
		firebase.database().ref("Trabajadores").once('value').then(function(snapshot) {
				verificar(snapshot.val(),qr);
		  });
	}
	function verificar(val,qr) {
		var tmp = CryptoJS.AES.decrypt(qr, "cefio").toString(CryptoJS.enc.Utf8);
		val = val.split(",");

		for (let i = 0; i < val.length; i++) {
			if (tmp == val[i]) {
				reftabla = val[i]+'/tabla';
				refestado = val[i]+'/estado';
				refsalario= 'Salarios/'+val[i];
				obtenerestado();
				obtenertabla();
				iniciar(val[i]);
				borrarcamara();
				break;
			}
		}
	}
