<?php
$conexion = new mysqli("localhost", "root", "", "grafica");
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$resultado = $conexion->query("SELECT Potenciometro, SensorInfra, SensorProx, fecha FROM sensores_2 ORDER BY fecha ASC");
$valores = array();
while ($fila = $resultado->fetch_assoc()) {
    $valores[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($valores);

$conexion->close();
?>
