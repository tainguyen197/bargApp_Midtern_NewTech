-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2018 at 09:11 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dectory`
--

-- --------------------------------------------------------

--
-- Table structure for table `vietnamesejapanese`
--

CREATE TABLE `vietnamesejapanese` (
  `id` int(11) NOT NULL,
  `vietnamese` text CHARACTER SET utf8 NOT NULL,
  `japanese` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vietnamesejapanese`
--

INSERT INTO `vietnamesejapanese` (`id`, `vietnamese`, `japanese`) VALUES
(1, 'CHÁN', 'AH'),
(2, 'đi', 'iku'),
(3, 'về', 'kaeru'),
(4, 'chào buổi sáng', 'ohaiyo'),
(6, 'chào buổi trưa', 'konnichiwa'),
(7, 'chào buổi tối', 'konbanwa'),
(5, 'đến', 'kiku'),
(8, 'ngôi nhà', 'uchi'),
(9, 'con mèo', 'neko'),
(10, 'Việt Nam', 'betonamu');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
