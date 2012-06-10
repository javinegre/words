var serverData = [
    {'w':'lekker','t':'nice','m':['delicious','tasty']},
    {'w':'gezondheid','t':'health','m':[]},
    {'w':'geel','t':'yellow','m':[]},
    {'w': 'gezellig', 't': 'cozy', 'm': ['sociable', 'intimate', 'homy']}
];

datashuffle = function(o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

serverData = datashuffle(serverData);