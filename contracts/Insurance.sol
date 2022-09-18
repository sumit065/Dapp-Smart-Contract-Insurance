// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Insurance{

    struct VoteCount{
        uint256 totalVotes;
        uint256 positiveVotes;
    }

    struct InvestorStake{
        uint256 stakedEther;
        uint256 curContractBalance;
    }

    mapping( address => VoteCount ) public applicantContractToVoteCountMap ; //contracts pending approval to their respective voteCounts
    mapping( address => bool ) public applicantContracts; // tracks the contracts which are pending approval; it's defined as a map rather than a list for ready lookup
    mapping( address => bool ) public registeredContracts; // tracks the contracts which have been registered for insurance; it's defined as a map rather than a list for ready lookup
    mapping( address => VoteCount ) public claimantContractToVoteCountMap;
    mapping( address => bool ) public claimantContracts;
    mapping( address => address ) public registeredContractToNomineeMap;
    mapping( address => uint256 ) public registeredContractToSumInsuredMap;
    mapping( address => uint256 ) public registeredContractToPremiumMap;
    mapping( address => InvestorStake ) public investorToStakeMap;
    mapping( address => address[] ) public investorToVotedApplicationsMap;
    mapping( address => address[] ) public investorToVotedClaimsMap;

    address[] public investorList;
    address[] public allApplicantContracts;
    address[] public allClaimantContracts;

    uint256 public tokenAmount;
    uint256 public minInvestableAmount;
    uint256 public totalInvestorCount;

    constructor ( uint256 _tokenAmount, uint256 _minInvestableAmount ) {
        tokenAmount = _tokenAmount;
        minInvestableAmount = _minInvestableAmount;
    }

    function _assertIsInvestor( address eoa ) private view returns(bool){
        /* Check if the eoa is an investor in the pool. */
        if(!_assertDefaultInvestorStake( investorToStakeMap[eoa] ))return true;
        return false;
    }

    function _acceptContractCondition( VoteCount memory _voteCount ) private view returns(bool){
        /* Does the voteCount indicate acceptability for insurance.*/
        /* This is avery basic implementation and I'm aware that is is very much prone to hacks.
           Keeping it here just as a proof of concept.
           We can think of more advanced conepts like votes weighted by stake which is more hack-proof than the first but it can become monoploistic.
        */
        /* If at least 70% have voted and the majority is positive then accept*/
        if( 100*(_voteCount.totalVotes)/totalInvestorCount >= 70 ){
            if( 100*(_voteCount.positiveVotes)/_voteCount.totalVotes >= 51 )return true;
        }
        return false;
    }

    function _acceptClaimCondition( VoteCount memory _voteCount ) private view returns(bool){
        /* Whether the vote count indicates condition for accepting the claim. */
        /* Keeping it the same as _acceptContractCondition for now*/
        return _acceptContractCondition( _voteCount );
    }

    function _assertDefaultInvestorStake( InvestorStake memory _investorStake ) private pure returns(bool){
        /* Checks if the input is the default value of struct type InvestorStake. */
        if( (_investorStake.stakedEther != 0) || ( _investorStake.curContractBalance !=0 )){ return false; }
        return true;
    }

    function _rejectClaimCondition( VoteCount memory _voteCount ) private view returns(bool){
        /* Condition when claim can definitely get rejected. */
        if ( 100*(_voteCount.positiveVotes + totalInvestorCount - _voteCount.totalVotes)/totalInvestorCount <= 50 ){
            return true;
        }
        return false;
    }

    function _assertIsDefaultVoteCount( VoteCount memory _voteCount  ) private pure returns(bool){
        /* checks if the input is the default value of struct type VoteCount */
        if( (_voteCount.totalVotes != 0) || (_voteCount.positiveVotes !=0 )){ return false; }
        return true;
    }

    function _calculatePremium( uint256 sumInsured ) private pure returns(uint256){
        /* Get the premium amount based on sum insured.*/
        return sumInsured/50;
    }

    function _calculatePayableAmount( InvestorStake memory _investorStake ) private view returns(uint256){
        /* Calculate the amount payable when an investor exits. */
        return (_investorStake.stakedEther)*(address(this).balance)/_investorStake.curContractBalance;
    }
    
    function activeInvestors() external view returns(address[] memory){
        /* Get the list of active investors in the pool. */
        uint investorCount;
        for( uint i=0; i<investorList.length; i++ ){
            if( _assertIsInvestor(investorList[i]) )investorCount++;
        }
        uint j;
        address[] memory temp = new address[]( investorCount );
        for( uint i=0; i<investorList.length; i++ ){
            if( _assertIsInvestor(investorList[i]) ){
                temp[j] = investorList[i];
                j++;
            }
        }
        return temp;
    }

    function votedClaimsForInvestor( address _investor ) external view returns(address[] memory){
        /** Returns the list of voted claims for investor */
        address[] memory _votedClaimsForInvestor = investorToVotedClaimsMap[_investor];
        return _votedClaimsForInvestor;
    }

    function pendingClaims() external view returns(address[] memory){
        /** Checks the list of claims pending investor approval */
        uint claimsCount;
        for( uint i=0; i<allClaimantContracts.length; i++ ){
            if( claimantContracts[allClaimantContracts[i]])claimsCount++;
        }
        uint j;
        address[] memory activeClaims = new address[]( claimsCount );
        for( uint i=0; i<allClaimantContracts.length; i++ ){
            if( claimantContracts[allClaimantContracts[i]] ){
                activeClaims[j] = allClaimantContracts[i];
                j++;
            }
        }
        return activeClaims;
    }

    function votedApplicationsForInvestor( address _investor ) external view returns(address[] memory){
        /** Returns the list of voted applications for investor */
        address[] memory _votedApplicationsForInvestor = investorToVotedApplicationsMap[_investor];
        return _votedApplicationsForInvestor;
    }

    function pendingApplications() external view returns(address[] memory){
        /** Checks the list of applications pending investor approval */
        uint applicationsCount;
        for( uint i=0; i<allApplicantContracts.length; i++ ){
            if( applicantContracts[allApplicantContracts[i]])applicationsCount++;
        }
        uint j;
        address[] memory activeApplications = new address[]( applicationsCount );
        for( uint i=0; i<allApplicantContracts.length; i++ ){
            if( applicantContracts[allApplicantContracts[i]] ){
                activeApplications[j] = allApplicantContracts[i];
                j++;
            }
        }
        return activeApplications;
    }
    
    function investInPool() external payable {
        /* To be called externally in order to invest in pool. */
        require( msg.value >= minInvestableAmount, "Invested amount too less." );
        investorToStakeMap[ msg.sender ] = InvestorStake( msg.value, address(this).balance );
        totalInvestorCount = totalInvestorCount + 1 ;
        investorList.push( msg.sender );
    }

    function exitPool() external {
        require( !_assertDefaultInvestorStake(investorToStakeMap[msg.sender]), "Must be an investor to execute this operation.");
        payable( msg.sender ).transfer( _calculatePayableAmount(investorToStakeMap[msg.sender]));
        delete investorToStakeMap[msg.sender];
        totalInvestorCount = totalInvestorCount - 1 ;
    }

    function payPremium( address contractAddr ) external payable {
        /* To be called externally to pay premium.
           As of now it accepts one-time premium only. */
        require( msg.value >= registeredContractToPremiumMap[contractAddr], "Insufficient amount paid as premium." );
        delete registeredContractToPremiumMap[contractAddr];
    }

    function registerClaim( address contractAddr ) external payable {
        /* To be called externally when claims are to be made for the contract */
        require( msg.value >= tokenAmount, "Token money needs to be paid to initiate claim.");
        require( !applicantContracts[ contractAddr ], "Cannot raise claim when contract application is pending." );
        require( registeredContracts[ contractAddr ], "Contract not registered." );
        require( !claimantContracts[ contractAddr ], "Claim already raised." );
        claimantContracts[ contractAddr ] = true;
        allClaimantContracts.push(contractAddr);
    }
 
    function acceptClaim( address contractAddr ) external {
        /* To be called externally by investor EOAs to accept insurance claims */
        require( _assertIsInvestor( msg.sender ), "Only investors can vote.");
        require( claimantContracts[contractAddr], "Contract not eligible for voting on claims.");
        VoteCount memory count = claimantContractToVoteCountMap[ contractAddr ];
        count = VoteCount( 1 + count.totalVotes, 1+ count.positiveVotes );
        claimantContractToVoteCountMap[ contractAddr ] = count;
        investorToVotedClaimsMap[msg.sender].push( contractAddr );

        if( _acceptClaimCondition( count )){
            delete registeredContracts[contractAddr];
            delete registeredContractToNomineeMap[contractAddr];
            delete registeredContractToSumInsuredMap[contractAddr];
            delete registeredContractToPremiumMap[contractAddr];
            delete claimantContracts[contractAddr];
            delete claimantContractToVoteCountMap[ contractAddr ];
            payable(registeredContractToNomineeMap[contractAddr]).transfer( registeredContractToSumInsuredMap[contractAddr] );
        }
    }

    function rejectClaim( address contractAddr ) external {
        /* To be called externally by investor EOAs to reject insurance claims */
        require( _assertIsInvestor( msg.sender ), "Only investors can vote.");
        require( claimantContracts[contractAddr], "Contract not eligible for voting on claims.");
        VoteCount memory count = claimantContractToVoteCountMap[ contractAddr ];
        count = VoteCount( 1 + count.totalVotes, count.positiveVotes );
        claimantContractToVoteCountMap[ contractAddr ] = count;
        investorToVotedClaimsMap[msg.sender].push( contractAddr );

        if( _rejectClaimCondition( count )){
            delete registeredContracts[contractAddr];
            delete registeredContractToNomineeMap[contractAddr];
            delete registeredContractToSumInsuredMap[contractAddr];
            delete registeredContractToPremiumMap[contractAddr];
            delete claimantContracts[contractAddr];
            delete claimantContractToVoteCountMap[ contractAddr ];
        }
    }

    function acceptContract( address contractAddr ) external {
        /* To be called externally by investor EOAs to reject the applicant contracts */
        require( _assertIsInvestor( msg.sender ), "Only investors can vote.");
        require( applicantContracts[contractAddr], "Contract not eligible for voting.");
        VoteCount memory count = applicantContractToVoteCountMap[ contractAddr ];
        count = VoteCount( 1 + count.totalVotes, 1+ count.positiveVotes );
        applicantContractToVoteCountMap[ contractAddr ] = count;
        if( _acceptContractCondition( count )){
            delete applicantContracts[contractAddr];
            delete applicantContractToVoteCountMap[ contractAddr ];
            registeredContracts[contractAddr] = true;
            registeredContractToPremiumMap[contractAddr] = _calculatePremium( registeredContractToSumInsuredMap[contractAddr] );
            investorToVotedApplicationsMap[msg.sender].push( contractAddr );
        }
    }

    function rejectContract( address contractAddr ) external {
        /* To be called externally by investor EOAs to reject the applicant contracts */
        require( _assertIsInvestor( msg.sender ), "Only investors can vote.");
        require( !applicantContracts[contractAddr], "Contract not eligible for voting.");
        VoteCount memory curCount = applicantContractToVoteCountMap[ contractAddr ];
        applicantContractToVoteCountMap[ contractAddr ] = VoteCount( 1 + curCount.totalVotes, curCount.positiveVotes );
        investorToVotedApplicationsMap[msg.sender].push( contractAddr );
    }

    function applyForInsurance( address contractAddr, uint256 sumInsured ) external payable {
        /* Apply for insurance */
        require( msg.value >= tokenAmount, "Token money needs to be paid to initiate registration.");
        require( !applicantContracts[ contractAddr ], "Already applied; contract is pending approval." );
        require( !registeredContracts[ contractAddr ], "Already registered." );
        applicantContracts[ contractAddr ] = true;
        registeredContractToNomineeMap[contractAddr] = msg.sender;
        registeredContractToSumInsuredMap[contractAddr] = sumInsured;
        allApplicantContracts.push( contractAddr );
    } 
    
}
