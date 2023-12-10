-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2023 at 01:26 AM
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
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_img_imagenes`
--

CREATE TABLE `ucm_aw_riu_img_imagenes` (
  `id` int(11) NOT NULL,
  `nombre_ins` varchar(255) NOT NULL,
  `nombre_imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ucm_aw_riu_img_imagenes`
--

INSERT INTO `ucm_aw_riu_img_imagenes` (`id`, `nombre_ins`, `nombre_imagen`) VALUES
(1, 'Salon de acto', 'actos1.jpg'),
(2, 'Sala de grados', 'grados1.jpg'),
(3, 'Laboratorio', 'lab1.jpg'),
(4, 'Sala de reuniones', 'reuniones1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_ins_instalaciones`
--

CREATE TABLE `ucm_aw_riu_ins_instalaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `colectivo` tinyint(1) NOT NULL,
  `aforo` int(20) DEFAULT NULL,
  `tipo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `facultad` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_ins_tipo`
--

CREATE TABLE `ucm_aw_riu_ins_tipo` (
  `id` int(255) NOT NULL,
  `tipo` varchar(200) NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `hora_de_apertura` time DEFAULT NULL,
  `hora_de_cierre` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ucm_aw_riu_ins_instalaciones`(`id`, `nombre`, `colectivo`, `aforo`, `tipo`, `facultad`) VALUES 
('1','Lab 1','0','20','Laboratorio','Informática'),
('2','Lab 2','0','20','Laboratorio','Informática'),
('3','Lab 3','0','20','Laboratorio','Informática'),
('4','Lab 1','0','20','Laboratorio','Biología'),
('5','Lab 2','0','20','Laboratorio','Biología'),
('6','Lab 3','0','20','Laboratorio','Biología'),
('7','Salon de actos','1','155','Salon de actos','Informática');

--
-- Dumping data for table `ucm_aw_riu_ins_tipo`
--

INSERT INTO `ucm_aw_riu_ins_tipo` (`id`, `tipo`, `imagen`, `descripcion`, `hora_de_apertura`, `hora_de_cierre`) VALUES
(1, 'Laboratorio', 'lab1.jpg', 'Reserva un puesto de laboratorio durante dos horas', 9, 21),
(2, 'Sala de grado', 'grados1.jpg', 'Reserva una sala de grados durante dos horas', 10, 20),
(3, 'Salón de actos', 'actos1.jpg', 'Reserva un salón de actos durante dos horas', 10, 20),
(4, 'Sala de reunión', 'reuniones1.jpg', 'Reserva una sala de reunión durante dos horas', 9, 21);

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_res_reservas`
--

CREATE TABLE `ucm_aw_riu_res_reservas` (
  `id` int(11) NOT NULL,
  `nombre_ins` int(11) DEFAULT NULL,
  `nombre_usu` varchar(255) NOT NULL,
  `correo_usu` varchar(255) NOT NULL,
  `fecha_res` date NOT NULL,
  `colectivo` tinyint(1) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ucm_aw_riu_usu_usuarios`
--

CREATE TABLE `ucm_aw_riu_usu_usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido1` varchar(255) NOT NULL,
  `apellido2` varchar(255) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
