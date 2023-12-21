-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: spotify
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `backsound`
--

DROP TABLE IF EXISTS `backsound`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backsound` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` varchar(100) NOT NULL,
  `size` int(11) NOT NULL,
  `jadwal` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backsound`
--

LOCK TABLES `backsound` WRITE;
/*!40000 ALTER TABLE `backsound` DISABLE KEYS */;
INSERT INTO `backsound` VALUES (1,'LAGU AMONG TAMU.mp3',2033926,NULL),(2,'BACKSOUND HALLOWEEN KARNIVOR.mp3',28907311,NULL),(3,'LAGU ULANG TAHUN MUSIC BOX.mp3',611193,NULL),(4,'suara-ayam-jago.mp3',47393,NULL),(5,'suara-burung-hantu.mp3',55457,NULL),(6,'suara-kuda.ogg',13889,NULL);
/*!40000 ALTER TABLE `backsound` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ci_sessions`
--

DROP TABLE IF EXISTS `ci_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `data` blob NOT NULL,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ci_sessions`
--

LOCK TABLES `ci_sessions` WRITE;
/*!40000 ALTER TABLE `ci_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ci_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iklan`
--

DROP TABLE IF EXISTS `iklan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iklan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` varchar(100) NOT NULL,
  `size` int(11) NOT NULL,
  `jadwal` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iklan`
--

LOCK TABLES `iklan` WRITE;
/*!40000 ALTER TABLE `iklan` DISABLE KEYS */;
INSERT INTO `iklan` VALUES (1,'Birthday.mp3',1599657,NULL),(2,'Dua-Sejoli-Saling-Masker-dan-Vaksin.mp3',962697,NULL);
/*!40000 ALTER TABLE `iklan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lokasi`
--

DROP TABLE IF EXISTS `lokasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lokasi` (
  `id` varchar(10) NOT NULL,
  `lokasi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lokasi`
--

LOCK TABLES `lokasi` WRITE;
/*!40000 ALTER TABLE `lokasi` DISABLE KEYS */;
INSERT INTO `lokasi` VALUES ('1','AMBARAWA'),('10','BALIGE'),('100','KENDAL'),('101','KENDARI'),('102','KERTOSONO'),('103','KETAPANG'),('104','KISARAN'),('105','KLATEN'),('106','KOLAKA'),('107','KOTA BARU PULAU LAUT'),('108','KOTA BUMI'),('109','KOTA JANTHO'),('11','BALIKPAPAN'),('110','KOTAMOBAGU'),('111','KUALA KAPUAS'),('112','KUALA KURUN'),('113','KUALA PEMBUANG'),('114','KUALA TUNGKAL'),('115','KUDUS'),('116','KUNINGAN'),('117','KUPANG'),('118','KUTACANE'),('119','KUTOARJO'),('12','BANDA ACEH'),('120','LABUHAN'),('121','LAHAT'),('122','LAMONGAN'),('123','LANGSA'),('124','LARANTUKA'),('125','LAWANG'),('126','LHOSEUMAWE'),('127','LIMBOTO'),('128','LUBUK BASUNG'),('129','LUBUK LINGGAU'),('13','BANDARLAMPUNG'),('130','LUBUK PAKAM'),('131','LUBUK SIKAPING'),('132','LUMAJANG'),('133','LUWUK'),('134','MADIUN'),('135','MAGELANG'),('136','MAGETAN'),('137','MAJALENGKA'),('138','MAJENE'),('139','MAKALE'),('14','BANDUNG'),('140','MAKASSAR'),('141','MALANG'),('142','MAMUJU'),('143','MANNA'),('144','MANOKWARI'),('145','MARABAHAN'),('146','MAROS'),('147','MARTAPURA KALSEL'),('148','MASOHI'),('149','MATARAM'),('15','BANGKALAN'),('150','MAUMERE'),('151','MEDAN'),('152','MEMPAWAH'),('153','MENADO'),('154','MENTOK'),('155','MERAUKE'),('156','METRO'),('157','MEULABOH'),('158','MOJOKERTO'),('159','MUARA BULIAN'),('16','BANGKINANG'),('160','MUARA BUNGO'),('161','MUARA ENIM'),('162','MUARA TEWEH'),('163','MUARO SIJUNJUNG'),('164','MUNTILAN'),('165','NABIRE'),('166','NEGARA'),('167','NGANJUK'),('168','NGAWI'),('169','NUNUKAN'),('17','BANGKO'),('170','PACITAN'),('171','PADANG'),('172','PADANG PANJANG'),('173','PADANG SIDEMPUAN'),('174','PAGARALAM'),('175','PAINAN'),('176','PALANGKARAYA'),('177','PALEMBANG'),('178','PALOPO'),('179','PALU'),('18','BANGLI'),('180','PAMEKASAN'),('181','PANDEGLANG'),('182','PANGKA'),('183','PANGKAJENE SIDENRENG'),('184','PANGKALAN BUN'),('185','PANGKALPINANG'),('186','PANYABUNGAN'),('187','PAR'),('188','PAREPARE'),('189','PARIAMAN'),('19','BANJAR'),('190','PASURUAN'),('191','PATI'),('192','PAYAKUMBUH'),('193','PEKALONGAN'),('194','PEKAN BARU'),('195','PEMALANG'),('196','PEMATANGSIANTAR'),('197','PENDOPO'),('198','PINRANG'),('199','PLEIHARI'),('2','AMBON'),('20','BANJAR BARU'),('200','POLEWALI'),('201','PONDOK GEDE'),('202','PONOROGO'),('203','PONTIANAK'),('204','POSO'),('205','PRABUMULIH'),('206','PRAYA'),('207','PROBOLINGGO'),('208','PURBALINGGA'),('209','PURUKCAHU'),('21','BANJARMASIN'),('210','PURWAKARTA'),('211','PURWODADIGROBOGAN'),('212','PURWOKERTO'),('213','PURWOREJO'),('214','PUTUSSIBAU'),('215','RAHA'),('216','RANGKASBITUNG'),('217','RANTAU'),('218','RANTAUPRAPAT'),('219','RANTEPAO'),('22','BANJARNEGARA'),('220','REMBANG'),('221','RENGAT'),('222','RUTENG'),('223','SABANG'),('224','SALATIGA'),('225','SAMARINDA'),('226','SAMPANG'),('227','SAMPIT'),('228','SANGGAU'),('229','SAWAHLUNTO'),('23','BANTAENG'),('230','SEKAYU'),('231','SELONG'),('232','SEMARANG'),('233','SENGKANG'),('234','SERANG'),('235','SERUI'),('236','SIBOLGA'),('237','SIDIKALANG'),('238','SIDOARJO'),('239','SIGLI'),('24','BANTEN'),('240','SINGAPARNA'),('241','SINGARAJA'),('242','SINGKAWANG'),('243','SINJAI'),('244','SINTANG'),('245','SITUBONDO'),('246','SLAWI'),('247','SLEMAN'),('248','SOASIU'),('249','SOE'),('25','BANTUL'),('250','SOLO'),('251','SOLOK'),('252','SOREANG'),('253','SORONG'),('254','SRAGEN'),('255','STABAT'),('256','SUBANG'),('257','SUKABUMI'),('258','SUKOHARJO'),('259','SUMBAWA BESAR'),('26','BANYUWANGI'),('260','SUMEDANG'),('261','SUMENEP'),('262','SUNGAI LIAT'),('263','SUNGAI PENUH'),('264','SUNGGUMINASA'),('265','SURABAYA'),('266','SURAKARTA'),('267','TABANAN'),('268','TAHUNA'),('269','TAKALAR'),('27','BARABAI'),('270','TAKENGON'),('271','TAMIANG LAYANG'),('272','TANAH GROGOT'),('273','TANGERANG'),('274','TANJUNG BALAI'),('275','TANJUNG ENIM'),('276','TANJUNG PANDAN'),('277','TANJUNG PINANG'),('278','TANJUNG REDEP'),('279','TANJUNG SELOR'),('28','BARITO'),('280','TAPAK TUAN'),('281','TARAKAN'),('282','TARUTUNG'),('283','TASIKMALAYA'),('284','TEBING TINGGI'),('285','TEGAL'),('286','TEMANGGUNG'),('287','TEMBILAHAN'),('288','TENGGARONG'),('289','TERNATE'),('29','BARRU'),('290','TOLITOLI'),('291','TONDANO'),('292','TRENGGALEK'),('293','TUAL'),('294','TUBAN'),('295','TULUNG AGUNG'),('296','UJUNG BERUNG'),('297','UNGARAN'),('298','WAIKABUBAK'),('299','WAINGAPU'),('3','AMLAPURA'),('30','BATAM'),('300','WAMENA'),('301','WATAMPONE'),('302','WATANSOPPENG'),('303','WATES'),('304','WONOGIRI'),('305','WONOSARI'),('306','WONOSOBO'),('307','YOGYAKARTA'),('308','JAKARTA PUSAT'),('309','JAKARTA BARAT'),('31','BATANG'),('310','JAKARTA SELATAN'),('311','JAKARTA TIMUR'),('312','JAKARTA UTARA'),('313','SAMBAS KALBAR'),('314','MASAMBA SULSEL'),('315','BULA SBT MALUKU'),('316','BAHAUR KALTENG'),('32','BATU'),('33','BATURAJA'),('34','BATUSANGKAR'),('35','BAUBAU'),('36','BEKASI'),('37','BENGKALIS'),('38','BENGKULU'),('39','BENTENG'),('4','AMUNTAI'),('40','BIAK'),('41','BIMA'),('42','BINJAI'),('43','BIREUEN'),('44','BITUNG'),('45','BLITAR'),('46','BLORA'),('47','BOGOR'),('48','BOJONEGORO'),('49','BONDOWOSO'),('5','ARGAMAKMUR'),('50','BONTANG'),('51','BOYOLALI'),('52','BREBES'),('53','BUKIT TINGGI'),('54','BULUKUMBA'),('55','BUNTOK'),('56','CEPU'),('57','CIAMIS'),('58','CIANJUR'),('59','CIBINONG'),('6','ATAMBUA'),('60','CILACAP'),('61','CILEGON'),('62','CIMAHI'),('63','CIREBON'),('64','CURUP'),('65','DEMAK'),('66','DENPASAR'),('67','DEPOK'),('68','DILI'),('69','DOMPU'),('7','BABO'),('70','DONGGALA'),('71','DUMAI'),('72','ENDE'),('73','ENGGANO'),('74','ENREKANG'),('75','FAKFAK'),('76','GARUT'),('77','GIANYAR'),('78','GOMBONG'),('79','GORONTALO'),('8','BAGAN SIAPIAPI'),('80','GRESIK'),('81','GUNUNG SITOLI'),('82','INDRAMAYU'),('83','JAMBI'),('84','JAYAPURA'),('85','JEMBER'),('86','JENEPONTO'),('87','JEPARA'),('88','JOMBANG'),('89','KABANJAHE'),('9','BAJAWA'),('90','KALABAHI'),('91','KALIANDA'),('92','KANDANGAN'),('93','KARANGANYAR'),('94','KARAWANG'),('95','KASUNGAN'),('96','KAYUAGUNG'),('97','KEBUMEN'),('98','KEDIRI'),('99','KEFAMENANU');
/*!40000 ALTER TABLE `lokasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (3,'2022-07-08-084127','App\\Database\\Migrations\\CreateCiSessionsTable','default','App',1657590260,1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_app` varchar(100) DEFAULT NULL,
  `kota` int(11) DEFAULT 1219,
  `suara_adzan` int(1) DEFAULT 1 COMMENT '0: Non Aktif, 1: Aktif',
  `jeda_adzan` int(11) DEFAULT 2,
  `jeda_iklan` int(11) DEFAULT 1,
  `cek_info` int(1) DEFAULT 1 COMMENT '0: Non Aktif, 1: Aktif',
  `pencarian` int(1) DEFAULT 0 COMMENT '0: Non Aktif, 1: Aktif',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `setting_kota_IDX` (`kota`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'Spotify Music By MIS',14,1,2,1,1,1,'2022-12-22 18:47:34','2023-12-21 09:22:43',NULL);
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `photo` varchar(50) NOT NULL DEFAULT 'photo.jpg',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','adminmis@gmail.com','$2y$10$QsXR8YQtPGicuoUNP5X8beIIvVaCd8ZfuOI4vHOKFDcdh6Ftab8eu','Admin','photo.jpg','2022-02-01 22:43:02','2022-03-07 19:34:45','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'spotify'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-21 10:21:52
