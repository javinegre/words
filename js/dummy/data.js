var serverData = [
    {'w':'lekker','t':'nice','m':['delicious','tasty']},
    {'w':'gezondheid','t':'health','m':[]},
    {'w':'geel','t':'yellow','m':[]},
    {'w': 'gezellig', 't': 'cozy', 'm': ['sociable', 'intimate', 'homy']},
    {'w': 'kip', 't': 'chicken', 'm': []},
    {'w': 'varken', 't': 'pig', 'm': []},
    {'w': 'straat', 't': 'street', 'm': []},
    {'w': 'groen', 't': 'green', 'm': []},
    {'w': 'kamer', 't': 'room', 'm': []},
    {'w': 'huis', 't': 'house', 'm': []},
    {'w': 'tafel', 't': 'table', 'm': []},
    {'w': 'stoel', 't': 'chair', 'm': []},
    {'w': 'haring', 't': 'herring', 'm': []},
    {'w': 'vader', 't': 'father', 'm': []},
    {'w': 'moeder', 't': 'mother', 'm': []},
    {'w': 'vriend', 't': 'friend', 'm': []},
    {'w': 'schoen', 't': 'shoe', 'm': []},
    {'w': 'bril', 't': 'glasses', 'm': []},
    {'w': 'keuken', 't': 'kitchen', 'm': []},
    {'w': 'badkamer', 't': 'bathroom', 'm': []}
];

datashuffle = function(o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

serverData = datashuffle(serverData);