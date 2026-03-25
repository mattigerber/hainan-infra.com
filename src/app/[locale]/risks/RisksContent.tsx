import LegalProse from "@/components/Legal/LegalProse";

/**
 * RisksContent
 *
 * Full text of the RWA Risk Disclosure (Version 1.10). Edit freely — all standard HTML elements
 * (h1–h3, p, ul, ol, li, strong, em, hr, small) can be styled globally or via Tailwind.
 */

export default function RisksContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-4">
      <LegalProse>
      <div className="mb-8">
        <h1>RWA Risk Disclosure</h1>
        <p className="text-sm font-bold text-red-300 mt-2">PLEASE READ CAREFULLY BEFORE PROCEEDING.</p>
      </div>

      <h2>§ 1. NO FINANCIAL ADVICE & PASSIVE CONDUIT</h2>
      <p>
        The Company is not a registered adviser or broker-dealer. The Interface operates strictly as a passive 
        technological conduit. All information displayed is for informational purposes only and does not constitute 
        financial, investment, or legal advice.
      </p>

      <h2>§ 2. NATURE OF REAL WORLD ASSET (RWA) LEDGER ENTRIES</h2>
      <p>
        Transactions facilitated through the Interface involve the contribution of stablecoins to decentralized 
        smart contracts. These contributions result in a <strong>Smart Contract Ledger Entry</strong> that corresponds 
        to off-chain Real World Assets (RWAs) such as real estate, commodities, debt, or infrastructure.
      </p>

      <h2>§ 3. EXPLICIT NO-TOKEN ISSUANCE & ABSOLUTE ILLIQUIDITY</h2>
      <p>
        You expressly acknowledge that contributing stablecoins to a project via the Interface <strong>does not 
        result in the issuance, minting, or receipt of any cryptographic token, digital asset, or &quot;ticket.&quot;</strong>
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>(a) Ledger-Only Record:</strong> Your contribution is strictly recorded as a state change (a 
          Smart Contract Ledger Entry) within the underlying, immutable smart contract database.
        </li>
        <li>
          <strong>(b) Absolute Illiquidity:</strong> Because no tradable tokens or tickets are issued to your 
          wallet, your contribution cannot be traded, swapped, sold, or transferred on secondary markets or 
          decentralized exchanges (DEXs). The position is entirely illiquid.
        </li>
        <li>
          <strong>(c) No Common Enterprise:</strong> You acknowledge that your Smart Contract Ledger Entry represents 
          a distinct, mathematically autonomous record on a public blockchain. Your contribution does not constitute 
          a pooling of funds into a &quot;common enterprise&quot; managed, operated, or promoted by the Company, nor do you 
          expect profits derived from the essential managerial efforts of the Company.
        </li>
      </ul>

      <h2>§ 4. SETTLEMENT ASSET, DE-PEGGING, AND PROTOCOL CONTAGION RISK</h2>
      <p>
        Transactions are settled using third-party stablecoins (e.g., USDC, USDT).
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>(a) De-Pegging Risk:</strong> You acknowledge that these settlement assets carry their own 
          counterparty risks, including the severe risk of &quot;de-pegging&quot; from their designated fiat value, smart 
          contract exploits, or the centralized freezing of funds by their issuers (e.g., Circle, Tether).
        </li>
        <li>
          <strong>(b) Protocol Contagion & DeFi Composability:</strong> RWA projects often rely on other decentralized 
          protocols for liquidity, collateral, or yield generation. You acknowledge the risk of &quot;protocol contagion,&quot; 
          where a failure in a connected third-party protocol (even if not directly integrated with the Interface) 
          negatively impacts the value or liquidity of your Ledger Entry. The Company is not responsible for any 
          financial loss resulting from the failure, devaluation, or freezing of the underlying stablecoins or 
          connected DeFi protocols.
        </li>
      </ul>

      <h2>§ 5. SPECIFIC RWA RISKS</h2>
      <p>
        Interaction with RWA smart contracts involves valuation, oracle, legal, and regulatory risks, alongside 
        underlying smart contract vulnerabilities. Total loss of contributed stablecoins is possible.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>(a) Mathematical and Economic Modeling Risk:</strong> RWA projects may rely on complex economic 
          models, yield projections, and mathematical formulas to determine Ledger Entry values or distribution rates. 
          You acknowledge that these models are subject to human error, unforeseen economic shifts, or &quot;Black Swan&quot; 
          events. The Company bears no liability for losses arising from the failure of the underlying economic or 
          mathematical logic of any RWA project.
        </li>
        <li>
          <strong>(b) Reliance on Third-Party Data Oracles:</strong> The Protocol and the Interface may rely on 
          external data feeds (&quot;Oracles&quot;) to determine asset valuations, yields, or other critical parameters. You 
          acknowledge that Oracles are subject to manipulation, technical failure, or data inaccuracy. The Company 
          bears no liability for losses resulting from corrupted, delayed, or inaccurate Oracle data.
        </li>
      </ul>

      <h2>§ 6. NO PROJECT VERIFICATION & AUDIT FALLIBILITY</h2>
      <p>
        Projects displayed on the Interface may be provided by third parties. The Company does not audit, verify, 
        or guarantee their legitimacy, solvency, or operational security.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>(a) Audit Disclaimer:</strong> The display of any third-party smart contract security audit on 
          the Interface does not constitute a guarantee of security or an endorsement by the Company. Smart contract 
          audits are fallible and do not eliminate the risk of total fund loss.
        </li>
      </ul>

      <h2>§ 7. FORWARD-LOOKING STATEMENTS AND YIELD</h2>
      <p>
        Any metrics displayed on the Interface regarding historical performance, APY, APR, or projected cash flows 
        are generated by third-party protocols or historical on-chain data. They are strictly informational and do 
        not constitute a promise or legally binding forward-looking statement by the Company. Actual yields may 
        fluctuate to zero.
      </p>

      <h2>§ 8. REGULATORY UNCERTAINTY & CLASSIFICATION RISK</h2>
      <p>
        Users acknowledge that global regulatory bodies may attempt to classify RWA Smart Contract Ledger Entries 
        as securities, investment contracts, or regulated financial instruments. The Company makes no representations 
        regarding the legal classification of any project displayed. Users are solely responsible for determining 
        the legality of their interactions under their local jurisdictions.
      </p>

      <h2>§ 9. RWA UI DISCLAIMER</h2>
      <p>
        Each project listing on the Interface constitutes third-party information. The Company does not verify or 
        endorse the project. Users must Do Their Own Research (DYOR).
      </p>

      <h2>§ 10. ASSET-SPECIFIC RISKS</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li><strong>(a) Real Estate:</strong> Property damage, regulatory zoning, and title disputes.</li>
        <li><strong>(b) Debt:</strong> Default, liquidation failure, and counterparty insolvency risks.</li>
        <li><strong>(c) Commodities:</strong> Storage, audit failures, and spot-market valuation risks.</li>
      </ul>

      <h2>§ 11. SOVEREIGN ACTION & EMINENT DOMAIN</h2>
      <p>
        Physical assets backing RWA ledger entries are subject to the laws of their physical jurisdiction. You 
        acknowledge the severe risk that underlying assets may be subject to expropriation, eminent domain, 
        nationalization, physical seizure by law enforcement, or freezing orders. In such events, the corresponding 
        on-chain ledger entries may become mathematically worthless. The Company bears no liability for 
        state-sanctioned actions against underlying physical assets.
      </p>

      <h2>§ 12. ISSUER-LEVEL CONFISCATION AND SMART CONTRACT BLACKLISTS</h2>
      <p>
        Unlike highly decentralized protocols, RWA smart contracts are intrinsically tied to physical legal entities 
        and may contain centralized administrative privileges held by the third-party asset issuer. You acknowledge 
        that the underlying RWA issuer may possess the technical capability to unilaterally freeze, blacklist, 
        reverse, or confiscate your Smart Contract Ledger Entry to comply with real-world law enforcement, court 
        orders, or sanctions. The Company does not hold or control these administrative privileges and bears zero 
        liability for any asset-level freezing or confiscation executed by third-party issuers.
      </p>

      <h2>§ 13. IMMUTABLE PUBLIC DATA DISCLAIMER</h2>
      <p>
        Blockchain data is immutable; the Company cannot alter, pause, refund, or delete transactions once 
        broadcasted to the network.
      </p>

      <h2>§ 14. FIAT REDEMPTION AND AML/KYC CHOKE POINTS</h2>
      <p>
        While the Interface operates permissionlessly as a routing facilitator, the underlying Real World Assets 
        and centralized settlement stablecoins (e.g., USDC, USDT) are governed by physical legal entities subject 
        to international Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations (the &quot;Travel Rule&quot;). 
        You expressly acknowledge that attempting to redeem, liquidate, or bridge your Smart Contract Ledger Entries 
        into fiat currency may subject you to rigorous identity verification and source-of-funds checks by third-party 
        centralized entities. The Company operates strictly as a frontend facilitator and has no control over these 
        fiat &quot;choke points.&quot; Your assets may be permanently frozen by third-party issuers at the redemption layer 
        if you fail their compliance checks.
      </p>

      <h2>§ 15. DECENTRALIZED RPC AND STATE DESYNCHRONIZATION RISK</h2>
      <p>
        The Interface relies on decentralized Remote Procedure Call (RPC) networks (including but not limited to Lava 
        Network and Pocket Network) to read and broadcast blockchain state. You acknowledge the severe risk that these 
        distributed nodes may temporarily desynchronize from the actual chain tip. Executing transactions during a 
        desynchronization event may result in catastrophic price slippage, failed RWA redemptions, or financial loss 
        due to interacting with a stale mathematical state.
      </p>

      <h2>§ 16. CRYPTOGRAPHIC BLIND SIGNING (EIP-712) RISK</h2>
      <p>
        Interacting with complex RWA smart contracts frequently requires executing off-chain cryptographic signatures 
        (e.g., stablecoin approvals, EIP-712 typed data) via your independent injected wallet. You assume all risks 
        associated with &quot;blind signing&quot; transactions where your third-party wallet provider fails to human-readably 
        parse the contract payload. The Company bears no liability for malicious payloads signed, or assets lost, due 
        to the limitations of your chosen wallet software.
      </p>

      </LegalProse>

    </div>
  );
}