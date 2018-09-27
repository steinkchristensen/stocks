import React, { Component, Table, TableBody, TableCell, TableHead, TableRow, Paper} from 'react';
import logo from './logo.svg';
import './App.css';


//For robinhood integration use this https://github.com/aurbano/robinhood-node#positionscallback

class App extends Component {
  constructor() {
    super();
    this.state={
      stock: [
        { id: 0, ticker: "ARKK", price: 0, isLoaded: false, error: null, shares: 1, category: 'Tech' }, { id: 1, ticker: "VT", price: 0, isLoaded: false, error: null, shares: 2 }, { id: 2, ticker: "VNQ", price: 0, isLoaded: false, error: null, shares: 1 }, { id: 3, ticker: "PDBC", price: 0, isLoaded: false, error: null, shares: 1 }
      ],
      targetAllocation: {'Tech':0.20, 'Commodities':0.8},
      total: 1 
    }
  }
  async componentDidMount(){
    let tickerArray="";
    this.state.stock.map((stock, i) => {
      tickerArray+=stock.ticker+",";
    })
    this.getTickerData(tickerArray)
    
  }
  updateTotal(){
    let portfolioTotal = 0;
    this.state.stock.map((stock, i) => {
      
      portfolioTotal = portfolioTotal + parseInt(stock.price * stock.shares);
      console.log("price: "+stock.price)
    });
    this.setState({
      total: portfolioTotal
    })
  }
  getTickerData(symbol) {
    const apikey = 'PCALO1248Z695WYR';
    fetch(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbol}&apikey=${apikey}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('working...')
        console.log(responseJson);
        const stock = this.state.stock.slice();
        for (let i = 0; i < responseJson['Stock Quotes'].length; i++){
          stock[i].price = responseJson['Stock Quotes'][i]["2. price"]
          stock[i].isLoaded = true;
        }
        
        this.setState({
          stock: stock
        }, () => {
          console.log(this.state.stock);
        })
        this.updateTotal();
      })
      .catch((error) => {
        console.error("error: " + error);
        return false;
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
        {
          
            this.state.stock.map((stock, i ) => (
              <StockTicker key={i} ticker={stock.ticker} price={stock.price} isLoaded={stock.isLoaded} shares={stock.shares} total={this.state.total} category={stock.category}></StockTicker>
            ))
        }
        </div>
      </div>
    );
  }
}

class StockTicker extends Component{
  constructor(props) {
    super(props); 
  }
  
  render(){
    if(this.props.isLoaded===false){
      return (
        <div className="preloader-wrapper small active">
          <div className="spinner-layer spinner-green-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      );
    }else{
      let category;
      if(!this.props.category){
        category='Not Found';
      }else{
        category=this.props.category
      }
      return (
        
          <div className="col s12 m6">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">{this.props.ticker}</span>
                <p>
                  ${this.props.price}
                </p>
                <p>
                  Shares: {this.props.shares}
                </p>
                <p>
                  Total: {this.props.shares * this.props.price}
                </p>
                <p>
                  Total Portfolio: {this.props.total}
                </p>
                <p>
                  Percent of Portfolio: {((this.props.shares * this.props.price / this.props.total)*100).toFixed(2)}%
                </p>
                <p>
                  Allocation Cat: { category} 
                </p>
              </div>
              <div className="card-action">
                <a href="#" onClick={() => { this.getTickerData(this.state.tickerSymbol)}}>Refresh</a>
              </div>
            </div>
          </div>
      );
    }
    }
    
}

export default App;
