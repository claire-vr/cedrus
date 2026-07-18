import type { Item } from '@/types/types';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Badge type={item.type} />
      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
        {item.english}
      </h3>
      <p className="mt-2 text-lg text-gray-500">{item.lebanese}</p>
    </Card>
  );
}
