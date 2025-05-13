import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileCardProps {
  image: string;
  title: string;
  subtitle: string;
  country: string;
}

const ProfileCard = ({ image, title, subtitle, country }: ProfileCardProps) => {
  return (
    <div className="w-fit w-min-[200px] bg-gray-50 p-1 rounded-lg m-1 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 mb-3">
          {image ? (
            <AvatarImage src={image} alt={title} />
          ) : (
            <AvatarFallback>{title.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
          <div className="text-xs text-blue-600">{country}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 