<?php
// Abrir el archivo
$archivo = 'temp.txt';
$codigo = "hola";
// Guardar Archivo
$abrir = fopen($archivo,'w');
fwrite($abrir,$contenido);
fclose($abrir);
 echo $codigo;
?>