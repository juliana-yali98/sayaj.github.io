import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(168, 85, 247, 0.7) 100%), url("https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 max-w-5xl leading-tight">
            Tomato Brown Rugose Fruit Virus in Tomato and Pepper crops in Colombia
          </h1>
          
          <div className="text-center space-y-2 mb-8">
            <p className="text-xl md:text-2xl">
              Juliana Sánchez Yalí, Pablo A. Gutiérrez Sánchez, Mauricio A. Marín Montoya
            </p>
            <p className="text-lg md:text-xl opacity-90">
              Universidad Nacional de Colombia
            </p>
          </div>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div 
          className="relative bg-white rounded-lg shadow-xl overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Abstract
            </h2>
            
            <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                Tomato brown rugose fruit virus (ToBRFV), a member of the Tobamovirus genus, is an emerging virus that significantly 
                threatens global and fruit quality, making it one of the significant threats to tomato production today. A recent study detected 
                ToBRFV in nine tomato seeds imported from different markets in Colombia, but its presence in the field was not confirmed.
              </p>
              
              <p>
                Tomato crops from the Cundinamarca department was used to carry out a study in 2019 that included the collection of a total 
                of 26 samples from 26 different localities. Five samples from Sumapaz province (five collected from Fusagasugá) showed ToBRFV, 
                as indicated by reverse transcription PCR and high throughput sequencing (HTS), four collected from San Bernardino, and two 
                from the Oriente and Chipanque provinces.
              </p>

              <p>
                Additionally, HTS detected the presence of Tomato chlorosis virus, Cucumber mosaic virus, Southern tomato virus, Bell pepper 
                endornavirus, and Pepper mild mottle virus in some of the five samples. The complete genome sequences of the ToBRFV isolates 
                revealed high similarity and belonging to the global clade of ToBRFV sequences.
              </p>

              <p>
                Using a big-transformed gravity model, we also assessed the risk of ToBRFV cross-transmission between S. lycopersicum 
                and S. habrochaites accessions. Considering the findings, it is advised to keep an eye on and regularly check the National 
                Germplasm Bank of Colombia, which maintains tomato samples that might spread agricultural risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
