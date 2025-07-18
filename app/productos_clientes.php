<?php
try {
    if (isset($_GET['del'])) {
        $stmt = $conexion->prepare('DELETE FROM clientes WHERE ClienteID = ?');
        $stmt->bindParam(1, $_GET['del']);
        $executeSuccess = $stmt->execute();
        
        $msg = $executeSuccess ? array("datos eliminados", "success") : array("error al eliminar", "danger");
    }
} catch (Exception $e) {
    $msg = array("error al eliminar", "danger");
}
?>

<h1 class="pt-5 mt-5 text-center">CLIENTES:</h1>

<?php if (isset($msg)) { ?>
    <div class="alert alert-<?php echo $msg[1]; ?> alert-dismissible">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <strong>Alerta!</strong> <?php echo $msg[0]; ?>
    </div>
<?php } ?>

<div class="container mt-1">
    <div class="text-end mb-1">
        <button type="button" class="btn btn-primary" onclick="location.href='c.php'">
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
            $result = $conexion->prepare('SELECT * FROM clientes');
            $result->execute();
            while ($view = $result->fetch(PDO::FETCH_ASSOC)) {
            ?>
            <tr>
                <td><?php echo htmlspecialchars($view['ClienteID']); ?></td>
                <td><?php echo htmlspecialchars($view['fname']); ?></td>
                <td><?php echo htmlspecialchars($view['lname']); ?></td>
                <td><?php echo htmlspecialchars($view['email']); ?></td>
                <td class="text-center">
                    <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#productosModal<?php echo $view['ClienteID']; ?>">Ver</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminarModal<?php echo $view['ClienteID']; ?>">Eliminar</button>
                </td>
            </tr>

            <!-- Modal de Confirmación para Eliminar -->
            <div class="modal fade" id="eliminarModal<?php echo $view['ClienteID']; ?>">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Mensaje de Alerta</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Realmente deseas eliminar el registro con los datos: <?php echo htmlspecialchars($view['email']) . " " . htmlspecialchars($view['ClienteID']); ?>?</p>
                        </div>
                        <div class="modal-footer">
                            <a href="homead.php?page=tabla&del=<?php echo htmlspecialchars($view['ClienteID']); ?>" class="btn btn-success">Confirmar</a>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal para mostrar productos del cliente -->
            <div class="modal fade" id="productosModal<?php echo $view['ClienteID']; ?>">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Productos</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Nombre del producto: <?php echo htmlspecialchars($view['fname']); ?></p>
                            <p>Cantidad: <?php echo htmlspecialchars($view['lname']); ?></p>
                            <p>Precio: <?php echo htmlspecialchars($view['email']); ?></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <?php } ?>
        </tbody>
    </table>
</div>

<!-- Datatables Scripts -->
<script src="../assets/datatables/js/jquery-3.5.1.min.js"></script>
<script src="../assets/datatables/js/jquery.dataTables.min.js"></script>
<script src="../assets/datatables/js/dataTables.responsive.min.js"></script>
<script src="../assets/datatables/js/dataTables.buttons.min.js"></script>
<script src="../assets/datatables/js/dataTables.bootstrap5.min.js"></script>
<script src="../assets/datatables/js/jszip.min.js"></script>
<script src="../assets/datatables/js/pdfmake.min.js"></script>
<script src="../assets/datatables/js/vfs_fonts.min.js"></script>
<script src="../assets/datatables/js/buttons.html5.js"></script>
<script src="../assets/datatables/js/buttons.print.js"></script>

<script>
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
                    exportOptions: { columns: [0, 1, 2, 3] }
                },
                {
                    extend: 'excelHtml5',
                    footer: true,
                    titleAttr: 'Excel',
                    className: 'btn btn-outline-success btn-md',
                    text: '<i class="bi bi-file-earmark-excel"></i> Excel',
                    exportOptions: { columns: [0, 1, 2, 3] }
                },
            ]
        });
    });
</script>
