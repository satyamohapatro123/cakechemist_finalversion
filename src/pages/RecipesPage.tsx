
import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { RecipeCard } from "@/components/ui/recipe-card";

interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  difficulty: string;
  description: string;
  ingredients?: string[];
  instructions?: string[];
  cookTime?: string;
  servings?: number;
  category?: string;
  videoUrl?: string;
}

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load recipes from localStorage
    const loadRecipes = () => {
      setIsLoading(true);
      const storedRecipes = localStorage.getItem('recipes');

      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      } else {
        // Fallback to sample recipes if none in localStorage
        const sampleRecipes = [
          {
            id: "1",
            title: "Classic Chocolate Chip Cookies",
            image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
            prepTime: "45 min",
            difficulty: "Easy",
            description: "Crispy on the outside, chewy on the inside chocolate chip cookies that are perfect for any occasion."
          },
          {
            id: "2",
            title: "Artisan Sourdough Bread",
            image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
            prepTime: "24 hours",
            difficulty: "Advanced",
            description: "A classic sourdough bread with a crispy crust and soft interior. Requires time and patience but worth the effort."
          },
          {
            id: "3",
            title: "Lemon Blueberry Muffins",
            image: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?q=80&w=1000&auto=format&fit=crop",
            prepTime: "40 min",
            difficulty: "Easy",
            description: "Bursting with fresh blueberries and zesty lemon, these muffins are the perfect breakfast treat."
          },
          {
            id: "4",
            title: "French Macaron Cookies",
            image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1000&auto=format&fit=crop",
            prepTime: "2 hours",
            difficulty: "Intermediate",
            description: "Delicate almond meringue cookies with a smooth ganache filling. A classic French patisserie favorite."
          },
          {
            id: "5",
            title: "Cinnamon Rolls",
            image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format&fit=crop",
            prepTime: "3 hours",
            difficulty: "Intermediate",
            description: "Soft, fluffy cinnamon rolls topped with a rich cream cheese frosting. The ultimate comfort food."
          },
          {
            id: "6",
            title: "Buttery Croissants",
            image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1000&auto=format&fit=crop",
            prepTime: "12 hours",
            difficulty: "Advanced",
            description: "Flaky, buttery French croissants with dozens of delicate layers. A true labor of love."
          }
        ];
        setRecipes(sampleRecipes);
        // Save sample recipes to localStorage
        localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
      }
      setIsLoading(false);
    };

    loadRecipes();

    // Listen for recipe updates
    const handleRecipesUpdated = () => {
      console.log("Recipes updated event received");
      loadRecipes();
    };

    window.addEventListener('recipesUpdated', handleRecipesUpdated);

    return () => {
      window.removeEventListener('recipesUpdated', handleRecipesUpdated);
    };
  }, []);

  return (
    <main>
      {/* Recipes Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Bakery Recipes"
            subtitle="Try our favorite recipes at home"
            center
          />
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No recipes found.</p>
              <p className="text-muted-foreground mt-2">Check back later for delicious recipes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  prepTime={recipe.prepTime}
                  difficulty={recipe.difficulty}
                  description={recipe.description}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default RecipesPage;
