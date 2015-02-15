var btc = new WebSocket('wss://ws.blockchain.info/inv');
var dataArray = [];
var index = 0;
var subscribe = '{"op":"unconfirmed_sub"}';

btc.onopen = function(event){
  btc.send(subscribe);
}

var getCountry = function(ip, transaction, callback){
  var urlI = "http://ipinfo.io/" + ip;
  var countryIP = null;
  // $.get(url, function(response) {
  //   countryIP = '' + response.country + '';
  // }, "jsonp");
  $.ajax({
        url: urlI,
        type: 'get',
        dataType: 'jsonp',
        async: false,
        success: function(data) {
            callback(data.country, transaction/100000000);
        }
     });
};

var addTransaction = function(country, transaction){
  dataArray.push({value: transaction, country: country});
  console.log(country + "  " + "amount " + transaction + " BTC")
};

btc.onmessage = function(event){
  var response = JSON.parse(event.data);
  var amount = 0;
  for (var i = 0; i < response.x.out.length; i++){
   amount += response.x.out[i].value;
  }
  var ip = response.x.relayed_by
  if (ip !== "127.0.0.1"){
     setTimeout(function(){getCountry(ip, amount, addTransaction)},10000);
   }
};

setInterval(d3.select('body').selectAll('circle').data(dataArray).enter().append('circle').attr('r', function(d){d.value * 100}).style('fill', 'blue'),1000);


