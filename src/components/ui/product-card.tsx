
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <div className="group">
      <Link to={`/shop/${id}`} className="block overflow-hidden rounded-md">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="mt-3 flex justify-between">
        <div>
          <Link to={`/shop/${id}`}>
            <h3 className="font-medium text-lg group-hover:text-bakery-700 transition-colors">{name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">₹{price.toFixed(2)}</p>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full mt-1" title="Add to cart">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
