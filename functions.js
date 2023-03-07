const fs = require("fs")
let balance={}
const {CENTRAL,AIRPORT} = require('./constants');
let price={ ADULT: 200 , SENIOR_CITIZEN: 100 , KID: 50 }
let stations={
               CENTRAL:{
                        amount:0 ,
                        discount:0 ,
                        passengers:{ ADULT:0, SENIOR_CITIZEN:0, KID:0 },
                        cards:{ }
                     },
               AIRPORT:{
                        amount:0 ,
                        discount:0 ,
                        passengers:{ ADULT:0, SENIOR_CITIZEN:0, KID:0 },
                        cards:{ }
                     } 
            }
// let previousStation= CENTRAL
// let stationChanged= 0

const calculate = (cardName,type,station) => { 
    let lastStation= (station===CENTRAL)?AIRPORT:CENTRAL
    let returnJourney= stations[lastStation]["cards"][cardName].includes(type)
    let charge = returnJourney ? (price[type]/2) : price[type]
    if(returnJourney){
        stations[station].discount+=charge
        const index=stations[lastStation]["cards"][cardName].findIndex(e=>e===type)
        stations[lastStation]["cards"][cardName].splice(index,1)
    }
    if(balance[cardName]<charge){
        stations[station].amount+=(charge-balance[cardName])*0.02
        balance[cardName]=0
    }else{
        balance[cardName]-=charge
    }
    !returnJourney && stations[station]["cards"][cardName].push(type) 
    stations[station]["passengers"][type]++
    stations[station].amount+= charge
}

const checkIn = (cardName,type,station) => { 
    if(balance[cardName]=== undefined){
        console.log(`INVALID_CARD_NAME - ${cardName}`)
    }else{
        // if(previousStation!==station){ stationChanged++ }
        // if(stationChanged===2){
        //     Object.keys(stations[station].cards).forEach((i) => stations[station].cards[i] = [])
        //     stationChanged--
        // }
       calculate(cardName,type,station) 
        // previousStation=station
    }
 }

 function sortAndLog(obj,station){ 
     let sortedList = []
     sortedList = Object.entries(obj).sort((a,b)=>{
         if(b[1] > a[1]) return 1;
         else if(b[1] < a[1]) return -1;
         else {
             if(a[0] > b[0]) return 1;
             else if(a[0] < b[0]) return -1;
             else return 0
         }
     })
     console.log(`TOTAL_COLLECTION ${station}`,stations[station].amount,stations[station].discount);
     console.log('PASSENGER_TYPE_SUMMARY');
     sortedList.filter(el=>{if(el[1]!==0)console.log(el[0],el[1])})
 }      
    
const printSummary = () => { 
    sortAndLog(stations.CENTRAL.passengers,CENTRAL);
    sortAndLog(stations.AIRPORT.passengers,AIRPORT);
}

const main = (commands) => { 
    for (i = 0; i < commands.length; i++) {
        if (commands) {
            let params = commands[i].split(' ')
            switch (params[0]) {
                case 'BALANCE':balance[params[1]]=parseInt(params[2]);
                               stations["CENTRAL"]["cards"][params[1]]=[];
                               stations["AIRPORT"]["cards"][params[1]]=[];
                               break;
                case 'CHECK_IN':checkIn(params[1].trim(),params[2].trim(),params[3].trim());
                break;
                case 'PRINT_SUMMARY':printSummary();
                break;
                default:console.log(`INVALID_INPUT_=${params}`);return;
            }
        }
    }
}

const takeInput = (filename) => { 
    fs.readFile(filename, "utf8", (err, data) => { 
        if (err) throw err
        commands = data.toString().split("\n")   
        main(commands)  
    })
 }

const data = () => { return {balance,stations} }
module.exports={takeInput,main,checkIn,printSummary,data}