import React from 'react';
import './Abstract.css';

const Abstract = () => {
  return (
    <section className="abstract-section">
      <div className="abstract-container">
        <h2 className="abstract-title">Abstract</h2>
        
        <div className="abstract-content">
          <p>
            Tomato brown rugose fruit virus (ToBRFV), a member of the <em>Tobamovirus</em> genus, is an emerging virus that significantly
            reduces yield and fruit quality, making it one of the significant threats to tomato production today. A recent study detected
            ToBRFV in fresh tomato seeds sourced from different markets in Colombia, but its presence in the field was not confirmed. 
          </p>
          
          <p>
            Using real-time PCR with a TaqMan probe, ToBRFV was detected in 19 out of 20 tomato fields tested across eight
            municipalities in the province of Antioquia. High-throughput sequencing was conducted on isolates infecting plants from
            the Chonto and Cherry varieties, revealing isolates that share 99.9% nucleotide identity. 
          </p>
          
          <p>
            A comparison to the reference ToBRFV sequence revealed three amino acid changes in the RdRp protein and two in the movement protein, including
            A134T, associated with increased symptoms severity. Phylogenetic analysis of the genome and the MT and CP regions
            shows that Colombian ToBRFV isolates exhibit high similarity and belong to the global clade of ToBRFV sequences.
          </p>
          
          <p>
            Using a log-transformed gravity model, we also assessed the risk of ToBRFV cross-transmission between <em>S. lycopersicum</em> and <em>C. annuum</em>. In Antioquia, we identified the El Peñol (risk index -RI=5.3) and Marinilla (RI=4.7) regions and the
            Cesar (RI=3.2) and Cundinamarca (RI=3.1) provinces as the areas at highest risk of cross-transmission in the country.
          </p>
          
          <p className="abstract-conclusion">
            To date, this is the first field detection of ToBRFV in Colombia. Given the imminent threat to tomato yield and quality,
            local authorities must adopt urgent phytosanitary measures to manage ToBRFV.
          </p>
        </div>

        <div className="keywords-section">
          <h3 className="keywords-title">Keywords</h3>
          <div className="keywords-container">
            <span className="keyword">Cross-transmission risk</span>
            <span className="keyword-separator">·</span>
            <span className="keyword">HTS</span>
            <span className="keyword-separator">·</span>
            <span className="keyword">RT-qPCR</span>
            <span className="keyword-separator">·</span>
            <span className="keyword">Solanaceae</span>
            <span className="keyword-separator">·</span>
            <span className="keyword">Tobamovirus</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Abstract;
