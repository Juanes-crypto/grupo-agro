<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "agroapp"; // Nombre de la base de datos
$charset = "utf8";

try {
    $conexion = new PDO("mysql:host=$servername;dbname=$database;charset=$charset", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    
    echo "Connection failed: " . $e->getMessage();
    
}




