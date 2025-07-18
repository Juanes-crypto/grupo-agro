<?php
require_once 'conexion.php';

if (isset($_POST['btn-reg'])) {
    $sql=$conexion->prepare("INSERT INTO clientes(clienteid,nombre, pass, usuario) VALUES(?,?,?,?)");
    $sql->bindParam(1,$_POST['clienteid']);
    $sql->bindParam(2,$_POST['nombre']);
    $sql->bindParam(3,$_POST['pass']);
    $sql->bindParam(4,$_POST['usuario']);
    

    if ($sql->execute()) {
        echo "Datos Registrados";
    }else{
        echo "Datos no registrados";
    }
}
?>

<!DOCTYPE html>
<html lang="es-CO" data-bs-theme="dark">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>registro_cliente</title>

    <!--Styles Bootstrap 5.3.3-->
    <link rel="stylesheet" href="../assets/css/bootstrap.css" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
</head>

<body style="background-color: lightblue;">
    <main class="form-register w-100 m-auto">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Registro del cliente</h5>
            </div>
            <div class="card-body">
                <form class="form-floating" action="" method="post">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="fname" name="fname" placeholder="Escriba sus nombres">
                        <label for="fname">Nombres</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="email" name="pass" placeholder="Escriba su contraseña">
                        <label for="email">contraseña</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="pass" name="pass" placeholder="Escriba el usuario">
                        <label for="pass">usuario</label>
                    </div>
                    <div class="form-floating mb-3 btn-group w-100">
                        <button class="btn btn-primary" type="submit" name="btn-reg">Registrar</button>
                        <button class="btn btn-danger" type="submit">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

    </main>
    <footer>
        footer

    </footer>

    <script src="../assets/js/bootstrap.bundle.js"></script>
</body>

</html>

<?php
require_once 'conexion.php';

if (isset($_POST['btn-reg'])) {
    $sql = "INSERT INTO datos (nombre, Clave, correo) VALUES (:nombre, :clave, :correo)";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([
        'nombre' => $_POST['usuario'],
        'clave' => md5($_POST['clave']),
        'correo' => $_POST['correo']
    ]);

    echo "Registro exitoso";
}                                                                                                                                                                                                  
?>
