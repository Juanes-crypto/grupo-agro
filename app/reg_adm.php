<?php
require_once 'conexion.php';

if (isset($_POST['btn-reg'])) {
    $sql = $conexion->prepare("INSERT INTO adm(fname, lname, email, pass) VALUES(?, ?, ?, ?)");
    $sql->bindParam(1, $_POST['fname']);
    $sql->bindParam(2, $_POST['lname']);
    $sql->bindParam(3, $_POST['email']);
    $pass = password_hash($_POST['pass'], PASSWORD_BCRYPT);
    $sql->bindParam(4, $pass);

    $msg = $sql->execute() 
        ? ["Datos Registrados", "success"] 
        : ["Datos no registrados", "warning"];
}
?>
<!DOCTYPE html>
<html lang="es-CO" data-bs-theme="dark">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <title>Atanasio_Reg_admin</title>

    <!-- Styles Bootstrap 5.3.3 -->
    <link rel="stylesheet" href="../assets/css/style.css">
</head>

<body>
    <header>
    <style>
        .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .navbar h1 {
    font-size: 24px;
        }

        .navbar nav a {
    margin: 0 15px;
            text-decoration: none;
            color: #333;
            font-weight: 500;
        }

        .navbar nav a:hover {
            color: #6200ea;
        }
    </style>
    <header class="navbar">
        <div>
        <h1>AgroApp</h1>
        </div>
        <nav>
            <a href="../index.html">Inicio</a>
            <a href="../integrantes.html">Nosotros</a>
            <a href="#">Servicios</a>
            <a href="../contacto.html">Contacto</a>
        </nav>
    </header>
    </header>
    <style>
    .formulario input[type="text"],
    .formulario input[type="email"],
    .formulario input[type="password"],
    .formulario input[type="submit"] {
    width: 100%; /* Asegura que los campos ocupen todo el ancho */
    padding: 10px; /* Espaciado interno para los campos */
    margin: 10px 0; /* Espaciado entre los campos */
    }
    </style>
<div class="container-form">
    <div class="welcome-back">
        <div class="message">
            <h2 style="color: white;">Hola, estas en la seccion</h2>
            <h2 style="color: white;">de inicio de sesion</h2>
            <p style="color: white;">¿ya creaste tu cuenta? da click aqui para iniciar sesion</p>
            <button class="sign-up-btn" onclick="location.href='index.php'">Inicia sesion</button>
        </div>
    </div>

    <form class="formulario" method="POST" action="reg_adm.php">
        <h2 class="create-account" style="color: white;">Crear cuenta gratis</h2>
        
        <?php if (isset($msg)): ?>
            <div class="alert alert-<?php echo $msg[1]; ?>" style="color: white; margin-bottom: 10px;">
                <?php echo $msg[0]; ?>
            </div>
        <?php endif; ?>

        <input type="text" name="fname" placeholder="Nombres" required>
        <input type="text" name="lname" placeholder="Apellidos" required>
        <input type="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" name="pass" placeholder="Contraseña" required>
        <input type="submit" name="btn-reg" value="Registrarse">
    </form>
</div>
