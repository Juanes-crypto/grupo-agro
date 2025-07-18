<?php
require_once 'conexion.php';
session_start();

if (isset($_POST['validar'])) { // Cambié aquí el nombre del botón a 'validar'
    $stmt = $conexion->prepare('SELECT * FROM clientes WHERE email=?');
    $stmt->bindParam(1, $_POST['email']);
    $stmt->execute();

    if ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($_POST['pass'], $data['pass'])) {
            $_SESSION['clientes'] = $data['ClienteID'];
            header('location:home.php');
        } else {
            $msg = ["Contraseña incorrecta", "warning"]; // Ajustar formato del array
        }
    } else {
        $msg = ["Usuario incorrecto", "danger"]; // Ajustar formato del array
    }
}
?>
<!DOCTYPE html>
<html lang="es-CO" data-bs-theme="dark">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inicia sesión y sé cliente</title>
    <link rel="icon" type="image/x-icon" href="../assets/img/logo.png" />
    <link rel="apple-touch-icon" type="image/png" href="../assets/img/iconsena.png" />
    <link rel="stylesheet" href="../assets/css/bootstrap.css" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
</head>

<body>
    <main class="form-register w-50 m-auto pt-5 mt-5">
        <?php if (isset($msg)) { ?>
            <div class="alert alert-<?php echo $msg[1]; ?> alert-dismissible">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Alerta!</strong> <?php echo $msg[0]; ?>
            </div>
        <?php } ?>
        <div class="card">
            <div class="card-header">
                <style>
                    /* El estilo CSS sigue igual */
                </style>
                <a class="navbar-brand mx-auto" href="#">
                    <img src="../assets/img/logo.png" alt="Avatar Logo" style="width: 100px" class="d-block mx-auto" />
                </a>
                <h5 class="card-title" style="color: #e6e6ff;">Inicio de Sesión</h5>
            </div>
            <div class="card-body">
                <form class="form-floating" action="" method="post">
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" name="email" placeholder="Escriba su correo">
                        <label for="email">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="pass" name="pass"
                            placeholder="Escriba la contraseña">
                        <label for="pass">Contraseña</label>
                    </div>
                    <div class="form-floating mb-3 btn-group w-100">
                        <button class="btn btn-primary" type="submit" name="validar">Ingresar</button>
                        <button class="btn btn-danger" type="submit">Cancelar</button>
                    </div>
                    <a href="c.php">Regístrate si no tienes una cuenta</a>
                </form>
            </div>
        </div>
    </main>
    <script src="../assets/js/bootstrap.bundle.js"></script>
</body>

</html>
