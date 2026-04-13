export interface Comment {
  id: string;
  author: string;
  publicationDate: string;
  content: string;
}

export const comments: Comment[] = [
  {
    id: '1',
    author: 'Omar Al-Faisal',
    publicationDate: '11.11.2024',
    content:
      "It's really interesting how the legal system continues to grapple with challenges surrounding trademark protection in the digital age. I hope these legal actions set new standards that help safeguard intellectual property while not stifling innovation.",
  },
  {
    id: '2',
    author: 'Abdullah Al-Mutairi',
    publicationDate: '11.11.2024',
    content:
      "Trademark disputes are becoming more frequent, especially with the rise of global brands and digital platforms. It will be interesting to see how these cases unfold and whether they'll impact international trademark laws.",
  },
  {
    id: '3',
    author: 'Fatima Al-Zahra',
    publicationDate: '12.11.2024',
    content:
      "As a small business owner, I'm particularly interested in how these regulations will affect local entrepreneurs. The balance between protection and accessibility is crucial for fostering innovation.",
  },
  {
    id: '4',
    author: 'Ahmed Al-Rashid',
    publicationDate: '13.11.2024',
    content:
      'The evolution from Saudi to Gulf systems shows the importance of regional cooperation in intellectual property. This unified approach will benefit all member countries.',
  },
];
