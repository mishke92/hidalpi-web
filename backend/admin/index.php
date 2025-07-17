<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - HidalPi Web</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .sidebar {
            background-color: #343a40;
            min-height: 100vh;
        }
        .sidebar .nav-link {
            color: #adb5bd;
        }
        .sidebar .nav-link:hover {
            color: #fff;
        }
        .sidebar .nav-link.active {
            color: #fff;
            background-color: #495057;
        }
        .main-content {
            margin-left: 250px;
            padding: 20px;
        }
        .card-stats {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .table-responsive {
            max-height: 400px;
            overflow-y: auto;
        }
        .badge-estado {
            font-size: 0.75em;
        }
        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
            .sidebar {
                position: fixed;
                top: 0;
                left: -250px;
                width: 250px;
                z-index: 1000;
                transition: left 0.3s;
            }
            .sidebar.show {
                left: 0;
            }
        }
    </style>
</head>
<body>
    <?php
    require_once '../auth/AuthService.php';
    
    $authService = new AuthService();
    $authService->requiereAdministrador();
    
    $usuario = $authService->obtenerUsuarioActual();
    ?>
    
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <nav class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
                <div class="position-sticky pt-3">
                    <div class="text-center mb-4">
                        <h5 class="text-light">Panel Admin</h5>
                        <small class="text-muted">HidalPi Web</small>
                    </div>
                    
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#dashboard" onclick="showSection('dashboard')">
                                <i class="fas fa-tachometer-alt"></i>
                                Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#empresas" onclick="showSection('empresas')">
                                <i class="fas fa-building"></i>
                                Empresas
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#clientes" onclick="showSection('clientes')">
                                <i class="fas fa-users"></i>
                                Clientes
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#citas" onclick="showSection('citas')">
                                <i class="fas fa-calendar-check"></i>
                                Citas
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#abogados" onclick="showSection('abogados')">
                                <i class="fas fa-user-tie"></i>
                                Abogados
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#reportes" onclick="showSection('reportes')">
                                <i class="fas fa-chart-bar"></i>
                                Reportes
                            </a>
                        </li>
                        <li class="nav-item mt-4">
                            <a class="nav-link" href="#" onclick="logout()">
                                <i class="fas fa-sign-out-alt"></i>
                                Cerrar Sesión
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Panel de Administración</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <span class="text-muted">Bienvenido, <?php echo htmlspecialchars($usuario['nombre']); ?></span>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Section -->
                <div id="dashboard" class="content-section">
                    <div class="row mb-4">
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <h5 class="card-title text-uppercase mb-0">Total Empresas</h5>
                                            <span class="h2 font-weight-bold mb-0" id="total-empresas">0</span>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-building fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <h5 class="card-title text-uppercase mb-0">Total Clientes</h5>
                                            <span class="h2 font-weight-bold mb-0" id="total-clientes">0</span>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-users fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <h5 class="card-title text-uppercase mb-0">Total Citas</h5>
                                            <span class="h2 font-weight-bold mb-0" id="total-citas">0</span>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-calendar-check fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <h5 class="card-title text-uppercase mb-0">Total Abogados</h5>
                                            <span class="h2 font-weight-bold mb-0" id="total-abogados">0</span>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-user-tie fa-2x"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empresas Section -->
                <div id="empresas" class="content-section d-none">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Gestión de Empresas</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>NIT</th>
                                            <th>Teléfono</th>
                                            <th>Email</th>
                                            <th>Ciudad</th>
                                            <th>Estado</th>
                                            <th>Fecha Creación</th>
                                        </tr>
                                    </thead>
                                    <tbody id="empresas-table-body">
                                        <!-- Contenido dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Clientes Section -->
                <div id="clientes" class="content-section d-none">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Gestión de Clientes</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Cédula</th>
                                            <th>Teléfono</th>
                                            <th>Email</th>
                                            <th>Ciudad</th>
                                            <th>Estado</th>
                                            <th>Fecha Creación</th>
                                        </tr>
                                    </thead>
                                    <tbody id="clientes-table-body">
                                        <!-- Contenido dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Citas Section -->
                <div id="citas" class="content-section d-none">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Gestión de Citas</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Abogado</th>
                                            <th>Servicio</th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Estado</th>
                                            <th>Precio</th>
                                            <th>Fecha Creación</th>
                                        </tr>
                                    </thead>
                                    <tbody id="citas-table-body">
                                        <!-- Contenido dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Abogados Section -->
                <div id="abogados" class="content-section d-none">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Gestión de Abogados</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Cédula</th>
                                            <th>Teléfono</th>
                                            <th>Email</th>
                                            <th>Especialidades</th>
                                            <th>Empresa</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="abogados-table-body">
                                        <!-- Contenido dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reportes Section -->
                <div id="reportes" class="content-section d-none">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Reportes y Estadísticas</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Reporte de Empresas</h6>
                                            <button class="btn btn-primary" onclick="downloadReport('empresas')">
                                                <i class="fas fa-download"></i> Descargar CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Reporte de Clientes</h6>
                                            <button class="btn btn-primary" onclick="downloadReport('clientes')">
                                                <i class="fas fa-download"></i> Descargar CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h6 class="card-title">Reporte de Citas</h6>
                                            <button class="btn btn-primary" onclick="downloadReport('citas')">
                                                <i class="fas fa-download"></i> Descargar CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Función para mostrar/ocultar secciones
        function showSection(sectionId) {
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('d-none');
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(sectionId).classList.remove('d-none');
            
            // Actualizar navegación activa
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
            
            // Cargar datos según la sección
            if (sectionId === 'dashboard') {
                loadDashboard();
            } else if (sectionId === 'empresas') {
                loadEmpresas();
            } else if (sectionId === 'clientes') {
                loadClientes();
            } else if (sectionId === 'citas') {
                loadCitas();
            } else if (sectionId === 'abogados') {
                loadAbogados();
            }
        }

        // Cargar datos del dashboard
        function loadDashboard() {
            fetch('dashboard_data.php')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('total-empresas').textContent = data.total_empresas || 0;
                    document.getElementById('total-clientes').textContent = data.total_clientes || 0;
                    document.getElementById('total-citas').textContent = data.total_citas || 0;
                    document.getElementById('total-abogados').textContent = data.total_abogados || 0;
                });
        }

        // Cargar datos de empresas
        function loadEmpresas() {
            fetch('dashboard_data.php?type=empresas')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('empresas-table-body');
                    tbody.innerHTML = '';
                    
                    data.forEach(empresa => {
                        const row = `
                            <tr>
                                <td>${empresa.id}</td>
                                <td>${empresa.nombre}</td>
                                <td>${empresa.nit || 'N/A'}</td>
                                <td>${empresa.telefono || 'N/A'}</td>
                                <td>${empresa.email || 'N/A'}</td>
                                <td>${empresa.ciudad || 'N/A'}</td>
                                <td><span class="badge ${empresa.activo ? 'bg-success' : 'bg-danger'}">${empresa.activo ? 'Activo' : 'Inactivo'}</span></td>
                                <td>${new Date(empresa.fecha_creacion).toLocaleDateString()}</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                });
        }

        // Cargar datos de clientes
        function loadClientes() {
            fetch('dashboard_data.php?type=clientes')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('clientes-table-body');
                    tbody.innerHTML = '';
                    
                    data.forEach(cliente => {
                        const row = `
                            <tr>
                                <td>${cliente.id}</td>
                                <td>${cliente.nombre}</td>
                                <td>${cliente.apellido}</td>
                                <td>${cliente.cedula || 'N/A'}</td>
                                <td>${cliente.telefono || 'N/A'}</td>
                                <td>${cliente.email || 'N/A'}</td>
                                <td>${cliente.ciudad || 'N/A'}</td>
                                <td><span class="badge ${cliente.activo ? 'bg-success' : 'bg-danger'}">${cliente.activo ? 'Activo' : 'Inactivo'}</span></td>
                                <td>${new Date(cliente.fecha_creacion).toLocaleDateString()}</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                });
        }

        // Cargar datos de citas
        function loadCitas() {
            fetch('dashboard_data.php?type=citas')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('citas-table-body');
                    tbody.innerHTML = '';
                    
                    data.forEach(cita => {
                        const estadoColor = {
                            'pendiente': 'bg-warning',
                            'confirmada': 'bg-success',
                            'cancelada': 'bg-danger',
                            'completada': 'bg-info'
                        };
                        
                        const row = `
                            <tr>
                                <td>${cita.id}</td>
                                <td>${cita.cliente_nombre} ${cita.cliente_apellido}</td>
                                <td>${cita.abogado_nombre} ${cita.abogado_apellido}</td>
                                <td>${cita.servicio_nombre}</td>
                                <td>${cita.fecha_cita}</td>
                                <td>${cita.hora_cita}</td>
                                <td><span class="badge ${estadoColor[cita.estado]}">${cita.estado}</span></td>
                                <td>$${cita.precio ? parseFloat(cita.precio).toLocaleString() : 'N/A'}</td>
                                <td>${new Date(cita.fecha_creacion).toLocaleDateString()}</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                });
        }

        // Cargar datos de abogados
        function loadAbogados() {
            fetch('dashboard_data.php?type=abogados')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('abogados-table-body');
                    tbody.innerHTML = '';
                    
                    data.forEach(abogado => {
                        const row = `
                            <tr>
                                <td>${abogado.id}</td>
                                <td>${abogado.nombre}</td>
                                <td>${abogado.apellido}</td>
                                <td>${abogado.cedula || 'N/A'}</td>
                                <td>${abogado.telefono || 'N/A'}</td>
                                <td>${abogado.email || 'N/A'}</td>
                                <td>${abogado.especialidades || 'N/A'}</td>
                                <td>${abogado.empresa_nombre || 'N/A'}</td>
                                <td><span class="badge ${abogado.activo ? 'bg-success' : 'bg-danger'}">${abogado.activo ? 'Activo' : 'Inactivo'}</span></td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                });
        }

        // Descargar reporte
        function downloadReport(type) {
            window.open(`../api/reports.php?type=${type}`, '_blank');
        }

        // Cerrar sesión
        function logout() {
            fetch('../api/auth.php?action=logout', {
                method: 'POST'
            })
            .then(() => {
                window.location.href = '../auth/login.html';
            });
        }

        // Cargar dashboard al inicio
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
        });
    </script>
</body>
</html>