    <?php
    require_once 'conexion.php';

    if (isset($_POST['btn-reg'])) {
        $sql=$conexion->prepare("INSERT INTO clientes(fname,lname,email,pass) VALUES(?,?,?,?)");
        $sql->bindParam(1,$_POST['fname']);
        $sql->bindParam(2,$_POST['lname']);
        $sql->bindParam(3,$_POST['email']);
        $pass=password_hash($_POST['pass'], PASSWORD_BCRYPT);
        $sql->bindParam(4, $pass);

        if ($sql->execute()) {
            $msg=array("Datos Registrados","success");
            } else {
            $msg=array("Datos no registrados","warning");
            }
    }
    ?>
    <!DOCTYPE html>
    <html lang="es-CO" data-bs-theme="dark">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>clientes</title>

        <!--Styles Bootstrap 5.3.3-->
        <link rel="stylesheet" href="../assets/css/bootstrap.css" />
        <link rel="stylesheet" href="../assets/css/styles.css" />
    </head>

    <body style="background-color: lightblue;">
        <main class="form-register m-auto">
            <div class="card">
        
                <div class="card-header">
                <style>
                        
    /* Reseteo básico para asegurar consistencia entre navegadores */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Poppins', sans-serif;
        background-color: blueviolet !important; /* aca puedo editar el fondo del formulario */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 20px;
    }

    .card {
        background: #000330; /* aca puedo definir el color del cuerpo del formulario (tarjeta) */
        border-radius: 12px; /* Bordes más redondeados */
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada */
        padding: 30px;
        max-width: 400px; /* aca puedo ajustar el ancho(me gusta delgado) */
        width: 100%;
        transition: all 0.3s ease-in-out;
    }

    .card:hover {
        transform: scale(1.02); /* Efecto de "hover" en la tarjeta */
    }

    .card-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .card-title {
        font-size: 26px;
        color: #2d3436;
        font-weight: 600;
    }

    .form-floating {
        margin-bottom: 1.5rem;
    }

    .form-floating input {
        border: 2px solid #dfe6e9; /* Borde suave */
        border-radius: 8px;
        padding: 14px;
        font-size: 15px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .form-floating input:focus {
        border-color: #5a3a80; /* Color de borde en foco */
        box-shadow: 0 0 8px rgb(115, 69, 158); /* Sombra al enfocarse */
        outline: none;
    }

    .form-floating label {
        font-size: 14px;
        color: #636e72;
        display: block;
        margin-bottom: 6px;
    }

    .btn-group {
        display: flex;
        justify-content: space-between;
    }

    .btn {
        border-radius: 8px;
        padding: 14px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
        margin-top: 20px;
    }

    .btn-primary {
        background-color: #ffae00; /* aca puedo editar el color del boton (inica sesion o registrar) */
        color: wheat; /* Texto blanco */
        border-style:initial;
    }

    .btn-primary:hover {
        background-color: #ffca66; /* Efecto "hover" más suave */
        transform: scale(1.05); /* Pequeño efecto de zoom */
    }

    .btn-danger {
        background-color: #e17055; /* este es el color del boton "cancelar" (lo dejare en rojo) */
        color: wheat; /* Texto blanco */
        border: none;
    }

    .btn-danger:hover {
        background-color: #d63031; /* Efecto "hover" más intenso */
        transform: scale(1.05); /* Pequeño efecto de zoom */
    }

    .error {
        color: #d63031;
        font-size: 14px;
        text-align: center;
        margin: 12px 0px;

    }

    .create-account {
        display: block;
        text-align: center;
        margin-top: 16px;
        color: #00192c;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
    }

    .create-account:hover {
        color: #ffae00; /* Cambio de color en "hover" */
        text-decoration: underline;
    }
                        </style>
                <img src="../assets/img/logo.png" alt="Avatar Logo" style="width: 100px" class="d-block mx-auto" />
                <h5 class="card-title py-1" style="color: #e6e6ff;">se nuestro cliente</h5>
                <a class="navbar-brand mx-auto" href="#">
                </a>
                </div>
                <div class="card-body">
                    <!--Ventana de alerta-->
            <?php if (isset($msg)) { ?>
                <div class="alert alert-<?php echo $msg['1']; ?> alert-dismissible">
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    <strong>Alerta!</strong> <?php echo $msg['0']; ?>
                </div>
                <?php } ?>
                        <form class="form-floating" action="" method="post">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="fname" name="fname" placeholder="Escriba sus nombres">
                            <label for="fname">Nombres</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="lname" placeholder="Escriba sus nombres" name="lname">
                            <label for="lname">Apellidos</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="email" name="email" placeholder="Escriba su correo">
                            <label for="email">Email</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="password" class="form-control" id="pass" name="pass" placeholder="Escriba la contraseña">
                            <label for="pass">Contraseña</label>
                        </div>
                        <div class="form-floating mb-3 btn-group w-100">
                    <button class="btn btn-primary" type="submit" name="btn-reg">Registrar</button>
                    <a class="btn btn-danger" href="ic.php">Vuelve a iniciar sesión</a>
                </div>
                    </form>
                </div>
            </div>

        </main>
        <script src="../assets/js/bootstrap.bundle.js"></script>
    </body>

    </html>
