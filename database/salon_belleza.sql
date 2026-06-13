-- Creación de la base de datos principal del proyecto
CREATE DATABASE salon_belleza;

-- Creación de la tabla usuarios
-- Esta tabla almacena la información de los clientes del sistema
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL CHECK(LENGTH(contrasena) >= 6),
    numero_telefono VARCHAR(15) NOT NULL CHECK(LENGTH(numero_telefono) >= 10),
    fecha_nacimiento DATE NOT NULL 
);

-- Creación de la tabla servicios
-- Esta tabla almacena los servicios disponibles del salón
CREATE TABLE servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    costo DECIMAL NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo'
);

-- Creación de la tabla citas
-- Esta tabla registra las citas agendadas por los usuarios
CREATE TABLE citas (
    id_cita SERIAL PRIMARY KEY,
    id_servicio INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    especialista VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
);

-- Relación entre la tabla citas y servicios
-- Garantiza que cada cita tenga un servicio válido
ALTER TABLE citas
ADD CONSTRAINT fk_citas_servicios
FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio);

-- Relación entre la tabla citas y usuarios
-- Garantiza que cada cita pertenezca a un usuario existente
ALTER TABLE citas
ADD CONSTRAINT fk_citas_usuarios
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);

-- Inserción de datos de prueba en la tabla usuarios
INSERT INTO usuarios (
    nombres,
    apellidos,
    correo,
    contrasena,
    numero_telefono,
    fecha_nacimiento 
)
VALUES
    ('Laura', 'Martínez', 'laura@gmail.com', '123456', '3001234567', '2001-05-12'),
    ('Carlos', 'Ramírez', 'carlos@gmail.com', '123456', '3109876543', '1998-11-20'),
    ('Sofía', 'Gómez', 'sofia@gmail.com', '123456', '3204567890', '2003-02-15');

-- Inserción de datos de prueba en la tabla servicios
INSERT INTO servicios (
    nombre,
    descripcion,
    costo,
    estado
)
VALUES
    ('Diseño de cejas', 'Diseño profesional de cejas', 35000, 'activo'),
    ('Manicure clásica', 'Manicure básica de cuidado de uñas', 25000, 'activo'),
    ('Manucure gel', 'Aplicación de esmalte en gel de larga duración', 55000, 'activo'),
    ('Limpieza facial', 'Limpieza profunda de piel facial', 70000, 'activo');

-- Inserción de datos de prueba en la tabla citas
INSERT INTO citas (
    id_servicio,
    id_usuario,
    fecha,
    hora,
    especialista,
    estado
)
VALUES
    (1, 2, '2026-05-15', '10:00:00', 'Ana López', 'pendiente'),
    (2, 1, '2026-05-16', '14:30:00', 'María Pérez', 'pendiente'),
    (3, 3, '2026-05-17', '09:00:00', 'Laura Díaz', 'completada');

-- Consulta para visualizar todos los usuarios registrados
SELECT * FROM usuarios;

-- Consulta para visualizar todos los servicios disponibles
SELECT * FROM servicios;

-- Consulta para visualizar todas las citas registradas
SELECT * FROM citas;

-- Consulta para mostrar únicamente las citas pendientes
SELECT * FROM citas
WHERE estado = 'pendiente';


