import React from "react";
import Web3 from "web3";
import Navigation from "./Navbar";
import Home from "./Home";
import Applications from "./Applications";
import Investors from "./Investors";
import About from "./About";
import Claims from "./Claims";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends React.Component {

    state = { 
      account                         : null,
      underlyingContract              : null,
      applicationSuccess              : false,
      applicationDetails              : {},
      pendingApplicationsForInvestor  : {},
      pendingClaimsForInvestor        : {},
      claimSuccess                    : false,
    }

    componentDidMount() {
        /** Initialize the contract. */
        if( window.ethereum){
            const provider = new Web3( window.ethereum );
            const contract = new provider.eth.Contract( CONTRACT_ABI, CONTRACT_ADDRESS );
            this.setState( { underlyingContract : contract } );
        }
        else{
            alert( 'Install Metamask to continue.');
        }
    }

    connectWallet = async () => {
        /** Connects metamask wallet */

        //Metamask injects a window.ethereum object; if this is detected then it should be possible to connect to a chain via Metamask
        if( window.ethereum ){

            //accounts available (connected) to the provider (Metamask)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            var prevStateApplications = this.state.pendingApplicationsForInvestor;
            prevStateApplications[account] = [];

            var prevStateClaims = this.state.pendingClaimsForInvestor;
            prevStateClaims[account] = [];
            
            this.setState( { account });
            this.setState( { pendingApplicationsForInvestor : prevStateApplications })
            this.setState( { pendingClaimsForInvestor : prevStateClaims })

            //the provider emits a 'chainChanged' when connecting to a new chain
            window.ethereum.on("chainChanged", (chainId) => {
                window.location.reload();
            });

            //the provider emits 'accountsChanged' if the accounts returned from the provider (eth_requestAccounts) change.
            window.ethereum.on('accountsChanged', async (_accounts) => {
                await this.connectWallet();
                this.setState( { applicationSuccess : false } );
            });

        }
        else{
            alert('Install metamask to continue.');
        }
    }

    handleApplicationSubmit = async (e) => {
        e.preventDefault();
        const contractAddress = e.target[0].value;
        const insuranceAmount = Number(e.target[1].value);
        if( contractAddress.length != 42 )alert( "Invalid address.");
        else if( isNaN(insuranceAmount))alert("Insurance Amount: Enter a valid number.");
        else{
            console.log([contractAddress, insuranceAmount]);
            const contract = this.state.underlyingContract;
            try{
                const tokenAmount = await contract.methods.tokenAmount().call();
                const applied = await contract.methods.applyForInsurance( contractAddress, insuranceAmount).send( {value : tokenAmount, from  : this.state.account });
                console.log(applied);
                this.setState( { applicationSuccess : true } );
            }
            catch( err ){
                this.setState( { applicationSuccess : false } );
                console.log("Exception Occurred");
                console.log(err);
                alert("Error in application");
            }
        }
    }

    handleClaimSubmit = async (e) => {
        e.preventDefault();
        const contractAddress = e.target[0].value;
        if( contractAddress.length != 42 )alert( "Invalid address.");
        else{
            console.log(contractAddress);
            const contract = this.state.underlyingContract;
            try{
                const tokenAmount = await contract.methods.tokenAmount().call();
                const claim       = await contract.methods.registerClaim( contractAddress ).send( {value : tokenAmount, from  : this.state.account });
                console.log(claim);
                this.setState( { claimSuccess : true } );
            }
            catch( err ){
                this.setState( { claimSuccess : false } );
                console.log("Exception Occurred");
                console.log(err);
                alert("Error in raising claim");
            }
        }
    }

    handleApplicationDetailsQuery = async (element) => {
        element.preventDefault();
        const contractAddress = element.target[0].value;
        if( contractAddress.length != 42 )alert( "Invalid address.");
        else{
            console.log(contractAddress);
            const contract = this.state.underlyingContract;
            const isApplicant   = await contract.methods.applicantContracts( contractAddress ).call(); 
            const isRegistered  = await contract.methods.registeredContracts( contractAddress ).call();
            const nominee       = await contract.methods.registeredContractToNomineeMap( contractAddress ).call();
            const sumInsured    = await contract.methods.registeredContractToSumInsuredMap( contractAddress ).call();  
            const premium       = await contract.methods.registeredContractToPremiumMap( contractAddress ).call();
            
            var registrationStatus = "";
            if( isRegistered )registrationStatus = "Sucess";
            else if( isApplicant )registrationStatus = "Pending";
            else registrationStatus = "Unavailabe";

            const details = {   "Contract Address"      : contractAddress,
                                "Registration Status"   : registrationStatus,
                                "Nominee"               : nominee,
                                "Sum Insured"           : sumInsured,
                                "Premium"               : premium
                    };
            this.setState( { applicationDetails : details })
            console.log( details )
        }
    }

    handleInvestorApplicationSubmit = async (e) => {
        e.preventDefault();
        const contract = this.state.underlyingContract;
        const minInvestableAmount = await contract.methods.minInvestableAmount().call();
        const investment = await contract.methods.investInPool().send( { value : minInvestableAmount, from : this.state.account } );
        console.log(investment);
    }

    handlePendingApplicationsQuery = async (e) => {
        e.preventDefault();
        const contract = this.state.underlyingContract;
        const _activeInvestors = await contract.methods.activeInvestors().call(); 
        var thisAccountIsInvestor = false;
        for( var i=0; i<_activeInvestors.length; i++){
            if(_activeInvestors[i].toLowerCase() == this.state.account.toLowerCase()){
                thisAccountIsInvestor=true;
                break;
            }
        }
        if( thisAccountIsInvestor ){
            const votedApplications = await contract.methods.votedApplicationsForInvestor( this.state.account ).call();
            const pendingApplications = await contract.methods.pendingApplications().call();

            const pendingApplicationsForCurInvestor = pendingApplications.filter( (x) => {
                return !votedApplications.includes(x);
            });
            var prevState = this.state.pendingApplicationsForInvestor;
            prevState[this.state.account] = pendingApplicationsForCurInvestor

            this.setState( { pendingApplicationsForInvestor : prevState });
        }
        else{
            alert('Must be an investor to continue');
        }
    }

    handlePendingClaimsQuery = async (e) => {
        e.preventDefault();
        const contract = this.state.underlyingContract;
        const _activeInvestors = await contract.methods.activeInvestors().call(); 
        var thisAccountIsInvestor = false;
        for( var i=0; i<_activeInvestors.length; i++){
            if(_activeInvestors[i].toLowerCase() == this.state.account.toLowerCase()){
                thisAccountIsInvestor=true;
                break;
            }
        }
        if( thisAccountIsInvestor ){
            const votedClaims   = await contract.methods.votedClaimsForInvestor( this.state.account ).call();
            const pendingClaims = await contract.methods.pendingClaims().call();

            const pendingClaimsForCurInvestor = pendingClaims.filter( (x) => {
                return !votedClaims.includes(x);
            });
            var prevState = this.state.pendingClaimsForInvestor;
            prevState[this.state.account] = pendingClaimsForCurInvestor;

            this.setState( { pendingClaimsForInvestor : prevState });
        }
        else{
            alert('Must be an investor to continue');
        }
    }

    handleApplicationAccept = async (addr) => {
        const contract = this.state.underlyingContract;
        const tx = await contract.methods.acceptContract(addr).send( { from : this.state.account } );
        console.log(tx);
    }

    handleApplicationReject = async (addr) => {
        const contract = this.state.underlyingContract;
        const tx = await contract.methods.rejectContract(addr).send( { from : this.state.account } );
        console.log(tx);
    }
    handleClaimAccept = async (addr) => {
        const contract = this.state.underlyingContract;
        const tx = await contract.methods.acceptClaim(addr).send( { from : this.state.account } );
        console.log(tx);
    }

    handleClaimReject = async (addr) => {
        const contract = this.state.underlyingContract;
        const tx = await contract.methods.rejectClaim(addr).send( { from : this.state.account } );
        console.log(tx);
    }

    render() {
        return ( 
           <BrowserRouter>
                <div>
                    <>
                        <Navigation connectWallet={this.connectWallet} account={this.state.account}/>
                    </>
                    <div>
                        <Routes>
                            <Route path="/" element={<Home handleSubmit={this.handleApplicationSubmit} 
                                                           applicationSuccess={this.state.applicationSuccess}/> } /> 
                            <Route path="/applications" element={ <Applications handleSubmit={this.handleApplicationDetailsQuery}
                                                                                applicationDetails={this.state.applicationDetails}/>} />
                            <Route path="/investors" element={<Investors handlePendingApplicationsQuery={this.handlePendingApplicationsQuery}
                                                                         pendingApplications={this.state.pendingApplicationsForInvestor[this.state.account] }
                                                                         handleInvestorApplicationSubmit={this.handleInvestorApplicationSubmit}
                                                                         handleApplicationAccept={this.handleApplicationAccept}
                                                                         handleApplicationReject={this.handleApplicationReject}
                                                                         handlePendingClaimsQuery={this.handlePendingClaimsQuery}
                                                                         pendingClaims={this.state.pendingClaimsForInvestor[this.state.account] }
                                                                         handleClaimAccept={this.handleClaimAccept}
                                                                         handleClaimReject={this.handleClaimReject}
                                                                         />} />
                            <Route path="/claims" element={<Claims  handleClaimSubmit={this.handleClaimSubmit}
                                                                    claimSuccess={this.state.claimSuccess}/>} />
                            <Route path="/about" element={<About/>} />
                        </Routes>
                    </div>
                </div>
           </BrowserRouter>
        );
    }

}

export default App;
