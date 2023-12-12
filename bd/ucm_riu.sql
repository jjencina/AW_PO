-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2023 a las 14:53:02
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
('QWwIJUD8Cdta8LhrOwXkN2SXVQhlKBoE', 1702389153, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"a@ucm.es\"}');

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
(3, 'Laboratorio', 'lab1.jpg'),
(4, 'Sala de reuniones', 'reuniones1.jpg');

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
(1, 'Lab 1', 'Laboratorio', 'Informática'),
(2, 'Lab 2', 'Laboratorio', 'Informática'),
(3, 'Lab 3', 'Laboratorio', 'Informática'),
(4, 'Lab 1', 'Laboratorio', 'Biología'),
(5, 'Lab 2', 'Laboratorio', 'Biología'),
(6, 'Lab 3', 'Laboratorio', 'Biología'),
(7, 'Salón de actos', 'Salón de actos', 'Informática');

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
(1, 'Laboratorio', 'lab1.jpg', 'Reserva un puesto de laboratorio durante dos horas', '09:00:00', '21:00:00', 20, 0),
(2, 'Sala de grados', 'grados1.jpg', 'Reserva una sala de grados durante dos horas', '10:00:00', '20:00:00', 50, 1),
(3, 'Salón de actos', 'actos1.jpg', 'Reserva un salón de actos durante dos horas', '10:00:00', '20:00:00', 300, 1),
(4, 'Sala de reuniones', 'reuniones1.jpg', 'Reserva una sala de reunión durante dos horas', '09:00:00', '21:00:00', 15, 1);

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
(3, 'Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '15:00:00');

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
  `facultad` varchar(255) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_usu_usuarios`
--

INSERT INTO `ucm_aw_riu_usu_usuarios` (`id`, `nombre`, `apellido1`, `apellido2`, `correo`, `contrasena`, `admin`, `validado`, `foto`,`facultad`) VALUES
(1, 'Gustabo', 'Adolfo', 'Roberto', 'gustabo@ucm.es', 'a', 0, 0, 'gustabo@ucm.es', 'Informática'),
(2, 'a', 'a', 'a', 'a@ucm.es', 'a', 1, 1, 'a@ucm.es', 'Informática'),
(3, 'Josefa', 'Pérez', 'García', 'josefa@ucm.es', 'a', 0, 0, 'josefa@ucm.es', 'Informática');

--
-- Table structure for table `ucm_aw_riu_msg_mensajes`
--

CREATE TABLE `ucm_aw_riu_msg_mensajes` (
  `id` int(11) NOT NULL,
  `correoEmisor` varchar(255) NOT NULL,
  `correoReceptor` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `mensaje` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ucm_aw_riu_msg_mensajes`
--

INSERT INTO `ucm_aw_riu_msg_mensajes` (`id`, `correoEmisor`, `correoReceptor`, `fecha`, `mensaje`) VALUES
(1, 'a@ucm.es', 'gustabo@ucm.es', '2023-12-12', 'Hola, soy a.'),
(2, 'gustabo@ucm.es', 'a@ucm.es', '2023-12-12', 'Hola, yo soy Gustabo.'),
(3, 'a@ucm.es', 'josefa@ucm.es', '2023-12-13', 'Hola, soy a.');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

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
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_img_imagenes`
--
ALTER TABLE `ucm_aw_riu_img_imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_ins_instalaciones`
--
ALTER TABLE `ucm_aw_riu_ins_instalaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_ins_tipo`
--
ALTER TABLE `ucm_aw_riu_ins_tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_res_reservas`
--
ALTER TABLE `ucm_aw_riu_res_reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_usu_usuarios`
--
ALTER TABLE `ucm_aw_riu_usu_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;
-- Indexes for dumped tables
--

--
-- Indexes for table `ucm_aw_riu_msg_mensajes`
--
ALTER TABLE `ucm_aw_riu_msg_mensajes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ucm_aw_riu_msg_mensajes`
--
ALTER TABLE `ucm_aw_riu_msg_mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
