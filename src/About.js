import React from 'react';

class About extends React.Component {
    render() {
        return (
        <div class="w-75 p-3 container justify-content-center" >
            <h2> <u> Smart Contract Insurance </u>  </h2>

            <p> <a href="https://www.linkedin.com/in/sumit-singh-15898223b/" target="_blank" > Connect with me on LinkedIn </a> </p>
            <p> <a href="https://twitter.com/Sumeet16390505/" target="_blank"> Follow me on Twitter </a> </p>
            
            <p> Any smart contract can apply for insurance against potential hacks. </p>
            <p> Application has to be raised via a 'nominee' account, which will be the worthy  recipient of claims.</p>
            <p> Once applied, the application will be evaluated and then approved/rejected by the investors in the insurance pool. </p>   
            <p> Depending on the votes from investors, a contract is accepted for insurance and the premium amount is decided.</p>    
            <p> Post that the smart contract or nominee account has to pay regular/lumpsum premium. </p>
            <p> The premiums received by the dapp is disributed among the investors in proportion of their investments. </p>
            <p> In case of a hack on the insured contract, the nominee account can raise a claim. </p>   
            <p> This claim will be validated by the investors and if itis found genuine then the insured amount is credited to the nominee account. </p>
            <p> The process of becoming an investor is simple; just apply in the investors section and your stake is decided. </p>    
            <p> It's ideal for the investors to have some knowledge of smart contracts as it helps 
                them audit the applicant smart contracts to identify malicious applications.  </p>
        </div>
        )
    }
}

export default About;

/**
 * Smart contract hacks are very common, and especially with the mass adoption of web3 when we are going to see a surge in the develpment of 
 * smart contracts, it's pretty likely that many of them will be vulnerable to hacks. 
 * Thus it is desirable to have an insurance agaist such unforeseen attacks.
 * 
 * This im my attempt to build a decentralized insurance mechanism.
 * Idea is to have a pool composed of the investments of the participants.
 * The insurance premium paid by smart contracts contributes to the pool and in case of claims the insured amount is paid from this pool only.
 * But, for this model to be profitable, it's very important to have checks on the types of smart contracts that are applying for insurance.
 * Otherwise malicious parties can apply for insurance for intentionally vulnerable smat contracts and claim the insured amount.
 * 
 * This is acheieved by the following three things:
 *      1. SOme automated checks on the smart conract for vulnerability.
 *      2. A voting mechanism to accept the applications. 
 *          Every investor has the right and responsibility to vote on whether a smart contract will be accepted and depending on the majority.
 *      3. Manual audits of the smart contract by the investor. An investor who volunteers for manual audit will get a reward which increases their stake.
 * 
 * When an application satisfies the above conditions, it is accepted for insurance and it needs to pay the premium decided by an algorithm
 * which takes into account the vulnerability score ( combined from point 1 and 3), vote count (from point 2) and the insured amoount.
 * 
 * In case of claims, there is a similar voting mechanism of the investors to decide if there is a valid claim being made and if it 
 * is indeed found to be valid, the insured amount gets auto deducted from the pool and gets paid to the nominee of the contract.
 * 
 */