import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import bnbLogo from "../assets/bnb.png"
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      dbank: null,
      balance: 0,
      dBankAddress: null,
      deposit: 0
    }
  }

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    //check if MetaMask exists
    if (typeof window.ethereum !== 'undefined') {

      const web3 = new Web3(window.ethereum)
      await window.ethereum.enable(); //connect to Metamask

      //check if account is detected, then load balance&setStates, elsepush alert
      web3.eth.getAccounts().then(accounts => {

        this.setState({
          account: accounts[0],
        });

        if (this.state.account.length > 0) {
          this.getDeposit();
          web3.eth.getBalance(accounts[0]).then(balamt => {
            this.setState({
              balance: web3.utils.fromWei(balamt)
            });
          }
          );

        }

      });


      //assign to values to variables: web3, netId, accounts
      this.setState({
        web3: web3
      });

      //in try block load contracts

      try {
        const devtokencontract = new web3.eth.Contract(Token.abi, Token.networks["97"].address);
        this.dbank = new web3.eth.Contract(dBank.abi, dBank.networks["97"].address);

      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    }

    //if MetaMask not exists push alert
    else {
      window.alert('Please install MetaMask')
    }
  }

  async getDeposit() {

    const deposit = await this.dbank.methods.getDeposit().call({ from: this.state.account });
    this.setState({
      deposit: this.state.web3.utils.fromWei(deposit)
    });

  }

  async deposit(amount) {
    //check if this.state.dbank is ok
    //in try block call dBank deposit();
    try {
      await this.dbank.methods.deposit().send({ from: this.state.account, value: amount });
      window.location.reload();

    }
    catch (e) {
      console.log('Error', e)

    }


  }




  async withdraw(e) {
    //prevent button from default click
    e.preventDefault();
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
    try {
      await this.dbank.methods.withdraw().send({ from: this.state.account });
      window.location.reload();

    }
    catch (e) {
      console.log('Error', e)

    }

  }



  render() {

    if (this.state.account.length === 0) {
      return false;
    }
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <img src={bnbLogo} className="App-logo" alt="logo" height="32" />
          <b>DeFi App</b>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to BNB TRADE <img src={bnbLogo} style={{ height: "40px" }} alt="bnb logo" /></h1>
          <h2>{`Your ID: ${this.state.account}`}</h2>
          <br></br>
          <h3>{`Balance: ${this.state.balance}`}</h3>
          <br></br>
          <h3>{`Deposit: ${this.state.deposit}`}</h3>

          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br></br>
                      How much do you want to deposit?
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount = this.depositAmount.value
                        amount = amount * 10 ** 18 //convert to wei
                        this.deposit(amount)
                      }}>
                        <div className='form-group mr-sm-2'>
                          <br></br>
                          <input
                            id='depositAmount'
                            step="0.01"
                            type='number'
                            ref={(input) => { this.depositAmount = input }}
                            className="form-control form-control-md"
                            placeholder='amount...'
                            required />
                        </div>
                        <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                      </form>

                    </div>
                  </Tab>
                  <Tab eventKey="withdraw" title="Withdraw">
                    <br></br>
                    Do you want to withdraw + take interest?
                    <br></br>
                    <br></br>
                    <div>
                      <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                    </div>
                  </Tab>
                </Tabs>
              </div>

            </main>
          </div>
        </div>
      </div >
    );
  }
}

export default App;