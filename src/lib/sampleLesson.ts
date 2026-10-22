import { Lesson } from './types';

export const SAMPLE_PHOTOSYNTHESIS_LESSON: Lesson = {
  id: 'lesson-photosynthesis-demo',
  title: 'Photosynthesis: How Plants Make Food and Oxygen',
  subject: 'Life Science & Biology',
  gradeLevel: 'Grade 6 - 8',
  description: 'An essential biological process where autotrophs capture solar radiant energy to synthesize glucose and release molecular oxygen.',
  isSample: true,
  sourceFilename: 'Biology_Unit4_Photosynthesis.pdf',
  processingStatus: 'ready',
  createdAt: '2026-10-22T10:00:00Z',
  updatedAt: '2026-10-22T10:30:00Z',
  sourceText: `Photosynthesis is a fundamental biological reaction conducted by plants, algae, and certain cyanobacteria. During this enzymatic cascade, photoautotrophs assimilate inorganic carbon dioxide (CO2) from the atmosphere and water (H2O) transported from roots through vascular xylem tissues. 

Using chlorophyll pigments contained inside chloroplast thylakoid membranes, photons of light are captured. This biochemical transducer converts radiant solar energy into chemical energy stored within covalent bonds of glucose (C6H12O6). 

The overall balanced chemical equation is:
6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2

The process operates via two coupled stages:
1. The Light-Dependent Reactions: Taking place across the thylakoid membrane, light splits water molecules (photolysis), liberating free oxygen gas (O2) into the atmosphere while producing ATP and NADPH.
2. The Calvin Cycle (Light-Independent Reactions): Occurring in the chloroplast stroma, enzymatic fixations incorporate carbon dioxide into three-carbon sugars which coalesce into glucose.

Without photosynthesis, aerobic organisms would deplete atmospheric oxygen, and terrestrial trophic pyramids would collapse due to the loss of primary biomass producers.`,

  simplifiedText: {
    foundational: `Plants are amazing nature-factories! Just like you eat food to get energy, plants make their own food through a process called Photosynthesis.

Here is what plants need:
1. Sunlight: Captured by the green color (chlorophyll) in plant leaves.
2. Water: Sucked up from the soil through the roots.
3. Air: They breathe in a gas called carbon dioxide.

Here is what plants produce:
1. Glucose (Sugar): This is food that helps the plant grow big and strong.
2. Oxygen: This is fresh, clean air that humans and animals breathe every day!

Simple Formula:
Sunlight + Water + Carbon Dioxide = Plant Food (Sugar) + Oxygen to breathe!`,
    intermediate: `Photosynthesis is the process green plants use to convert sunlight into food energy. 

Plants absorb water from the soil through their roots and carbon dioxide from the surrounding air through microscopic pores in their leaves called stomata. Special green structures inside plant cells, called chloroplasts, contain chlorophyll which captures solar energy.

In this reaction:
- Water and carbon dioxide are combined using sunlight.
- The plant produces glucose (a sugar used for energy and growth).
- Oxygen is released into the atmosphere as a byproduct.

This reaction is crucial for all life on Earth because it produces the oxygen we breathe and provides the base of our global food chain.`
  },

  translations: {
    hi: `प्रकाश संश्लेषण (Photosynthesis) वह मूलभूत जैविक प्रक्रिया है जिसके द्वारा हरे पौधे, शैवाल और कुछ जीवाणु सूर्य के प्रकाश से अपना भोजन स्वयं बनाते हैं।

पौधों को निम्नलिखित घटकों की आवश्यकता होती है:
1. कार्बन डाइऑक्साइड (CO2): हवा से पत्तियों के रंध्रों (स्टोमेटा) द्वारा ली जाती है।
2. जल (H2O): जड़ों द्वारा मिट्टी से अवशोषित किया जाता है।
3. सूर्य का प्रकाश: पत्तियों में मौजूद हरे वर्णक 'क्लोरोफिल' द्वारा सोखा जाता है।

रासायनिक समीकरण:
6CO2 + 6H2O + सौर ऊर्जा -> C6H12O6 (ग्लूकोज/शर्करा) + 6O2 (ऑक्सीजन)

इस प्रक्रिया के मुख्य दो चरण हैं:
1. प्रकाश-निर्भर अभिक्रियाएं: थाइलाकोइड झिल्ली में होती हैं, जहां जल का विखंडन होता है और ऑक्सीजन मुक्त होती है।
2. केल्विन चक्र (प्रकाश-अंधकार अभिक्रियाएं): स्ट्रोमा में होती हैं, जहां कार्बन डाइऑक्साइड से ग्लूकोज का निर्माण होता है।

प्रकाश संश्लेषण के बिना पृथ्वी पर जीवन संभव नहीं है, क्योंकि यह हमें सांस लेने के लिए प्राणवायु (ऑक्सीजन) और संपूर्ण खाद्य श्रृंखला का आधार प्रदान करता है।`,
    es: `La fotosíntesis es el proceso biológico mediante el cual las plantas, algas y ciertas bacterias transforman la luz solar en energía química (glucosa), liberando oxígeno a la atmósfera. Requiere agua, dióxido de carbono y clorofila.`
  },

  diagrams: [
    {
      id: 'diag-photo-1',
      title: 'Solar Energy Influx & Chloroplast Gas Exchange Cycle',
      altText: 'Diagram of a green leaf illustrating sunlight, carbon dioxide, and water entering, while oxygen and glucose emerge.',
      detailedDescription: `The visual schematic depicts a cross-section of a green plant leaf undergoing photosynthesis under clear daylight.
1. Top Left: A bright yellow sun radiates energy downward with arrows pointing toward the leaf surface labeled 'Radiant Solar Energy'.
2. Left Margin: Blue droplet arrows signify water (H2O) entering from subterranean roots traveling upward through the stem.
3. Front Edge: Atmospheric arrows labeled 'CO2 (Carbon Dioxide)' enter small openings representing stomata on the underside of the leaf.
4. Center: An enlarged callout circle reveals an individual plant cell containing oval green chloroplasts with stacked thylakoid membranes.
5. Right Margin: Large crisp arrows emerge out of the leaf: white/blue arrows indicating 'O2 (Oxygen gas)' vented outward into the sky, and amber crystalline representations symbolizing 'C6H12O6 (Glucose / Stored Sugar)' distributing nourishment through phloem veins.`,
      keyVisualElements: [
        'Inputs shown: Sunlight (Top), Carbon Dioxide CO2 (Side), Water H2O (Roots)',
        'Reaction Center: Chloroplast containing Chlorophyll pigments',
        'Outputs shown: Molecular Oxygen O2 (Released to air), Glucose C6H12O6 (Stored energy)'
      ],
      scientificInterpretation: 'This illustration visually confirms the law of conservation of mass: inorganic raw materials (6 CO2 molecules and 6 H2O molecules) reconfigure under electromagnetic radiation into 1 high-energy glucose sugar molecule and 6 breathable diatomic oxygen molecules.'
    }
  ],

  quiz: [
    {
      id: 'q1',
      question: 'What primary green pigment inside plant leaves absorbs sunlight for photosynthesis?',
      options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotenoid'],
      correctIndex: 1,
      explanation: 'Chlorophyll is the specialized green pigment found inside chloroplasts that absorbs red and blue wavelengths of sunlight.'
    },
    {
      id: 'q2',
      question: 'Which gas is absorbed by plants from the air to perform photosynthesis?',
      options: ['Nitrogen gas', 'Carbon dioxide (CO2)', 'Helium', 'Argon'],
      correctIndex: 1,
      explanation: 'Plants take in carbon dioxide (CO2) from the surrounding atmosphere through microscopic leaf pores called stomata.'
    },
    {
      id: 'q3',
      question: 'What vital gas do plants release into the atmosphere as a byproduct of splitting water?',
      options: ['Methane', 'Oxygen (O2)', 'Chlorine', 'Sulfur dioxide'],
      correctIndex: 1,
      explanation: 'During the light-dependent reactions, water molecules (H2O) are split, which releases molecular oxygen (O2) into the air for aerobic life.'
    },
    {
      id: 'q4',
      question: 'What form of stored chemical energy (sugar) is manufactured during the Calvin Cycle?',
      options: ['Glucose (C6H12O6)', 'Lactose', 'Sodium Chloride', 'Hydrochloric Acid'],
      correctIndex: 0,
      explanation: 'Glucose is the simple sugar synthesized by plants to provide metabolic fuel and cellular structure like cellulose.'
    },
    {
      id: 'q5',
      question: 'Where do the light-independent reactions (Calvin cycle) occur within the chloroplast?',
      options: ['In the cell nucleus', 'In the stroma fluid', 'Outside the cell membrane', 'Inside the root hairs'],
      correctIndex: 1,
      explanation: 'The light-independent reactions take place in the stroma, the aqueous enzymatic fluid surrounding the thylakoid membranes inside the chloroplast.'
    }
  ],

  transcript: {
    fullText: 'Welcome to our lesson on Photosynthesis. Have you ever wondered where plants get their food? Unlike animals who must find food to eat, plants make their own! In this audio guide, we follow water rising up from the damp soil, carbon dioxide entering the leaves, and sunshine activating green chlorophyll cells to create nourishing sugar and pure oxygen for our planet.',
    captions: [
      { start: 0, end: 5, text: 'Welcome to our lesson on Photosynthesis.' },
      { start: 5, end: 11, text: 'Plants absorb water through roots and carbon dioxide from the surrounding air.' },
      { start: 11, end: 18, text: 'Green chlorophyll captures sunlight to synthesize glucose and release oxygen.' },
      { start: 18, end: 26, text: 'This essential biochemical cycle sustains aerobic life on planet Earth.' }
    ]
  }
};
