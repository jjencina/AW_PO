-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-12-2023 a las 19:13:50
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ucm_riu`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('eX_9G9mcUL9sPn_doVlRWaj0wSbdqX_2', 1702923188, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"josefa@ucm.es\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_facultades`
--

CREATE TABLE `ucm_aw_riu_facultades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_facultades`
--

INSERT INTO `ucm_aw_riu_facultades` (`id`, `nombre`, `foto`, `titulo`) VALUES
(1, 'Informática', 'logo_informatica.png', 'Fdi Informática'),
(2, 'Biología', 'logo_biologia.png', 'Fdi Biología'),
(3, 'Información', 'logo_informacion.png', 'Fdi Información'),
(4, 'ucm', 'logoUCM.png', 'UCM-<r>RIU</r>');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_img_imagenes`
--

CREATE TABLE `ucm_aw_riu_img_imagenes` (
  `id` int(11) NOT NULL,
  `nombre_ins` varchar(255) NOT NULL,
  `nombre_imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_img_imagenes`
--

INSERT INTO `ucm_aw_riu_img_imagenes` (`id`, `nombre_ins`, `nombre_imagen`) VALUES
(1, 'Salon de actos', 'actos1.jpg'),
(2, 'Sala de grados', 'grados1.jpg'),
(3, 'Laboratorios', 'lab1.jpg'),
(4, 'Sala de reuniones', 'reuniones1.jpg'),
(5, 'Laboratorios', 'lab2.jpg'),
(6, 'Sala de grados', 'grados2.jpg'),
(7, 'Salon de actos', 'actos2.jpg'),
(8, 'Sala de reuniones', 'reuniones2.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_ins_instalaciones`
--

CREATE TABLE `ucm_aw_riu_ins_instalaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `facultad` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_ins_instalaciones`
--

INSERT INTO `ucm_aw_riu_ins_instalaciones` (`id`, `nombre`, `tipo`, `facultad`) VALUES
(1, 'Lab 1', 'Laboratorios', 'Informática'),
(2, 'Lab 2', 'Laboratorios', 'Informática'),
(3, 'Lab 3', 'Laboratorios', 'Informática'),
(4, 'Lab 1', 'Laboratorios', 'Biología'),
(5, 'Lab 2', 'Laboratorios', 'Biología'),
(6, 'Lab 3', 'Laboratorios', 'Biología'),
(7, 'Salón de actos 1', 'Salón de actos', 'Informática'),
(8, 'Salón de actos 1', 'Salón de actos', 'Biología'),
(9, 'Salón de actos 1', 'Salón de actos', 'Información'),
(10, 'Sala de grados 1', 'Sala de grados', 'Informática'),
(11, 'Sala de grados 1', 'Sala de grados', 'Biología'),
(12, 'Sala de grados 1', 'Sala de grados', 'Información'),
(13, 'Sala de reuniones 1', 'Sala de reuniones', 'Informática'),
(14, 'Sala de reuniones 1', 'Sala de reuniones', 'Biología'),
(15, 'Sala de reuniones 1', 'Sala de reuniones', 'Información');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_ins_tipo`
--

CREATE TABLE `ucm_aw_riu_ins_tipo` (
  `id` int(11) NOT NULL,
  `tipo` varchar(200) NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `hora_de_apertura` time DEFAULT NULL,
  `hora_de_cierre` time DEFAULT NULL,
  `aforo` int(20) DEFAULT NULL,
  `colectivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_ins_tipo`
--

INSERT INTO `ucm_aw_riu_ins_tipo` (`id`, `tipo`, `imagen`, `descripcion`, `hora_de_apertura`, `hora_de_cierre`, `aforo`, `colectivo`) VALUES
(1, 'Laboratorios', 'lab1.jpg', 'Reserva un puesto de laboratorio durante dos horas para trabajar como quieras.', '09:00:00', '21:00:00', 20, 0),
(2, 'Sala de grados', 'grados1.jpg', 'Reserva una sala de grados durante dos horas para tus conferencias.', '10:00:00', '20:00:00', 50, 1),
(3, 'Salón de actos', 'actos1.jpg', 'Reserva un salón de actos durante dos horas para realizar algún tipo de exposición.', '10:00:00', '20:00:00', 300, 1),
(4, 'Sala de reuniones', 'reuniones1.jpg', 'Reserva una sala de reunión durante dos horas para tus reuniones.', '09:00:00', '21:00:00', 15, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_msg_mensajes`
--

CREATE TABLE `ucm_aw_riu_msg_mensajes` (
  `id` int(11) NOT NULL,
  `correoEmisor` varchar(255) NOT NULL,
  `correoReceptor` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `mensaje` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_msg_mensajes`
--

INSERT INTO `ucm_aw_riu_msg_mensajes` (`id`, `correoEmisor`, `correoReceptor`, `fecha`, `hora`, `mensaje`) VALUES
(3, 'a@ucm.es', 'josefa@ucm.es', '2023-12-12', '19:08:00', 'Hola, soy a.'),
(5, 'a@ucm.es', 'josefa@ucm.es', '2023-12-12', '18:06:19', 'hola josefa'),
(18, 'a@ucm.es', 'josefa@ucm.es', '2023-12-14', '16:21:46', 'patata'),
(29, 'a@ucm.es', 'juan@ucm.es', '2023-12-17', '18:27:25', 'Tu cuenta ha sido validada'),
(31, 'a@ucm.es', 'farid@ucm.es', '2023-12-17', '18:27:26', 'Tu cuenta ha sido validada'),
(32, 'a@ucm.es', 'natasha@ucm.es', '2023-12-17', '18:27:27', 'Tu cuenta ha sido validada'),
(33, 'a@ucm.es', 'taylor@ucm.es', '2023-12-17', '18:27:27', 'Tu cuenta ha sido validada'),
(35, 'farid@ucm.es', 'natasha@ucm.es', '2023-12-17', '18:55:27', 'Hola Natasha'),
(36, 'farid@ucm.es', 'natasha@ucm.es', '2023-12-17', '18:55:42', 'Cuando es la recu de FGU??'),
(37, 'natasha@ucm.es', 'farid@ucm.es', '2023-12-17', '18:56:20', 'Fue ayer...'),
(38, 'taylor@ucm.es', 'c@ucm.es', '2023-12-17', '19:02:22', 'Se te han olvidado los cascos en clase'),
(39, 'taylor@ucm.es', 'c@ucm.es', '2023-12-17', '19:02:55', 'Les lleve a objetos perdidos'),
(40, 'taylor@ucm.es', 'godofredo@ucm.es', '2023-12-17', '19:03:10', 'Hola'),
(41, 'taylor@ucm.es', 'godofredo@ucm.es', '2023-12-17', '19:04:01', 'Ya reserve la sala para exponer el TFG'),
(42, 'taylor@ucm.es', 'godofredo@ucm.es', '2023-12-17', '19:04:34', 'Sala de reuniones 1 de la fdi, el Martes a las 19:00'),
(44, 'godofredo@ucm.es', 'taylor@ucm.es', '2023-12-17', '19:09:24', 'Vale perfecto'),
(45, 'a@ucm.es', 'taylor@ucm.es', '2023-12-17', '19:12:21', 'Hemos perdido los cascos que llevaste a objetos perdidos'),
(46, 'josefa@ucm.es', 'a@ucm.es', '2023-12-17', '19:12:46', 'berenjena'),
(47, 'josefa@ucm.es', 'juan@ucm.es', '2023-12-17', '19:13:05', 'Hola :)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_res_reservas`
--

CREATE TABLE `ucm_aw_riu_res_reservas` (
  `id` int(11) NOT NULL,
  `nombre_ins` varchar(255) NOT NULL,
  `facultad` varchar(255) NOT NULL,
  `nombre_usu` varchar(255) NOT NULL,
  `correo_usu` varchar(255) NOT NULL,
  `fecha_res` date NOT NULL,
  `hora_res` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_res_reservas`
--

INSERT INTO `ucm_aw_riu_res_reservas` (`id`, `nombre_ins`, `facultad`, `nombre_usu`, `correo_usu`, `fecha_res`, `hora_res`) VALUES
(1, 'Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '11:00:00'),
(2, 'Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '09:00:00'),
(3, 'Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '15:00:00'),
(16, 'Salón de actos', 'Informática', 'a', 'a@ucm.es', '2023-12-14', '14:00:00'),
(17, 'Salón de actos', 'Informática', 'a', 'a@ucm.es', '2023-12-14', '14:00:00'),
(18, 'Salón de actos', 'Informática', 'a', 'a@ucm.es', '2023-12-14', '14:00:00'),
(19, 'Salón de actos', 'Informática', 'a', 'a@ucm.es', '2023-12-14', '14:00:00'),
(20, 'Salón de actos', 'Informática', 'a', 'a@ucm.es', '2023-12-14', '14:00:00'),
(21, 'Lab 1', 'Informática', 'a', 'a@ucm.es', '2222-02-22', '11:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_usu_usuarios`
--

CREATE TABLE `ucm_aw_riu_usu_usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido1` varchar(255) NOT NULL,
  `apellido2` varchar(255) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `validado` tinyint(1) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `facultad` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_usu_usuarios`
--

INSERT INTO `ucm_aw_riu_usu_usuarios` (`id`, `nombre`, `apellido1`, `apellido2`, `correo`, `contrasena`, `admin`, `validado`, `foto`, `facultad`) VALUES
(2, 'a', 'a', 'a', 'a@ucm.es', 'a', 1, 1, 'user2.png', 'Informática'),
(3, 'Josefa', 'Pérez', 'García', 'josefa@ucm.es', 'a', 1, 1, 'user3.png', 'Informática'),
(6, 'b', 'b', 'b', 'b@ucm.es', 'b', 1, 1, 'default.png', 'Informática'),
(7, 'c', 'c', 'c', 'c@ucm.es', 'c', 0, 1, 'default.png', 'Información'),
(9, 'Juan', 'Pérez', 'García', 'juan@ucm.es', 'a', 0, 1, NULL, 'Informática'),
(11, 'Farid', 'Lahsen', '', 'farid@ucm.es', 'a', 0, 1, NULL, 'Biología'),
(12, 'Natasha', 'Ivanov', '', 'natasha@ucm.es', 'a', 0, 1, NULL, 'Biología'),
(13, 'Taylor', 'Anderson', '', 'taylor@ucm.es', 'a', 0, 1, NULL, 'Información'),
(14, 'Godofredo', 'Anderson', 'Gutierrez', 'godofredo@ucm.es', 'a', 0, 1, NULL, 'Información');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `ucm_aw_riu_facultades`
--
ALTER TABLE `ucm_aw_riu_facultades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_img_imagenes`
--
ALTER TABLE `ucm_aw_riu_img_imagenes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_ins_instalaciones`
--
ALTER TABLE `ucm_aw_riu_ins_instalaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_ins_tipo`
--
ALTER TABLE `ucm_aw_riu_ins_tipo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_msg_mensajes`
--
ALTER TABLE `ucm_aw_riu_msg_mensajes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_res_reservas`
--
ALTER TABLE `ucm_aw_riu_res_reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_usu_usuarios`
--
ALTER TABLE `ucm_aw_riu_usu_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_facultades`
--
ALTER TABLE `ucm_aw_riu_facultades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_img_imagenes`
--
ALTER TABLE `ucm_aw_riu_img_imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_ins_instalaciones`
--
ALTER TABLE `ucm_aw_riu_ins_instalaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_ins_tipo`
--
ALTER TABLE `ucm_aw_riu_ins_tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_msg_mensajes`
--
ALTER TABLE `ucm_aw_riu_msg_mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_res_reservas`
--
ALTER TABLE `ucm_aw_riu_res_reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_usu_usuarios`
--
ALTER TABLE `ucm_aw_riu_usu_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
