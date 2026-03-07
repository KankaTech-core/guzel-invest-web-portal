export const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/guzelinvest",
    instagramDm: "https://ig.me/m/guzelinvest",
    youtube: "https://www.youtube.com/@G%C3%9CZEL%C4%B0NVEST",
    facebook: "https://www.facebook.com/guzelinvestalanya",
} as const;

export const SOCIAL_LINK_ITEMS = [
    { key: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram },
    { key: "youtube", label: "YouTube", href: SOCIAL_LINKS.youtube },
    { key: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook },
] as const;

export type SocialLinkKey = (typeof SOCIAL_LINK_ITEMS)[number]["key"];
