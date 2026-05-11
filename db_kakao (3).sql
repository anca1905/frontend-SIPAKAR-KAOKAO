-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 11, 2026 at 03:37 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_kakao`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `nama_lengkap`) VALUES
(1, 'admin', '$2y$10$zxgnDEvhoa/e2aXDCF929eY2/lm5lTFYkgw2hMpdzFE.VI9mto5hu', 'Administrator');

-- --------------------------------------------------------

--
-- Table structure for table `aturan`
--

CREATE TABLE `aturan` (
  `id` int NOT NULL,
  `kode_gejala` char(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kode_penyakit` char(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bobot` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aturan`
--

INSERT INTO `aturan` (`id`, `kode_gejala`, `kode_penyakit`, `bobot`) VALUES
(1, 'G04', 'P02', 2);

-- --------------------------------------------------------

--
-- Table structure for table `gejala`
--

CREATE TABLE `gejala` (
  `kode_gejala` char(5) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_gejala` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gejala`
--

INSERT INTO `gejala` (`kode_gejala`, `nama_gejala`) VALUES
('G01', 'Buah berubah warna coklat/kehitaman'),
('G02', 'Buah membusuk dan lunak'),
('G03', 'Bercak hitam pada buah'),
('G04', 'Buah mengeluarkan cairan'),
('G05', 'Buah mengering sebelum matang'),
('G06', 'Daun menguning'),
('G07', 'Daun rontok'),
('G08', 'Ranting mengering'),
('G09', 'Garis coklat pada batang'),
('G10', 'Pertumbuhan terhambat'),
('G11', 'Batang luka/retak'),
('G12', 'Kulit batang mengelupas'),
('G13', 'Keluar cairan dari batang'),
('G14', 'Batang membusuk'),
('G15', 'Cabang mati'),
('G16', 'Bercak coklat/kehitaman pada daun'),
('G17', 'Bercak melebar'),
('G18', 'Daun mengering'),
('G19', 'Bercak hitam pada buah'),
('G20', 'Buah rontok'),
('G21', 'Lubang kecil pada buah'),
('G22', 'Biji saling menempel'),
('G23', 'Biji rusak'),
('G24', 'Buah tidak matang sempurna'),
('G25', 'Ada ulat di dalam buah'),
('G26', 'Bercak hitam kecil'),
('G27', 'Buah kering'),
('G28', 'Bercak pada daun'),
('G29', 'Pucuk mati'),
('G30', 'Buah gugur'),
('G31', 'Daun berlubang'),
('G32', 'Daun dimakan'),
('G33', 'Ada ulat'),
('G34', 'Daun tinggal tulang'),
('G35', 'Pertumbuhan terganggu'),
('G36', 'Buah berlubang besar'),
('G37', 'Buah hilang sebagian'),
('G38', 'Kulit buah rusak'),
('G39', 'Biji dimakan'),
('G40', 'Buah jatuh'),
('G41', 'Serbuk putih'),
('G42', 'Daun menguning'),
('G43', 'Daun keriting'),
('G44', 'Pertumbuhan terganggu'),
('G45', 'Ada semut'),
('G46', 'Lubang pada batang'),
('G47', 'Serbuk kayu keluar'),
('G48', 'Batang rapuh'),
('G49', 'Cabang mudah patah'),
('G50', 'Tanaman layu'),
('G51', 'Daun menguning'),
('G52', 'Ada larva di batang');

-- --------------------------------------------------------

--
-- Table structure for table `kasus`
--

CREATE TABLE `kasus` (
  `kode_kasus` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_kasus` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kode_penyakit` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tanggal_input` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus`
--

INSERT INTO `kasus` (`kode_kasus`, `nama_kasus`, `kode_penyakit`, `tanggal_input`) VALUES
('K-001', 'Kasus Busuk Buah 1', 'P01', '2026-05-06'),
('K-002', 'Kasus VSD 1', 'P02', '2026-05-06'),
('K-003', 'Kasus Kanker Batang 1', 'P03', '2026-05-06');

-- --------------------------------------------------------

--
-- Table structure for table `kasus_gejala`
--

CREATE TABLE `kasus_gejala` (
  `id` int NOT NULL,
  `kode_kasus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kode_gejala` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penyakit`
--

CREATE TABLE `penyakit` (
  `kode_penyakit` char(5) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_penyakit` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `jenis` enum('Penyakit','Hama') COLLATE utf8mb4_general_ci DEFAULT 'Penyakit',
  `solusi` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penyakit`
--

INSERT INTO `penyakit` (`kode_penyakit`, `nama_penyakit`, `jenis`, `solusi`) VALUES
('H01', 'Sed rem lorem delect', 'Hama', 'Id do eu dolore ill'),
('P01', 'Penyakit Pohon P1', 'Penyakit', 'Lakukan penanganan standar untuk penyakit P1.'),
('P02', 'VSD (Vascular Streak Dieback)', 'Penyakit', 'Pangkas cabang yang sakit.'),
('P03', 'Kanker Batang', 'Penyakit', 'Kerok bagian batang yang terserang.');

-- --------------------------------------------------------

--
-- Table structure for table `riwayat`
--

CREATE TABLE `riwayat` (
  `id` int NOT NULL,
  `tanggal` date NOT NULL,
  `nama_petani` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lokasi` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hasil_diagnosis` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nilai_cf` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riwayat`
--

INSERT INTO `riwayat` (`id`, `tanggal`, `nama_petani`, `lokasi`, `hasil_diagnosis`, `nilai_cf`) VALUES
(1, '2026-05-10', 'Jacob Sawyer', 'Corporis non qui vel', 'VSD (Vascular Streak Dieback)', '70%'),
(2, '2026-05-10', 'Jacob Sawyer', 'Corporis non qui vel', 'VSD (Vascular Streak Dieback)', '70%'),
(3, '2026-05-10', 'Rhoda Pittman', 'Et excepturi ut est ', 'Penyakit Pohon P1', '70%'),
(4, '2026-05-10', 'Rhoda Pittman', 'Et excepturi ut est ', 'Penyakit Pohon P1', '70%'),
(5, '2026-05-10', 'Cody Pugh', 'Rerum qui necessitat', 'Penyakit Pohon P1', '60%'),
(6, '2026-05-10', 'Kessie Buckley', 'Ea laborum Officiis', 'Penyakit Pohon P1', '70%'),
(7, '2026-05-10', 'Alexis Bentley', 'Aliqua Sed id excep', 'VSD (Vascular Streak Dieback)', '80%'),
(8, '2026-05-10', 'Aiko Sanders', 'Ratione sequi ea dol', 'Penyakit Pohon P1', '80%'),
(9, '2026-05-10', 'Evangeline Newton', 'Temporibus ipsum in ', 'VSD (Vascular Streak Dieback)', '80%'),
(10, '2026-05-10', 'Thane Potter', 'Enim sunt quia obca', 'Penyakit Pohon P1', '50%');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `aturan`
--
ALTER TABLE `aturan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`kode_gejala`);

--
-- Indexes for table `kasus`
--
ALTER TABLE `kasus`
  ADD PRIMARY KEY (`kode_kasus`),
  ADD KEY `kode_penyakit` (`kode_penyakit`);

--
-- Indexes for table `kasus_gejala`
--
ALTER TABLE `kasus_gejala`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kode_kasus` (`kode_kasus`),
  ADD KEY `kode_gejala` (`kode_gejala`);

--
-- Indexes for table `penyakit`
--
ALTER TABLE `penyakit`
  ADD PRIMARY KEY (`kode_penyakit`);

--
-- Indexes for table `riwayat`
--
ALTER TABLE `riwayat`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `aturan`
--
ALTER TABLE `aturan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kasus_gejala`
--
ALTER TABLE `kasus_gejala`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `riwayat`
--
ALTER TABLE `riwayat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kasus`
--
ALTER TABLE `kasus`
  ADD CONSTRAINT `kasus_ibfk_1` FOREIGN KEY (`kode_penyakit`) REFERENCES `penyakit` (`kode_penyakit`) ON DELETE CASCADE;

--
-- Constraints for table `kasus_gejala`
--
ALTER TABLE `kasus_gejala`
  ADD CONSTRAINT `kasus_gejala_ibfk_1` FOREIGN KEY (`kode_kasus`) REFERENCES `kasus` (`kode_kasus`) ON DELETE CASCADE,
  ADD CONSTRAINT `kasus_gejala_ibfk_2` FOREIGN KEY (`kode_gejala`) REFERENCES `gejala` (`kode_gejala`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
