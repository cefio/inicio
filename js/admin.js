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
		obtenertabla();
		iniciar("Uriel");
		borrarcamara();

		$('#horat').click(function(){
			salario();
		});
		$('#pagost').click(function(){
			$('#horat').attr('disabled', true);
			cambiar();
			recu();
			rellenarpagos();
		});
		$('#boxE').change(function(){
			var opcion = $("#boxE option:selected").val();
			$('#horat').attr('disabled', false);
			if(opcion == "uriel"){
				reftabla = 'Uriel/tabla';
				refestado = 'Uriel/estado';
				refsalario= 'Salarios/Uriel'
				cambiar2();
				obtenertabla();
				iniciar("Uriel");
			}
			if(opcion == "jessica"){
				reftabla = 'Jessica/tabla';
				refestado = 'Jessica/estado';
				refsalario= 'Salarios/Jessica'
				obtenertabla();
				cambiar2();
				iniciar("Jessica");
			}
			if(opcion == "carlos"){
				reftabla = 'Carlos/tabla';
				refestado = 'Carlos/estado';
				refsalario= 'Salarios/Carlos'
				obtenertabla();
				cambiar2();
				iniciar("Carlos");
			}
		});
		

	});
	function rellenarpagos(datt){
		console.log(datt);
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
		document.getElementById("horat").innerHTML =  total;
	}
	function iniciar(t){
		document.getElementById("titular").innerHTML = t;
	}
	function obtenertabla(){
		firebase.database().ref(reftabla).once('value').then(function(snapshot) {
			rellenartabla(snapshot.val());
		  });
	}
	function borrarcamara(){
		$("#cam").remove();
		//document.getElementById("contenido").style.display = "block";
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
	function salario(){
		var horastl = document.getElementById("horat").innerHTML;
		var t1 = new Date();
		var t2 = new Date();
		horastl = horastl.split(":");
		t1.setHours(horastl[0],horastl[1],horastl[2]);
		sal=(t1.getHours()*20)+((t1.getMinutes()/60)*20);
		alert(sal);
		var r = confirm("¿desea limpiar?");
		if(r == true){
				limpiar();
				sal = "$"+sal+"-"+fecha();
				firebase.database().ref(refsalario).push({salario: sal})
		
		}
	}
	function sumarhoras(hr1,hr2){
		var hora1 = hr1.split(":"),hora2 = hr2.split(":"),t1 = new Date(),t2 = new Date();
		t1.setHours(hora1[0], hora1[1], hora1[2]);
		t2.setHours(hora2[0], hora2[1], hora2[2]);
		t1.setHours(t2.getHours() + t1.getHours(), t2.getMinutes() + t1.getMinutes(), t2.getSeconds() + t1.getSeconds());
		var tiempo = (t1.getHours() > 10 ? "" : "0")+t1.getHours()+":"+(t1.getMinutes() > 10 ? "" : "0")+t1.getMinutes()+":"+(t1.getSeconds() > 10 ? "" : "0")+t1.getSeconds();
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
		$('#tabla tbody tr').each(function(){
				$(this).remove();
		});
		firebase.database().ref(reftabla).set("");
		firebase.database().ref(refestado).set("true");
	}
