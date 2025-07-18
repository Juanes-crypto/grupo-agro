<?php
if (isset($_GET['del'])) {
    $stmt = $conexion->prepare('DELETE FROM adm WHERE idadm=?');
    $stmt->bindParam(1, $_GET['del']);
    $stmt->execute();
    if ($stmt) {
        $msg = array("datos eliminados", "success");
    } else {
        $msg = array("error al eliminar", "danger");
    }
}
?>


<h1 class="pt-5 mt-5 text-center">ADMINISTRADORES:</h1>

<?php if (isset($msg)) { ?>
            <div class="alert alert-<?php echo $msg['1']; ?> alert-dismissible">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Alerta!</strong> <?php echo $msg['0']; ?> </div>
                <?php } ?>

<div class="container mt-1">
    <!-- Botón Agregar -->
    <div class="text-end mb-1">
        <button type="button" class="btn btn-primary" onclick="location.href='c.php'">
            <i class="bi bi-plus-circle"></i> Agrega un registro
        </button>
    </div>
    
    <table class="table table-striped table-hover table-bordered" id="tableres">
        <thead class="table-primary">
            <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>email</th>
                <th>Operaciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $result = $conexion->prepare('SELECT * FROM adm');
            $result->execute();
            while ($view = $result->fetch(PDO::FETCH_ASSOC)) {
            ?>
            <tr>
                <td><?php echo $view['idadm']; ?></td>
                <td><?php echo $view['fname']; ?></td>
                <td><?php echo $view['lname']; ?></td>
                <td><?php echo $view['email']; ?></td>
                <td class="text-center">
                    <button type="button" class="btn btn-warning">Editar</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#eliminar=<?php echo $view['idadm']; ?>">Eliminar</button>
                </td>
            </tr>

            <!-- Modal de Confirmación para Eliminar -->
            <div class="modal fade" id="eliminar=<?php echo $view['idadm']; ?>">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Mensaje de Alerta</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Realmente deseas eliminar el registro con los datos: <?php echo $view['email'] . " " . $view['idadm']; ?>?</p>
                        </div>
                        <div class="modal-footer">
                            <a href="homead.php?page=tabla&del=<?php echo $view['idadm']; ?>" class="btn btn-success">Confirmar</a>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            <?php } ?>
        </tbody>
    </table>
</div>

<!-- Datatables Scripts -->
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
    // Iniciar DataTables con botones personalizados
    $(document).ready(function () {
        $('#tableres').DataTable({
            dom: 'Bflrtip',
            buttons: [
                {//Botón Copy
                    extend: 'copyHtml5',
                    footer: true,
                    titleAttr: 'Copiar',
                    className: 'btn btn-outline-primary btn-md',
                    text: '<i class="bi bi-clipboard"></i> Copiar',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {//Botón Excel
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