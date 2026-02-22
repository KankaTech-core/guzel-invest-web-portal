import {
    Bath,
    BadgeCheck,
    BedDouble,
    Bike,
    Building,
    Building2,
    Bus,
    Camera,
    Car,
    CircleParking,
    Clock3,
    Coffee,
    Dumbbell,
    Flower2,
    Footprints,
    Hospital,
    House,
    Landmark,
    LucideIcon,
    MapPin,
    Phone,
    PlayCircle,
    School,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    SquareParking,
    Store,
    Sun,
    TreePine,
    Trees,
    UtensilsCrossed,
    Video,
    Waves,
    Wifi,
} from "lucide-react";
import {
    isCustomProjectIconDataUri,
    normalizeProjectIcon,
    ProjectIconName,
} from "@/lib/project-icon-catalog";

const ICON_COMPONENTS: Record<ProjectIconName, LucideIcon> = {
    Building2,
    BedDouble,
    Bath,
    Trees,
    ShieldCheck,
    Car,
    Dumbbell,
    Waves,
    MapPin,
    Sun,
    Flower2,
    Sparkles,
    School,
    Hospital,
    ShoppingBag,
    Store,
    Bus,
    Bike,
    UtensilsCrossed,
    Coffee,
    Wifi,
    Camera,
    Video,
    PlayCircle,
    CircleParking,
    Landmark,
    Building,
    House,
    SquareParking,
    TreePine,
    Footprints,
    Phone,
    Clock3,
    BadgeCheck,
};

interface ProjectIconProps {
    name: string;
    className?: string;
}

export function ProjectIcon({ name, className }: ProjectIconProps) {
    const normalized = normalizeProjectIcon(name);
    if (isCustomProjectIconDataUri(normalized)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={normalized} alt="" className={className} loading="lazy" />;
    }

    const Icon = ICON_COMPONENTS[normalized as ProjectIconName] || Building2;
    return <Icon className={className} />;
}
