<?php
require_once 'conexion.php';
session_start();

if (isset($_POST['validar'])) {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $stmt = $conexion->prepare('SELECT * FROM adm WHERE email=?');
    $stmt->bindParam(1, $email);
    $stmt->execute();

    if ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($_POST['pass'], $data['pass'])) {
            $_SESSION['adm'] = $data['idadm'];
            header('Location: homead.php');
            exit();
        } else {
            $msg = array("Contraseña incorrecta", "warning");
        }
    } else {
        $msg = array("Usuario incorrecto", "danger");
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="/agroapp/assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>

    <title>Inicio de Sesion</title>
</head>

<body>
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

        .alert {
            padding: 10px;
            margin: 15px;
            border-radius: 5px;
        }

        .warning {
            background-color: #fff3cd;
            color: #856404;
        }

        .danger {
            background-color: #f8d7da;
            color: #721c24;
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

    <div class="container-form">
        <div class="welcome-back">
            <div class="message">
                <h2 style="color: white;">Bienvenido de nuevo</h2>
                <p style="color: white;">¿No tienes una cuenta? Regístrate aquí</p>
                <button class="sign-up-btn" onclick="location.href='reg_adm.php'">Registrarse</button>
            </div>
        </div>

        <?php if (isset($msg)): ?>
            <div class="alert <?= $msg[1] ?>">
                <?= $msg[0] ?>
            </div>
        <?php endif; ?>

        <form class="formulario" method="POST" action="">
            <h2 class="create-account" style="color: white;">Inicia sesión</h2>
            <div style="color: white;">
                <div class="iconos">
                    <div class="border-icon">
                        <i class='bx bxl-instagram'></i>
                    </div>
                    <div class="border-icon">
                        <i class='bx bxl-linkedin'></i>
                    </div>
                    <div class="border-icon">
                        <i class='bx bxl-facebook-circle'></i>
                    </div>
                </div>
            </div>
            <p class="cuenta-gratis" style="color: white;">Inicia sesión con tus redes</p>
            <input type="email" name="email" placeholder="Correo electrónico" required>
            <input type="password" name="pass" placeholder="Contraseña" required>
            <input type="submit" name="validar" value="Iniciar sesión">
        </form>
    </div>
    
    <script src="/agroapp/assets/js/script.js"></script>
</body>

</html>
