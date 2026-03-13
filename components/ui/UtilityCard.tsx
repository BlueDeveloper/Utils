import Link from 'next/link';

interface UtilityCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export default function UtilityCard({ title, description, href, icon = '🔧' }: UtilityCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}
