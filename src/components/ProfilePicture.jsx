import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarIcon } from "@radix-ui/react-icons";

export function ProfilePicture({ image, className }) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={image}
        alt="Profile Picture"
        className="object-cover"
      />
      <AvatarFallback
        className={`bg-white border border-neutral-200 ${className}`}
      >
        <AvatarIcon className="text-neutral-300 size-2/3" />
      </AvatarFallback>
    </Avatar>
  );
}
