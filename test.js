process.argv[2]='inputData.txt'
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;
sinon.spy(console, 'log');

const functionmodule = require('./functions.js')
sinon.spy(functionmodule);
const {main,takeInput,data}=functionmodule

describe('', () => { 
  afterEach(()=>{
    Object.keys(functionmodule).forEach(function (key) {
        functionmodule[key].resetHistory()
    });
    console.log.resetHistory()
  })
  describe('main', () => { 
    it("should be a function", () => { 
        expect(main).to.be.a("function")
     });
    it("should be a function", () => {
      const {COMMANDS}=require('./constants')
        main(['Train'])
          main(COMMANDS)
          takeInput('sample_input/input1.txt')
        const {stations}=data()
        expect(stations.CENTRAL.amount).to.equal(457)
        expect(stations.AIRPORT.amount).to.equal(252)
     });
  })
})
