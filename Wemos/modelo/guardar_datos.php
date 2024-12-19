<?php
// Verificar si los valores están definidos en el POST
if (isset($_POST['Potenciometro']) && isset($_POST['SensorInfra']) && isset($_POST['SensorProx'])) {
    $potValue = $_POST['Potenciometro'];
    $irValue = $_POST['SensorInfra'];
    $pirValue = $_POST['SensorProx'];
    $fecha = date('Y-m-d H:i:s');  // Obtener la fecha y hora actuales del servidor

    // Conectar a la base de datos
    $conexion = new mysqli("localhost", "root", "", "grafica");
    if ($conexion->connect_error) {
        die("Conexión fallida: " . $conexion->connect_error);
    }

    // Preparar la consulta para evitar inyecciones SQL
    $stmt = $conexion->prepare("INSERT INTO sensores_2 (Potenciometro, SensorInfra, SensorProx, fecha) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $potValue, $irValue, $pirValue, $fecha);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo "Datos recibidos y guardados correctamente";
    } else {
        echo "Error al guardar los datos: " . $stmt->error;
    }

    // Cerrar la conexión
    $stmt->close();
    $conexion->close();
} else {
    echo "No se recibió algún dato necesario";
}
