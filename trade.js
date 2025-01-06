const { Spot } = require('@binance/connector')
const { Console } = require('console')
const apiKey = '4rohypTJjfM5ZtnlY1N2t74tk0DSccudAqxasT6CUTWcSXIBuKazAYN432mIiZyW'
const apiSecret = 'dhYTKX04IdL1PQSQhxjQVsNHq9OWvMpC8bcswEAoDC9BCPz5nqPPPBPQVFCM6RQt'
const client = new Spot(apiKey, apiSecret)


const { WebsocketStream } = require('@binance/connector')
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })
 
// define callbacks for different events
const callbacks = {
  open: () => logger.debug('Connected with Websocket server'),
  close: () => logger.debug('Disconnected with Websocket server'),
  message: data => test(data)//logger.info(data)
}
 
const websocketStreamClient = new WebsocketStream({ logger, callbacks })
websocketStreamClient.ticker('XRPUSDT', callbacks)

websocketStreamClient.bookTicker('XRPUSDT', callbacks)
var counter = 0;
var totalAsk = totalBid = 0;
var sellCounter = 0;
var scoreAsk = scoreBid = 0;
buyPrice = 0;
sellPrice = 0;
buyedPrice = 0;
var balanceUSDT = 0;
var balanceXRP = 0;
var bplusa = 0;
function test(data){
    

    var data = JSON.parse(data)
    
    if(data.e =='24hrTicker'){
        bplusa = ((parseFloat(data.b)+parseFloat(data.a))/2).toFixed(4)
        bplussell = ((parseFloat(buyPrice)+parseFloat(sellPrice))/2).toFixed(4)

    if(bplusa<buyedPrice && buyedPrice > 0){
       console.log('You should sell :/');
       console.log('Buyed price:'+buyedPrice);
       console.log('Current price:'+bplusa);
       // Get account information
       client.account().then((response) =>{
           balanceXRP = response.data.balances[206].free
           client.logger.log(balanceXRP)
           console.log('sell priceeeeeeeeeee:'+bplusa)
           client.newOrder('XRPUSDT', 'SELL', 'LIMIT', {
     price: bplusa,
     quantity: Math.floor(balanceXRP/bplusa),
     timeInForce: 'FOK'
   }).then(response => client.logger.log(response.data))
     .catch(error => client.logger.error(error))
       }).catch((error) => {
        client.logger.error(error)
        //websocketStreamClient.disconnect()
    })
   

    }else if(buyedPrice>0){
        if(bplusa>bplussell){
            console.log('Everything is going right :)'); 
            console.log('Buyed price:'+buyedPrice);
            console.log('Current price:'+bplusa);
        }else{
            console.log('You should sell :/');
            console.log('Buyed price:'+buyedPrice);
            console.log('Current price:'+bplusa);
            // Get account information
       client.account().then((response) =>{
        balanceXRP = response.data.balances[206].free
        client.logger.log(balanceXRP)

        console.log('sell priceeeeeeeeeee:'+bplusa)

        //client.logger.log(response.data)
        client.newOrder('XRPUSDT', 'SELL', 'LIMIT', {
  price: bplussell,
  quantity: Math.floor(balanceXRP/bplussell),
  timeInForce: 'FOK'
}).then(response => client.logger.log(response.data))
  .catch(error => client.logger.error(error))
    
}).catch((error) => {
    client.logger.error(error)
    //websocketStreamClient.disconnect()
})


        }
        
    }
    
        buyPrice = data.b
        sellPrice = data.a;
    }
        totalBid = totalBid + (data.b*data.B)
        totalAsk = totalAsk + (data.a*data.A)
        
       counter = counter + 1;
       if(counter==100){
           console.log('total Bid:'+totalBid+', total Ask:'+totalAsk);
           if(totalAsk>totalBid){
              sellCounter = sellCounter + 1;

           }
           if( sellCounter ==3 ){
              console.log('Time to buy!');
              sellCounter = 0;
              // Get account information
              client.account().then((response) =>{
                   balanceUSDT = response.data.balances[11].free
                  //client.logger.log(response.data)
                  client.newOrder('XRPUSDT', 'BUY', 'LIMIT', {
                    price: buyPrice,
                    quantity: Math.floor(balanceUSDT/buyPrice),
                    timeInForce: 'FOK'
                  }).then(response => client.logger.log(response.data))
                    .catch((error) => {
                        client.logger.error(error)
                        //websocketStreamClient.disconnect()
                    })
              }).catch((error) => {
                client.logger.error(error)
                //websocketStreamClient.disconnect()
            })
              
              buyedPrice = buyPrice;
              console.log('Buy price:'+buyPrice);

           }
           totalBid = 0;
           totalAsk = 0;
           counter = 0;
       }
  
}

// close websocket stream
//setTimeout(() => websocketStreamClient.disconnect(), 6000)
 

/*client.bookTicker("BTCUSDT").then(response =>
    client.logger.log(response.data)
)*/

 
/*client.bookTicker('XRPUSDT').then(response => client.logger.log(response.data))*/
/*client.account().then((response) =>{
  console.log(response.data);
  for(var i =0 ;i<529;i=i+1){
    console.log(i);
    console.log(response.data.balances[i].asset);
    if(response.data.balances[i].asset=='USDT'){
      break;
    }
  }
})*/

// Place a new order
/*client.newOrder('BNBUSDT', 'BUY', 'LIMIT', {
  price: '350',
  quantity: 1,
  timeInForce: 'GTC'
}).then(response => client.logger.log(response.data))
  .catch(error => client.logger.error(error))
*/
