'use client';

import Card from '@/components/molecules/Card';
import CardContent from '@/components/atoms/CardContent';
import Button from '@/components/atoms/Button';
import ArrowWide from '@/public/icons/arrows/ArrowWide';

interface DigitalGuideCard {
  title: string;
  description: string;
  href: string;
}

interface DigitalGuideCardsProps {
  cards: DigitalGuideCard[];
  goToLabel: string;
}

export default function DigitalGuideCards({ cards, goToLabel }: DigitalGuideCardsProps) {
  return (
    <>
      {cards.map(({ title, description, href }) => (
        <Card
          className="grid gap-6 xl:shadow-card xl:border-none max-w-full p-6 rounded-2xl xl:min-h-[234px]"
          key={title}
        >
          <CardContent
            title={title}
            description={description}
            className="space-y-2"
            titleSize="sm"
            titleClassName="font-medium text-text-default"
          />
          <Button
            ariaLabel={goToLabel.replace('{title}', title)}
            href={href}
            intent="secondary"
            className="justify-self-end h-10 w-20 px-4"
          >
            <ArrowWide direction="right" size="smallWide" background="natural" shape="square" />
          </Button>
        </Card>
      ))}
    </>
  );
}
