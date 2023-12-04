-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2023 a las 19:49:05
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
-- Base de datos: `aw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `destino_id` int(11) DEFAULT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `comentario` text NOT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `destino_id`, `nombre_usuario`, `comentario`, `fecha_comentario`) VALUES
(2, 3, 'a', 'pepepooooo', '2023-12-01 18:20:05'),
(3, 3, 'a', 'SASASS', '2023-12-01 18:21:38'),
(4, 3, 'a', 'DDDD', '2023-12-01 18:21:48'),
(5, 2, 'a', 'Buen bosque', '2023-12-01 18:23:11'),
(6, 2, 'a', 'a', '2023-12-01 18:24:45'),
(7, 6, 'a', 'Hay ratas en los baños', '2023-12-01 18:25:43'),
(8, 6, 'a', 'Me pegaron la mochila al techo', '2023-12-01 18:27:15'),
(9, 6, 'a', 'Me pegaron la mochila al techo', '2023-12-01 18:29:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destinos`
--

CREATE TABLE `destinos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `destinos`
--

INSERT INTO `destinos` (`id`, `nombre`, `descripcion`, `imagen`, `precio`) VALUES
(1, 'Buena Village', 'Buena Village es una aldea situada en las afueras de la región de Fittoa. Es el lugar ideal si quieres alejarte de las grandes ciudades y disfrutar del campo.', 'buenavillage1.png', 245.00),
(2, 'Great Forest', 'Great Forest es un gran bosque situado al este del continente de Millis. Es el hogar de los hombre bestia y el sitio perfecto si buscas perderte en la naturaleza.', 'greatforest1.png', 475.00),
(3, 'Millishion', 'La ciudad sagrada de Millishion es la más importante de todo el continente de Millis. Esta majestuosa ciudad alberga los monumentos más antiguos del continente.', 'milis1.png', 1395.00),
(4, 'Citadel de Roa', 'Roa es la ciudad más grande de la región de Fittoa y una de las más grandes del Reino de Asura. Podrás encontrar todo tipo de productos en sus mercados.', 'roa1.png', 777.77),
(5, 'Rikarisu', 'Rikarisu tiene unas murallas naturales formadas por un cráter y el castillo de la emperatriz Kirishika en el centro. Antiguamente fue de fortaleza, pero ahora es un lugar con gran atractivo para los amantes de la historia.', 'rikarisu1.png', 333.33),
(6, 'Universidad Mágica de Ranoa', 'Se encuentra en la ciudad mágica de Sharia y es la universidad más grande del mundo. Explora el campus y las instalaciones de este lugar.', 'ranoa1.png', 888.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL,
  `nombre_destino` varchar(50) NOT NULL,
  `nombre_imagen` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id`, `nombre_destino`, `nombre_imagen`) VALUES
(1, 'Buena Village', 'buenavillage1.png'),
(2, 'Buena Village', 'buenavillage2.png'),
(3, 'Buena Village', 'buenavillage3.png'),
(4, 'Great Forest', 'greatforest1.png'),
(5, 'Great Forest', 'greatforest2.png'),
(6, 'Great Forest', 'greatforest3.png'),
(7, 'Millishion', 'milis1.png'),
(8, 'Millishion', 'milis2.png'),
(9, 'Millishion', 'milis3.png'),
(10, 'Citadel de Roa', 'roa1.png'),
(11, 'Citadel de Roa', 'roa2.png'),
(12, 'Citadel de Roa', 'roa3.png'),
(13, 'Rikarisu', 'rikarisu1.png'),
(14, 'Rikarisu', 'rikarisu2.png'),
(15, 'Rikarisu', 'rikarisu3.png'),
(16, 'Universidad Mágica de Ranoa', 'ranoa1.png'),
(17, 'Universidad Mágica de Ranoa', 'ranoa2.png'),
(18, 'Universidad Mágica de Ranoa', 'ranoa3.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `destino_id` int(11) DEFAULT NULL,
  `nombre_cliente` varchar(255) NOT NULL,
  `correo_cliente` varchar(255) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `num_entradas` int(11) DEFAULT NULL,
  `tamano_maleta` varchar(50) DEFAULT NULL,
  `precio_total` decimal(10,2) DEFAULT NULL,
  `clase_tp` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `destino_id`, `nombre_cliente`, `correo_cliente`, `fecha_reserva`, `num_entradas`, `tamano_maleta`, `precio_total`, `clase_tp`) VALUES
(4, 6, 'a', 'a@gmail.com', '2222-02-22', 234, 'maleta_grande', 207792.00, 'economico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('4s7v7S4x-fv4bFwlz8QYTnag9jA6gaE8', 1701542925, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"a\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`) VALUES
(1, 'jose', 'elpepe@gamil.com', 'Fuaiay'),
(0, 'a', 'a@gmail.com', 'a');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destino_id` (`destino_id`);

--
-- Indices de la tabla `destinos`
--
ALTER TABLE `destinos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destino_id` (`destino_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `destinos`
--
ALTER TABLE `destinos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`destino_id`) REFERENCES `destinos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
