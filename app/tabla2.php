<?php
require_once 'conexion.php';

// Código PHP para eliminar registros
if (isset($_GET['del'])) {
    $stmt = $conexion->prepare('DELETE FROM productos WHERE idproductos=?');
    $stmt->bindParam(1, $_GET['del']);
    $stmt->execute();
    if ($stmt) {
        $msg = array("Datos eliminados", "success");
    } else {
        $msg = array("Error al eliminar", "danger");
    }
}

// Código PHP para insertar registros
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['agregar_producto'])) {
    $idproductos = $_POST['idproductos'];
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $cantidadDisponible = $_POST['cantidadDisponible'];

    $stmt = $conexion->prepare('INSERT INTO productos (idproductos, nombre, precio, cantidadDisponible) VALUES (?, ?, ?, ?)');
    $stmt->bindParam(1, $idproductos);
    $stmt->bindParam(2, $nombre);
    $stmt->bindParam(3, $precio);
    $stmt->bindParam(4, $cantidadDisponible);

    if ($stmt->execute()) {
        $msg = array("Producto agregado con éxito", "success");
    } else {
        $msg = array("Error al agregar producto", "danger");
    }
}
?>

<h1 class="pt-5 mt-5 text-center">Echale un vistazo a tus productos:</h1>

<?php if (isset($msg)) { ?>
<div class="alert alert-<?php echo $msg[1]; ?> alert-dismissible">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <strong>Alerta!</strong> <?php echo $msg[0]; ?>
</div>
<?php } ?>

<div class="container mt-1">
    <!-- Botón Agregar -->
    <div class="text-end mb-1">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#agregarProductoModal">
            <i class="bi bi-plus-circle"></i> Agrega un registro
        </button>
    </div>

    <table class="table table-striped table-hover table-bordered" id="tableres">
        <thead class="table-primary">
            <tr>
                <th>ID</th>
                <th>Nombre del producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Operaciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $result = $conexion->prepare('SELECT * FROM productos');
            $result->execute();
            while ($view = $result->fetch(PDO::FETCH_ASSOC)) {
                // Verificación de existencia del índice
                if (isset($view['idproductos'])) {
            ?>
            <tr>
                <td><?php echo $view['idproductos']; ?></td>
                <td><?php echo $view['nombre']; ?></td>
                <td><?php echo $view['cantidadDisponible']; ?></td>
                <td><?php echo $view['precio']; ?></td>
                <td class="text-center">
                    <button type="button" class="btn btn-warning">Editar</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminar<?php echo $view['idproductos']; ?>">Eliminar</button>
                </td>
            </tr>

            <!-- Modal de Confirmación para Eliminar -->
            <div class="modal fade" id="eliminar<?php echo $view['idproductos']; ?>">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Mensaje de Alerta</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Realmente deseas eliminar el producto: <?php echo $view['nombre']; ?>?</p>
                        </div>
                        <div class="modal-footer">
                            <a href="tabla2.php?del=<?php echo $view['idproductos']; ?>" class="btn btn-success">Confirmar</a>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
            <?php
                }
            }
            ?>
        </tbody>
    </table>
</div>

<!-- Modal para agregar producto -->
<div class="modal fade" id="agregarProductoModal">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Agregar Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form method="POST" action="tabla2.php">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="number" step="0.01" class="form-control" id="precio" name="precio" required>
                    </div>
                    <div class="mb-3">
                        <label for="cantidadDisponible" class="form-label">Cantidad Disponible</label>
                        <input type="number" class="form-control" id="cantidadDisponible" name="cantidadDisponible" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" name="agregar_producto">Agregar</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Scripts de DataTables -->
<script type="text/javascript" src="../assets/datatables/js/jquery-3.5.1.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/dataTables.responsive.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/dataTables.bootstrap5.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/jszip.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/pdfmake.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/vfs_fonts.min.js"></script>
<script type="text/javascript" src="../assets/datatables/js/buttons.html5.js"></script>
<script type="text/javascript" src="../assets/datatables/js/buttons.print.js"></script>

<script type="text/javascript">
    $(document).ready(function () {
        $('#tableres').DataTable({
            dom: 'Bflrtip',
            buttons: [
                {
                    extend: 'copyHtml5',
                    footer: true,
                    titleAttr: 'Copiar',
                    className: 'btn btn-outline-primary btn-md',
                    text: '<i class="bi bi-clipboard"></i> Copiar',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {
                    extend: 'excelHtml5',
                    footer: true,
                    titleAttr: 'Excel',
                    className: 'btn btn-outline-success btn-md',
                    text: '<i class="bi bi-file-earmark-excel"></i> Excel',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
            ],
        });
    });
</script>
