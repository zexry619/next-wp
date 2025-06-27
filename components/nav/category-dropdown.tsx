import Link from "next/link";
import { getAllCategories } from "@/lib/wordpress";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export async function CategoryDropdown() {
  const categories = await getAllCategories();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 w-48">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    className="block text-sm px-2 py-1 hover:underline"
                    href={`/posts?category=${cat.id}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
