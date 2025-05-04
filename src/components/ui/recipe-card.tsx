
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  difficulty: string;
  description: string;
}

export function RecipeCard({ id, title, image, prepTime, difficulty, description }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${id}`} className="group block">
      <div className="overflow-hidden rounded-md">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {prepTime}
            </span>
            <span>•</span>
            <span>{difficulty}</span>
          </div>
          <h3 className="text-xl font-medium group-hover:text-bakery-700 transition-colors">{title}</h3>
          <p className="mt-1 text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
