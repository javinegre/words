
import re

# dictionary file must be in the same folder
fileName = ''
dictFile = open(fileName, 'r')

words = []
tabChar = chr(9)

for line in dictFile:

  wordStruct = ['', [], '', [], '']
  lineSplit = line.split(tabChar)

  enWords = lineSplit[0].split(';')
  # wordStruct[0] = 'nice'
  wordStruct[0] = enWords.pop(0).strip().replace("'", "\\'")
  # wordStruct[1] = ['nice', 'pretty']
  for en in enWords:
    wordStruct[1].append(en.strip().replace("'", "\\'")) 

  nlWords = lineSplit[1].split(';')
  # wordStruct[2] = 'lekker'
  wordStruct[2] = nlWords.pop(0).strip().replace("'", "\\'")
  # wordStruct[3] = []
  for nl in nlWords:
    wordStruct[3].append(nl.strip().replace("'", "\\'"))

  # wordStruct[4] = 'adjective'
  wordStruct[4] = lineSplit[2].strip().replace("'", "\\'")

  # only allows lowercase words without spaces
  if (re.match("^[a-z]*$", wordStruct[2]) != None):
    words.append(wordStruct)

dictFile.close()

queryTpl = "INSERT INTO words (`word`,`translation`,`base_meaning`,`translation_meaning`,`category`) VALUES ('%s', '%s', '%s', '%s', '%s');"
for word in words:

  values = (word[2], word[0], ';'.join(word[3]), ';'.join(word[1]), word[4])

  print queryTpl % values
