import LegalProse from "@/components/Legal/LegalProse";

/**
 * DownloadsContent
 *
 * Content for the Downloads page. Edit freely — all standard HTML elements
 * (h1–h3, p, ul, ol, li, strong, em, hr, small) are styled by LegalProse.
 *
 * Add download links as <a href="..."> inside list items or paragraphs.
 */
export default function DownloadsContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-4">
      <LegalProse>
      <div className="mb-8">
        <h1>Digital Content License</h1>
      </div>

      <h2>§ 1. AS-IS PROVISION & PASSIVE CONDUIT</h2>
      <p>
        All files, technical documents, legal deeds, and prospectuses are provided on an "as-is" and "as-available" basis. 
        The Company acts strictly as a passive conduit for fetching and displaying these third-party documents. 
        The Company makes no warranties regarding their accuracy, legal validity, completeness, or security.
      </p>

      <h2>§ 2. STRICT EXEMPTION FROM SOLICITATION (THE "PROSPECTUS" DISCLAIMER)</h2>
      <p>
        The availability, downloading, or viewing of any Real World Asset (RWA) prospectus, pitch deck, or financial 
        document through this Interface does <strong>not</strong> constitute an offer to sell, a solicitation of an offer 
        to buy, or a recommendation of any security, token, or Smart Contract Ledger Entry by the Company. You expressly 
        acknowledge that the Company is not a broker-dealer or investment advisor, and the provision of these files is 
        for informational transparency only.
      </p>

      <h2>§ 3. LIMITED LICENSE</h2>
      <p>
        Users receive a personal, non-exclusive, non-transferable license to download and view content for 
        private, non-commercial research purposes. Users may not distribute, resell, modify, or create derivative works 
        from the downloaded files.
      </p>

      <h2>§ 4. DECENTRALIZED STORAGE & ASSUMPTION OF RISK</h2>
      <p>
        Users assume all risks associated with downloading files. Because RWA documentation is frequently hosted on 
        decentralized storage networks (e.g., IPFS, Arweave) and fetched via public gateways, the Company cannot guarantee 
        that files have not been subjected to gateway-level malicious injection or data decay. The Company is strictly not 
        liable for system damage, malware, phishing payloads embedded in PDFs, data loss, or financial loss resulting from 
        your reliance on or execution of the downloaded documents.
      </p>

      <h2>§ 5. THIRD-PARTY CONTENT ORIGINATION</h2>
      <p>
        Certain downloaded files may be authored by independent project operators or underlying asset issuers. The Company 
        does not audit, verify, or endorse third-party materials. Any reliance on the mathematical models, legal claims, 
        or physical asset valuations contained within such information is strictly at your own risk.
      </p>
      </LegalProse>
    </div>
  );
}