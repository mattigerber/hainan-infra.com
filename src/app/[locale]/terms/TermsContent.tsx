import LegalProse from "@/components/Legal/LegalProse";

/* eslint-disable react/no-unescaped-entities */

/**
 * TermsContent
 *
 * Full text of the Terms of Use. Edit freely — all standard HTML elements
 * (h1–h3, p, ul, ol, li, strong, em, hr, small) are styled by LegalProse.
 */
export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-4">
      <LegalProse>
      <div className="mb-8">
        <h1>Terms of Use</h1>
        <small>Last Updated: March 2026</small>
      </div>

      <p>
        These Terms of Use ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") 
        and Hainan Infrastructure Partners, a company incorporated in the Hainan Free Trade Port, China ("Company," 
        "we," "us," or "our"). By accessing our website (the "Site") and connecting your digital wallet, you agree 
        to these Terms. If you do not agree, you must immediately cease using the Site.
      </p>

      <h2>§ 1. THE SITE AS AN INTERFACE ONLY (FRONT-END DEFENSE)</h2>
      <p>
        The Site and Interface provided by the Company operate solely as a graphical user interface that enables users 
        to interact with publicly available blockchain protocols. The Company does not deploy, own, control, operate, 
        or maintain the underlying smart contracts or blockchain networks with which users interact.
      </p>
      
        <p>
          <strong>(a) Non-Custodial:</strong> The Company does not at any time have custody, possession, or control 
          of your digital assets or private keys.
        </p>
        <p>
          <strong>(b) No Protocol Control & Pure Immutability:</strong> The smart contracts corresponding to the 
          projects are deployed as immutable code. The Company does not hold "admin keys," proxy upgrade capabilities, 
          or pause functions. Once deployed, the Protocol operates autonomously. Transactions are executed directly 
          by you via your connected wallet.
        </p>
        <p>
          <strong>(c) No Execution:</strong> We do not facilitate, execute, route, or process transactions. We merely 
          provide a visual representation of publicly available on-chain data and a method to broadcast transactions 
          to the blockchain.
        </p>
        <p>
          <strong>(d) No Token Issuance:</strong> The Company does not issue, mint, or distribute cryptographic tokens, 
          digital receipts, or "tickets."
        <p>
        </p>
          <strong>(e) Direct Contract Interaction & Interface Cessation:</strong> Users possess the technical ability to 
          bypass the Interface and interact directly with smart contracts (e.g., via Etherscan). You expressly represent 
          that you possess the technical proficiency to manage your Smart Contract Ledger Entries directly via block 
          explorers or command-line interfaces in the event that the Interface is seized, taken offline, or permanently 
          discontinued. The Company expressly disclaims any liability arising from transactions where a user bypasses 
          the Interface or relies entirely on the Interface for asset management.
        </p>
        <p>
          <strong>(f) Cryptographic Signature Equivalency:</strong> The Interface may request that you sign messages 
          or data payloads (e.g., EIP-712 typed data signatures) using your cryptographic wallet. You expressly agree 
          that any such cryptographic signature constitutes your legally binding electronic signature. You waive any 
          legal defense arguing that a cryptographic signature lacks the validity, enforceability, or binding effect 
          of a traditional wet-ink signature under the Electronic Signatures in Global and National Commerce (E-SIGN) 
          Act or equivalent international statutes.
        </p>
      

      <h2>§ 2. ELIGIBILITY AND REPRESENTATIONS</h2>
      <p>By using the Site, you represent and warrant that:</p>
        <p>
          <strong>(a)</strong> You are at least 18 years of age.
        </p>
        <p>
          <strong>(b)</strong> You are not a resident, citizen, or agent of any "Restricted Jurisdiction," including 
          the United States of America, OFAC-sanctioned regions, or other regions where use violates applicable law.
        <p>
        </p>
          <strong>(c)</strong> You are not listed on any sanctions list or acting on behalf of a sanctioned individual 
          or entity.
        </p>
        <p>
          <strong>(d) Mainland China Compliance:</strong> You acknowledge the PRC regulations regarding virtual currency 
          trading and comply with Hainan Free Trade Port regulations.
        </p>
        <p>
          <strong>(e) No Fiat-to-Crypto Exchange:</strong> The Interface does not facilitate the exchange of fiat for 
          virtual currencies, complying with PBOC restrictions.
        </p>
        <p>
          <strong>(f) Anti-Circumvention and Location Disguise (VPNs):</strong> You expressly agree not to use Virtual 
          Private Networks (VPNs), proxy servers, or other anonymizing technologies to disguise your true location, 
          residency, or citizenship. Any such obfuscation or false representation constitutes a material breach of these 
          Terms, immediately voids any rights or licenses granted herein, and exposes you to full indemnification liability.
        </p>
        <p>
          <strong>(g) Sophisticated User & Non-Consumer Status:</strong> You represent and warrant that you possess a 
          sophisticated understanding of blockchain technology, cryptographic ledgers, and smart contract execution. You 
          expressly agree that you are accessing the Interface for sophisticated commercial, business, or institutional 
          purposes, and you strictly waive any right to be classified as a "consumer" under applicable consumer protection 
          laws of any jurisdiction.
        </p>
        <p>
          <strong>(h) Automated Agents & AI Users:</strong> If you access the Interface via an automated agent, AI assistant, 
          or algorithmic script ("Automated Agent"), you acknowledge that the human or corporate entity operating such 
          Automated Agent is strictly bound by these Terms. The Company bears no liability for "hallucinations," coding 
          errors, or unintended executions performed by your Automated Agent.
        </p>
      

      <h2>§ 3. WALLET RESPONSIBILITY & THIRD-PARTY RELAY PROTOCOLS</h2>
      <p>
        You are solely responsible for the security and management of your digital wallet. The Company shall not be liable 
        for lost or stolen keys, unauthorized access, transaction errors, or wallet incompatibility. Wallet providers are 
        independent and not controlled by the Company.
      </p>
      
        <p>
          <strong>(a) Interface Settings and Execution Parameters:</strong> The Interface may display default values for 
          transaction parameters, including but not limited to gas limits, gas prices, slippage tolerance, and Remote 
          Procedure Call (RPC) routing. These default values are provided for user convenience only. You are strictly 
          responsible for reviewing, modifying, and verifying all transaction parameters within your wallet software prior 
          to cryptographic signature. The Company bears no liability for failed transactions, front-running, sandwich 
          attacks, or lost network fees (gas) resulting from your reliance on default Interface settings.
        </p>
        <p>
          <strong>(b) MEV and Transaction Sequencing:</strong> You acknowledge that blockchain networks are subject to 
          Maximal Extractable Value (MEV) strategies, where validators or third parties reorder, include, or exclude 
          transactions to extract value. You agree that the Company is not responsible for any "sandwich attacks," 
          "front-running," or other sequencing activities that may affect the execution price or outcome of your transactions.
        </p>
        <p>
          <strong>(c) Third-Party Relay Infrastructure (e.g., WalletConnect):</strong> The Interface integrates third-party 
          connection protocols (including but not limited to WalletConnect/Reown) to bridge communication between the Interface 
          and your cryptographic wallet. You expressly acknowledge that these connection protocols are operated by independent 
          centralized entities utilizing proprietary cloud relay servers. The Company bears zero liability for relay server 
          outages, WebSocket connection failures, deep-link hijacking, or your inability to execute transactions due to 
          third-party infrastructure downtime. Furthermore, you acknowledge that these third-party relay providers may 
          independently enforce IP-based geofencing or sanctions-blocking at the network layer, overriding Interface functionality.
        </p>
        <p>
          <strong>(d) Third-Party Hosting, Cookies, and Data Points:</strong> The Interface is delivered through independent
          third-party infrastructure providers, including GitHub-hosted web delivery layers and other network service
          providers. You expressly acknowledge that these providers, wallet relays, RPC operators, and related technical
          services may collect or process technical datapoints such as IP address, user agent, device metadata,
          network timestamps, and connection diagnostics, and may use technical cookies or equivalent identifiers under
          their own policies. The Company does not own or control those third-party data processing operations.
        </p>

      <h2>§ 3A. COOKIE AND LOCAL STORAGE CONSENT</h2>
      <p>
        The Interface may request your consent choice for browser-based storage through a cookie/local-storage notice.
        By selecting a consent option and continuing to use the Interface, you authorize the corresponding storage of
        consent records and strictly necessary operational preferences on your device. You may clear browser data at any
        time, but doing so may require reconnecting your wallet and re-accepting legal notices.
      </p>
      

      <h2>§ 4. ASSUMPTION OF RISK</h2>
      <p>
        You acknowledge blockchain networks involve significant risks, including smart contract vulnerabilities, network 
        congestion, Miner Extractable Value (MEV), third-party infrastructure failures, and irreversible transactions.
      </p>
      
        <p>
          <strong>(a) Network Forks:</strong> You acknowledge that underlying blockchain networks are subject to sudden 
          changes ("Forks"). The Company bears no responsibility to evaluate or support any specific Fork. The Company may 
          suspend Interface support during a Fork without liability for any loss of value.
        </p>
        <p>
          <strong>(b) Cross-Chain Bridging:</strong> Any use of third-party bridging technology to facilitate a transaction 
          displayed on the Interface is executed entirely at your own risk.
        </p>
        <p>
          <strong>(c) Probabilistic Finality and Network Re-organizations:</strong> You acknowledge that blockchain 
          transactions are subject to "probabilistic finality." A transaction displayed as "Confirmed" or "Successful" on 
          the Interface may be reverted or invalidated by a network re-organization (re-org). The Company bears no liability 
          for any reliance on Interface notifications prior to the achievement of absolute cryptographic finality on the 
          underlying network.
        </p>
        <p>
          <strong>(d) Airdrops and Unsupported Ledger Events:</strong> The Interface may not support, display, or facilitate 
          the claiming of secondary assets, governance tokens, airdrops, or passive yield generated by third-party RWA smart 
          contracts. The Company has no obligation to notify you of such events and disclaims any liability for your failure 
          to claim ancillary assets due to Interface limitations.
        </p>
      

      <h2>§ 5. NO FINANCIAL OR FIDUCIARY RELATIONSHIP</h2>
      <p>
        The Company is not a broker, financial advisor, investment firm, or fiduciary. Users are responsible for independent 
        research and due diligence.
      </p>
      
        <p>
          <strong>(a) Software Convenience Fee:</strong> The Interface may impose a fee for routing transactions through its 
          proprietary front-end software. You explicitly acknowledge that this is a software convenience fee and does not 
          constitute a commission, brokerage fee, or routing payment.
        </p>
        <p>
          <strong>(b) No Joint Venture:</strong> Nothing in these Terms or your use of the Interface shall be construed as 
          creating a partnership, joint venture, agency, or employment relationship between you and the Company.
        </p>
        <p>
          <strong>(c) No Investment Advisory or Suitability:</strong> The Interface does not provide "suitability" assessments. 
          The Company does not determine if any project is appropriate for your financial situation, risk tolerance, or 
          investment objectives. Any interactive elements on the Site (e.g., filters, calculators, or project lists) do not 
          constitute an individualized investment recommendation or financial advice.
        </p>
        <p>
          <strong>(d) Conflicts of Interest Disclosure:</strong> The Company, its directors, employees, and affiliates may 
          contribute to, maintain positions in, or provide services to projects displayed on the Interface. You acknowledge 
          that such interests may exist and waive any claim arising from a perceived or actual conflict of interest.
        </p>
        <p>
          <strong>(e) No Securities Solicitation or Offering:</strong> The display of any Real World Asset (RWA) project, 
          metric, or related documentation on the Interface does <strong>not</strong> constitute an offer to sell, a 
          solicitation of an offer to buy, or a recommendation of any security, token, or financial instrument. The 
          Interface is a purely neutral technological conduit for on-chain interactions.
        </p>
      

      <h2>§ 6. NO RELIANCE & ALGORITHMIC NEUTRALITY</h2>
      <p>
        Users acknowledge that any information, analytics, or project descriptions displayed on the Interface are for 
        informational purposes only. Users must not rely on such information for financial decisions.
      </p>
      
        <p>
          <strong>(a) Algorithmic Neutrality:</strong> The arrangement, sorting, filtering, or display of third-party RWA 
          projects on the Interface (including but not limited to sorting by APY, Total Value Locked, or alphabetical order) 
          is generated by neutral algorithms or historical on-chain data. Such UI layouts do not constitute an endorsement, 
          solicitation, or active promotion of any specific project by the Company.
        
        </p>

        <p>
          <strong>(b) Frontend Data Latency and Decentralized RPC Synchronization:</strong> You expressly acknowledge that the Interface 
          displays on-chain data by querying independent Remote Procedure Call (RPC) node operators, including decentralized 
          RPC routing networks (e.g., Lava Network, Pocket Network). Due to the distributed nature of these nodes, network congestion, 
          or individual node desynchronization, the data displayed on the Interface (including balances, yields, and project states) 
          may be delayed, stale, or inaccurate compared to the absolute real-time state of the underlying blockchain. You bear the 
          absolute burden of independently verifying the definitive on-chain state using an independent block explorer prior to 
          executing any cryptographic signature. The Company strictly disclaims any liability for financial loss resulting from 
          transactions executed in reliance upon latent, desynchronized, or cached data displayed on the Interface.
        </p>
      

      <h2>§ 7. MODIFICATION OR DISCONTINUATION OF THE INTERFACE</h2>
      <p>
        The Company may modify, suspend, restrict, or discontinue the Interface at any time without notice.
      </p>

      <h2>§ 8. INTELLECTUAL PROPERTY & THIRD-PARTY METADATA</h2>
      <p>
        All proprietary IP rights relating to the Site and Interface architecture are owned by or licensed to the Company.
      </p>
        <p>
          <strong>(a) Passive Conduit for On-Chain Metadata:</strong> The Interface automatically reads and displays metadata 
          (including project names, logos, images, and descriptions) directly from third-party smart contracts, decentralized 
          storage (e.g., IPFS), or third-party RWA protocol deployers. The Company acts strictly as a passive conduit for 
          this third-party information. The Company disclaims all liability for copyright, trademark, or other intellectual 
          property infringement arising from the automated display of third-party RWA metadata on the Interface.
        </p>
        <p>
          <strong>(b) Off-Chain Data Persistence (IPFS/Decentralized Storage):</strong> RWA metadata, prospectuses, legal 
          deeds, and project imagery are frequently hosted on decentralized storage networks (e.g., IPFS, Arweave) or 
          centralized third-party servers. The Company does not operate the pinning nodes or storage infrastructure for this 
          metadata. The Company bears no liability for "data decay," broken links, or the permanent loss of off-chain 
          documentation that corresponds to your on-chain Smart Contract Ledger Entries.
        </p>

      <h2>§ 9. INDEMNIFICATION</h2>
      <p>
        You agree to indemnify, defend, and hold harmless the Company, its directors, employees, and affiliates from and 
        against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees and costs 
        associated with regulatory inquiries) arising from: your use of the Interface, your violation of these Terms, your 
        use of circumvention technologies (VPNs), your false representation of residency, your violation of applicable laws, 
        or your interaction with third-party projects displayed on the Interface.
      </p>

      <h2>§ 10. LIMITATION OF LIABILITY AND TIME-BAR</h2>
      <p>
        To the maximum extent permitted by law, the Company shall not be liable for indirect, incidental, or consequential 
        damages, including loss of profits, stablecoins, or third-party project misconduct.
      </p>
        <p>
          <strong>(a) TIME LIMITATION ON CLAIMS:</strong> You agree that any claim or cause of action arising out of or 
          related to your use of the Interface or these Terms must be filed within one (1) year after such claim arose, or 
          it shall be forever barred, regardless of any statute or law to the contrary.
        </p>

      <h2>§ 11. DISCLAIMER OF WARRANTIES</h2>
      <p>
        The Interface is provided "as-is" and "as-available". The Company disclaims all warranties including merchantability, 
        fitness for a particular purpose, non-infringement, and uninterrupted operation.
      </p>

      <h2>§ 12. FORCE MAJEURE & REGULATORY DISRUPTION</h2>
      <p>
        The Company is not liable for failures caused by events beyond reasonable control.
      </p>
        <p>
          <strong>(a) Regulatory Disruption:</strong> You expressly acknowledge the volatility of the regulatory environment 
          within the People's Republic of China and the Hainan Free Trade Port. In the event of sudden changes in law, 
          administrative orders, or judicial interpretations that render the Interface or the Protocol illegal or 
          non-compliant, the Company reserves the right to immediately and permanently discontinue the Interface without 
          prior notice or liability.
        </p>
      
      <h2>§ 13. TAXES, WITHHOLDING, AND INFORMATION REPORTING</h2>
      <p>
        Users are strictly responsible for determining, reporting, and remitting any applicable taxes arising from their 
        on-chain transactions and Smart Contract Ledger Entries. The Company operates strictly as non-custodial software 
        and does not act as a withholding agent. The Company disclaims any obligation to issue tax forms (e.g., 1099s), 
        conduct backup withholding, or collect tax residency documentation (e.g., W-8BEN/W-9) under the U.S. Foreign Account 
        Tax Compliance Act (FATCA), the OECD Common Reporting Standard (CRS), or equivalent global tax frameworks.
      </p>

      <h2>§ 14. AUTOMATED UI-LEVEL SANCTIONS AND THIRD-PARTY ORACLES</h2>
      <p>
        While the Company does not control the Protocol, the Interface implements automated front-end restrictions to comply 
        with global regulatory standards.
      </p>
        <p>
          <strong>(a) Data Reliance:</strong> You acknowledge that the Interface automatically queries independent, third-party 
          blockchain analytics APIs or decentralized data oracles (e.g., TRM Labs, Chainalysis, or on-chain OFAC registries) 
          to screen connected wallet addresses. The Company does not conduct manual surveillance, investigations, or subjective 
          filtering of users.
        </p>
        <p>
          <strong>(b) Access Restriction & False Positives:</strong> If a third-party oracle flags a wallet address as 
          associated with illicit activity, money laundering, or a sanctioned jurisdiction (including the U.S. OFAC SDN list), 
          the Interface will automatically restrict UI access. The Company relies blindly on these external data providers and 
          bears no liability for "false positives," outdated data, or erroneous access restrictions caused by third-party systems.
        </p>
        <p>
          <strong>(c) Protocol-Level Sanctions & Severability of Routing:</strong> In the event that a sovereign entity, 
          regulatory body, or sanctions list (including but not limited to the U.S. Department of the Treasury's Office of 
          Foreign Assets Control) designates, sanctions, or blacklists a specific third-party smart contract address, 
          decentralized protocol, or autonomous code interacting with the Interface, the Company reserves the absolute, 
          unilateral right to immediately and permanently sever frontend routing to the sanctioned protocol. You expressly 
          acknowledge that the Company's cessation of interface support for a sanctioned smart contract does not constitute a 
          seizure of your assets, as your Smart Contract Ledger Entries remain mathematically accessible via the underlying 
          blockchain. The Company bears zero liability for any loss of value or inability to liquidate assets resulting from 
          the severing of frontend routing to a designated protocol.
        </p>
      

      <h2>§ 15. PROHIBITED USES</h2>
      <p>
        Users agree not to use the Interface for illegal or abusive activities, including money laundering, terrorist financing, 
        sanctions evasion, or smart contract exploitation.
      </p>

      <h2>§ 16. MODIFICATION OF TERMS (STATELESS NOTIFICATION)</h2>
      <p>
        Changes are effective immediately upon posting. Continued use constitutes binding acceptance.
      </p>

      <h2>§ 17. SEVERABILITY AND ENTIRE AGREEMENT</h2>
      <p>
        If any provision is deemed invalid, it is severed. These Terms, the Privacy Policy, and Risk Disclosures constitute 
        the entire agreement.
      </p>
      
        <p>
          <strong>(a) CONTROLLING LANGUAGE:</strong> The English version of these documents shall be the official, controlling 
          version. Translated versions are for convenience only.
        </p>
        <p>
          <strong>(b) Linguistic Comprehension Warranty:</strong> By accepting these Terms, you expressly warrant that you 
          possess a professional fluency in the English language, or that you have utilized competent, independent translation 
          services to comprehensively understand the legal obligations contained herein. You irrevocably waive any defense of 
          linguistic unconscionability or incomprehension.
        
        </p>

      <h2>§ 18. NON-WAIVER</h2>
      <p>
        Failure to enforce any provision does not waive the Company’s rights.
      </p>

      <h2>§ 19. GOVERNING LAW, ARBITRATION, AND CLASS ACTION WAIVER</h2>
      <p>
        Terms are governed by PRC law. All disputes shall be finally resolved by binding arbitration at the Hainan 
        International Arbitration Court (HIAC) in accordance with its rules in force at the time of applying for arbitration. 
        The arbitral tribunal shall consist of one (1) arbitrator. The language of the arbitration shall be English. Users 
        expressly waive rights to participate in class actions, jury trials, or representative proceedings. Notwithstanding 
        the foregoing, the Company retains the right to seek immediate injunctive relief in any court to prevent IP infringement.
      </p>

      <h2>§ 20. SURVIVAL</h2>
      <p>
        All provisions of these Terms which by their nature should survive termination shall survive.
      </p>

      <h2>§ 21. PHISHING, DNS HIJACKING, AND EXTERNAL COMMUNICATIONS</h2>
      <p>
        The Company assumes no liability for losses resulting from social engineering, phishing attacks, cloned websites, 
        or compromised third-party communication channels (including but not limited to Discord, X/Twitter, Telegram, or 
        email). Furthermore, you expressly acknowledge the risk of fundamental web protocol compromises, including but not 
        limited to Domain Name System (DNS) poisoning, Border Gateway Protocol (BGP) hijacking, or the compromise of the 
        Company’s domain registrars or hosting providers. In the event that the official Interface domain is hijacked to 
        serve malicious code, the Company shall bear no liability for resulting cryptographic signatures or lost assets.
      </p>

      <h2>§ 22. DIGITAL ACCESSIBILITY SAFE HARBOR</h2>
      <p>
        While the Company strives to ensure the Interface is reasonably accessible, you acknowledge that interfacing with 
        cryptographic wallets and decentralized ledgers inherently involves complex visual and technical elements. To the 
        maximum extent permitted by law, the Company disclaims liability for any inability to access or interact with the 
        Interface utilizing assistive technologies (e.g., screen readers) where such incompatibility stems from third-party 
        Web3 browser extensions or the underlying blockchain architecture.
      </p>

      <h2>§ 23. THIRD-PARTY SITE LINKS AND FRAMES</h2>
      <p>
        The Interface may contain links to third-party websites or "frames" of third-party content. The Company does not 
        control, endorse, or verify the security of these external sites. Any interaction with third-party sites is at your 
        own risk and subject to their respective terms.
      </p>
      </LegalProse>
    </div>
  );
}