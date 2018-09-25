<?php
// Abrir el archivo
$archivo = 'temp.txt';
$codigo = $_POST['codigo'];
// Guardar Archivo
$abrir = fopen($archivo,'w');
fwrite($abrir,$contenido);
fclose($abrir);
 echo $codigo;
?>
