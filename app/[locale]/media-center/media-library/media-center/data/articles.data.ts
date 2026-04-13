export interface Article {
  id: string;
  title: string;
  publishData: string;
  excerpt: string;
  categories: Array<{ id: string; name: string }>;
  image: string;
  content: string;
  author?: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Legal actions pending in trademarks',
    publishData: '11.11.2024',
    excerpt:
      'Regulating the substantive and formal provisions of trademarks is an important matter that should be taken into consideration and its details should be clarified.',
    categories: [
      { id: '1', name: 'Intellectual property' },
      { id: '2', name: 'Conferences' },
    ],
    image: '/images/photo-container.png',
    author: 'A. Hamed bin Mohammed Fayez',
    content: `
      <p>Regulating the substantive and formal provisions of trademarks is an important matter that should be taken into consideration and its details should be clarified; this is due to its connection to significant practical results and effects. Due to the importance of this matter, we have witnessed continuous developments in the legislation related to trademarks.</p>
      
      <h3>The Role of Registration in the Saudi Trademarks System</h3>
      <p>The registration of transactions on trademarks is one of the important issues that were previously implemented in the Saudi Trademarks System. The concept of registration was clarified through Article "Twenty-Nine" of this system, which stipulated that: "The ownership of a trademark may be transferred to others by any fact or transaction transferring ownership, and the transaction must be in writing...".</p>
      
      <h3>Advantages of Registering Trademark Transactions</h3>
      <p>Regulating the substantive and formal provisions of trademarks is an important matter that should be taken into consideration and its details should be clarified; this is due to its connection to significant practical results and effects. Due to the importance of this matter, we have witnessed continuous developments in the legislation related to trademarks.</p>
      
      <h3>The Role of Registration in the Saudi Trademarks System</h3>
      <p>The registration of transactions on trademarks is one of the important issues that were previously implemented in the Saudi Trademarks System. The concept of registration was clarified through Article "Twenty-Nine" of this system, which stipulated that: "The ownership of a trademark may be transferred to others by any fact or transaction transferring ownership, and the transaction must be in writing...".</p>
      
      <h3>Advantages of Registering Trademark Transactions</h3><p>Regulating the substantive and formal provisions of trademarks is an important matter that should be taken into consideration and its details should be clarified; this is due to its connection to significant practical results and effects. Due to the importance of this matter, we have witnessed continuous developments in the legislation related to trademarks.</p>
      
      <h3>The Role of Registration in the Saudi Trademarks System</h3>
      <p>The registration of transactions on trademarks is one of the important issues that were previously implemented in the Saudi Trademarks System. The concept of registration was clarified through Article "Twenty-Nine" of this system, which stipulated that: "The ownership of a trademark may be transferred to others by any fact or transaction transferring ownership, and the transaction must be in writing...".</p>
      
      <h3>Advantages of Registering Trademark Transactions</h3>
      <p>If we look at the importance of registration, we will find some of its inherent advantages, the most important of which is that by registering transactions on trademarks, the Authority can control some of the legal effects related to the transfer of ownership of trademarks, which may have an economic impact on the market.</p>
    `,
  },
  {
    id: '2',
    title: 'SAIP Launches New Initiative for IP Awareness',
    publishData: '14.12.2024',
    excerpt:
      'The Saudi Authority for Intellectual Property (SAIP) has announced a new nationwide initiative aimed at boosting public awareness about intellectual property rights.',
    categories: [
      { id: '3', name: 'Awareness' },
      { id: '4', name: 'Initiatives' },
    ],
    image: '/images/photo-container.png',
    author: 'Dr. Sarah Al-Rashid',
    content: `
      <p>The Saudi Authority for Intellectual Property (SAIP) has announced a new nationwide initiative aimed at boosting public awareness about intellectual property rights. This program will include workshops, seminars, and digital campaigns to educate individuals and businesses on the importance of protecting their innovations and creative works.</p>
      
      <h3>Goals of the Initiative</h3>
      <ul>
        <li>Increase understanding of patents, trademarks, and copyrights.</li>
        <li>Encourage innovation and creativity within the Kingdom.</li>
        <li>Provide resources for IP protection and enforcement.</li>
      </ul>
      
      <p>SAIP believes that a well-informed public is crucial for fostering a culture of innovation and ensuring economic growth. The initiative will target various segments of society, including students, entrepreneurs, and small and medium-sized enterprises (SMEs).</p>
    `,
  },
  {
    id: '3',
    title: 'Impact of AI on Intellectual Property Law',
    publishData: '13.12.2024',
    excerpt:
      'Artificial intelligence is rapidly transforming various industries, and its impact on intellectual property law is becoming a critical area of discussion for policymakers and legal experts.',
    categories: [
      { id: '5', name: 'AI' },
      { id: '1', name: 'Intellectual property' },
    ],
    image: '/images/photo-container.png',
    author: 'Prof. Ahmed Al-Zahrani',
    content: `
      <p>Artificial intelligence is rapidly transforming various industries, and its impact on intellectual property law is becoming a critical area of discussion for policymakers and legal experts. As AI systems become more sophisticated, questions arise regarding ownership of AI-generated content, patentability of AI inventions, and copyright protection for algorithms.</p>
      
      <h3>Challenges and Opportunities</h3>
      <p>One of the main challenges is determining who owns the intellectual property when an AI creates a new work or invention without direct human intervention. Current IP laws are primarily designed around human creators. However, AI also presents opportunities for faster innovation and more efficient IP management.</p>
      
      <p>SAIP is actively studying these developments to ensure that Saudi Arabia's IP framework remains robust and adaptable to technological advancements, supporting both innovation and fair protection.</p>
    `,
  },
  {
    id: '4',
    title: 'New Regulations for Digital Copyrights',
    publishData: '12.12.2024',
    excerpt:
      'In response to the growing digital economy, SAIP has introduced new regulations aimed at strengthening copyright protection for digital content creators and distributors.',
    categories: [
      { id: '6', name: 'Copyright' },
      { id: '7', name: 'Digital Economy' },
    ],
    image: '/images/photo-container.png',
    content: `
      <p>In response to the growing digital economy, SAIP has introduced new regulations aimed at strengthening copyright protection for digital content creators and distributors. These regulations address issues such as online piracy, unauthorized streaming, and the use of copyrighted material in digital platforms.</p>
      
      <h3>Key Provisions</h3>
      <ul>
        <li>Enhanced enforcement mechanisms for digital rights.</li>
        <li>Clearer guidelines for fair use and licensing in the digital space.</li>
        <li>Increased penalties for copyright infringement.</li>
      </ul>
      
      <p>The new framework is designed to foster a secure and equitable environment for digital content creation, ensuring that artists, authors, and developers receive due recognition and compensation for their work.</p>
    `,
  },
  {
    id: '5',
    title: 'Protecting Traditional Knowledge and Cultural Expressions',
    publishData: '11.12.2024',
    excerpt:
      'SAIP is exploring new avenues to protect traditional knowledge and cultural expressions, recognizing their immense value and the need to safeguard them from misappropriation.',
    categories: [
      { id: '8', name: 'Traditional Knowledge' },
      { id: '9', name: 'Culture' },
    ],
    image: '/images/photo-container.png',
    content: `
      <p>SAIP is exploring new avenues to protect traditional knowledge and cultural expressions, recognizing their immense value and the need to safeguard them from misappropriation. This includes indigenous arts, traditional crafts, folklore, and other forms of cultural heritage that are often passed down through generations.</p>
      
      <h3>Importance of Protection</h3>
      <p>Protecting traditional knowledge is vital for preserving cultural identity, promoting sustainable development, and ensuring that communities benefit from their heritage. SAIP is collaborating with cultural institutions and local communities to develop effective legal and administrative measures.</p>
      
      <p>This initiative aims to create a framework that respects customary laws and practices while integrating them into the national intellectual property system.</p>
    `,
  },
  {
    id: '6',
    title: 'The Future of Patenting in Biotechnology',
    publishData: '10.12.2024',
    excerpt:
      'Biotechnology is a rapidly evolving field, and the patent landscape for biotechnological inventions is constantly shifting. SAIP is adapting its policies to support innovation in this critical sector.',
    categories: [
      { id: '10', name: 'Biotechnology' },
      { id: '11', name: 'Patents' },
    ],
    image: '/images/photo-container.png',
    content: `
      <p>Biotechnology is a rapidly evolving field, and the patent landscape for biotechnological inventions is constantly shifting. SAIP is adapting its policies to support innovation in this critical sector. This includes addressing challenges related to gene patents, personalized medicine, and synthetic biology.</p>
      
      <h3>Policy Adjustments</h3>
      <ul>
        <li>Streamlining the patent application process for biotech innovations.</li>
        <li>Providing clear guidelines on patent eligibility for biological materials.</li>
        <li>Encouraging research and development through robust patent protection.</li>
      </ul>
      
      <p>SAIP is committed to fostering an environment that encourages groundbreaking research in biotechnology, ensuring that Saudi Arabia remains at the forefront of scientific and medical advancements.</p>
    `,
  },
  {
    id: '7',
    title: 'Understanding Geographical Indications for Saudi Products',
    publishData: '09.12.2024',
    excerpt:
      'Geographical Indications (GIs) are a powerful tool for protecting products that have a specific geographical origin and possess qualities or a reputation due to that origin.',
    categories: [
      { id: '12', name: 'Geographical Indications' },
      { id: '13', name: 'Local Products' },
    ],
    image: '/images/photo-container.png',
    content: `
      <p>Geographical Indications (GIs) are a powerful tool for protecting products that have a specific geographical origin and possess qualities or a reputation due to that origin. SAIP is working to raise awareness about GIs among Saudi producers, particularly for traditional agricultural products and handicrafts.</p>
      
      <h3>Benefits of GIs</h3>
      <ul>
        <li>Enhance product reputation and market value.</li>
        <li>Protect against counterfeiting and unfair competition.</li>
        <li>Promote rural development and preserve traditional practices.</li>
      </ul>
      
      <p>By registering GIs, Saudi producers can better market their unique products globally, ensuring their authenticity and quality are recognized and protected.</p>
    `,
  },
  {
    id: '8',
    title: 'The Role of IP in Economic Diversification',
    publishData: '08.12.2024',
    excerpt:
      "Intellectual property plays a crucial role in Saudi Arabia's Vision 2030, supporting economic diversification by fostering innovation, attracting investment, and building a knowledge-based economy.",
    categories: [
      { id: '14', name: 'Economy' },
      { id: '15', name: 'Vision 2030' },
    ],
    image: '/images/photo-container.png',
    content: `
      <p>Intellectual property plays a crucial role in Saudi Arabia's Vision 2030, supporting economic diversification by fostering innovation, attracting investment, and building a knowledge-based economy. SAIP is at the forefront of these efforts, developing policies and services that encourage the creation, protection, and commercialization of intellectual assets.</p>
      
      <h3>Strategic Importance</h3>
      <p>A strong IP system is essential for:</p>
      <ul>
        <li>Stimulating research and development.</li>
        <li>Facilitating technology transfer.</li>
        <li>Enhancing the competitiveness of Saudi businesses.</li>
      </ul>
      
      <p>Through strategic partnerships and continuous improvement of the IP ecosystem, SAIP is contributing significantly to the Kingdom's economic transformation and global standing.</p>
    `,
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}
