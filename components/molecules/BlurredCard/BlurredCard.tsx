import Card from '@/components/molecules/Card';
import CardContent from '@/components/atoms/CardContent';
import { BlurredCardProps } from './BlurredCard.types';

export const BlurredCard = ({
  title,
  description,
  className,
  variant,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: BlurredCardProps) => {
  return (
    <Card variant={variant || 'blurred'} className={className}>
      <CardContent
        title={title}
        titleSize="lg"
        description={description}
        className={contentClassName}
        titleClassName={titleClassName}
        descriptionClassName={descriptionClassName}
      />
    </Card>
  );
};
