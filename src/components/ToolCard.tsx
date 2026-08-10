import { Link } from 'react-router-dom';
import { ToolInfo } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  tool: ToolInfo;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = (Icons[tool.icon as keyof typeof Icons] || Icons.FileQuestion) as LucideIcon;

  return (
    <Link
      to={tool.path}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
