-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2023 at 11:44 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ucm_riu`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) PRIMARY KEY,,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('ish0sSLCfwF5RkZxrtA4py-JCVKQ44DY', 1702314675, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"a@ucm.es\"}');

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_img_imagenes`
--

CREATE TABLE `ucm_aw_riu_img_imagenes` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nombre_ins` varchar(255) NOT NULL,
  `nombre_imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ucm_aw_riu_img_imagenes`
--

INSERT INTO `ucm_aw_riu_img_imagenes` (`nombre_ins`, `nombre_imagen`) VALUES
('Salon de actos', 'actos1.jpg'),
('Sala de grados', 'grados1.jpg'),
('Laboratorio', 'lab1.jpg'),
('Sala de reuniones', 'reuniones1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_ins_instalaciones`
--

CREATE TABLE `ucm_aw_riu_ins_instalaciones` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `facultad` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ucm_aw_riu_ins_instalaciones`
--

INSERT INTO `ucm_aw_riu_ins_instalaciones` (`nombre`, `tipo`, `facultad`) VALUES
('Lab 1', 'Laboratorio', 'Informática'),
('Lab 2', 'Laboratorio', 'Informática'),
('Lab 3', 'Laboratorio', 'Informática'),
('Lab 1', 'Laboratorio', 'Biología'),
('Lab 2', 'Laboratorio', 'Biología'),
('Lab 3', 'Laboratorio', 'Biología'),
('Salón de actos', 'Salón de actos', 'Informática');

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_ins_tipo`
--

CREATE TABLE `ucm_aw_riu_ins_tipo` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `tipo` varchar(200) NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `hora_de_apertura` time DEFAULT NULL,
  `hora_de_cierre` time DEFAULT NULL,
  `aforo` int(20) DEFAULT NULL,
  `colectivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ucm_aw_riu_ins_tipo`
--

INSERT INTO `ucm_aw_riu_ins_tipo` (`tipo`, `imagen`, `descripcion`, `hora_de_apertura`, `hora_de_cierre`, `aforo`, `colectivo`) VALUES
('Laboratorio', 'lab1.jpg', 'Reserva un puesto de laboratorio durante dos horas', '09:00:00', '21:00:00', 20, 0),
('Sala de grados', 'grados1.jpg', 'Reserva una sala de grados durante dos horas', '10:00:00', '20:00:00', 50, 1),
('Salón de actos', 'actos1.jpg', 'Reserva un salón de actos durante dos horas', '10:00:00', '20:00:00', 300, 1),
('Sala de reuniones', 'reuniones1.jpg', 'Reserva una sala de reunión durante dos horas', '09:00:00', '21:00:00', 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_res_reservas`
--

CREATE TABLE `ucm_aw_riu_res_reservas` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nombre_ins` varchar(255) NOT NULL,
  `facultad` varchar(255) NOT NULL,
  `nombre_usu` varchar(255) NOT NULL,
  `correo_usu` varchar(255) NOT NULL,
  `fecha_res` date NOT NULL,
  `hora_res` time NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ucm_aw_riu_res_reservas`
--

INSERT INTO `ucm_aw_riu_res_reservas` (`nombre_ins`, `facultad`, `nombre_usu`, `correo_usu`, `fecha_res`, `hora_res`, `colectivo`) VALUES
('Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '11:00:00', 0),
('Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '09:00:00', 0),
('Lab 1', 'Informática', 'aa', 'aa@', '2023-12-12', '15:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_usu_usuarios`
--

CREATE TABLE `ucm_aw_riu_usu_usuarios` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(255) NOT NULL,
  `apellido1` varchar(255) NOT NULL,
  `apellido2` varchar(255) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `validado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_riu_usu_usuarios`
--

INSERT INTO `ucm_aw_riu_usu_usuarios` (`nombre`, `apellido1`, `apellido2`, `correo`, `contrasena`, `admin`, `validado`) VALUES
('Gustabo', 'Adolfo', 'Roberto', 'gustabo@ucm.es', 'a', 0, 0),
('a', 'a', 'a', 'a@ucm.es', 'a', 1, 1),
('Josefa', 'Pérez', 'García', 'josefa@ucm.es', 'a', 0, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
