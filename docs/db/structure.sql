
--
-- Table structure for table `words`
--

CREATE TABLE IF NOT EXISTS `words` (
  `wordID` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(32) NOT NULL,
  `translation` varchar(32) NOT NULL,
  `base_meaning` varchar(128) DEFAULT NULL,
  `translation_meaning` varchar(128) DEFAULT NULL,
  `category` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`wordID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;