'use client';

import Card from '@/components/molecules/Card';
import CardContent from '@/components/atoms/CardContent';

export const MissionVisionCard = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <Card variant="mission" shadow border={false}>
        <CardContent
          title="Mission"
          titleSize="sm"
          description="We strive to maximize the value of IP and excel in service delivery by cooperation with our partners to drive the national economy."
        />
      </Card>

      <Card variant="mission" shadow border={false}>
        <CardContent
          title="Vision"
          titleSize="sm"
          description="To enable a vibrant IP ecosystem locally and globally."
        />
      </Card>
    </div>
  );
};
