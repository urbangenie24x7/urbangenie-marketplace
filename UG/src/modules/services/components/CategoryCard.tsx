import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  gradient: string;
}

const CategoryCard = ({ title, description, icon: Icon, link, gradient }: CategoryCardProps) => {
  return (
    <Link to={link}>
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-200 p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <Icon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
