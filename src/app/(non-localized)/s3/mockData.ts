export interface S3ProjectData {
    hero: {
        yearRange: string;
        title: string;
        description: string;
        bgImage: string;
        liveTradingText: string;
        id: string;
    };
    propertiesRibbon: {
        icon: string;
        label: string;
        value: string;
        highlight?: string;
    }[];
    summary: {
        title: string;
        subtitle: string;
        description: string;
        tags: string[];
    };
    promotionalVideo: {
        bgImage: string;
        title: string;
        subtitle: string;
    };
    exteriorVisuals: {
        title: string;
        images: { src: string; alt: string; label?: string }[];
    };
    socialFacilities: {
        title: string;
        facilities: { icon: string; name: string; desc: string; colorClass: string }[];
        image: string;
    };
    interiorVisuals: {
        title: string;
        images: { src: string; label: string }[];
    };
    floorPlans: {
        title: string;
        plans: {
            type: string;
            details: string;
            status: string;
            image: string;
            soldOut?: boolean;
        }[];
    };
    documentCta: {
        title: string;
        description: string;
    };
    sidebar: {
        maps: { image: string; label: string; grayscale?: boolean }[];
        interactiveMapImage: string;
        locationDetails: {
            title: string;
            distance: string;
            tags: string[];
        };
        otherProjects: {
            title: string;
            location: string;
            price: string;
            trend: string;
            trendColor: string;
        }[];
    };
}

export const s3Data: S3ProjectData = {
    hero: {
        yearRange: "2022 - 2027",
        title: "Proje Başlığı",
        description: "A premium investment opportunity in the heart of the financial district, offering high-yield returns.",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo7LvFTlmoE1Pxn_h7yNKYuhnXEZBw86qdTlQa_w0h-aYCMylTtxerYrWgREAAevMnEjSDQs7qFnPXh4GnXlJViJKNQnX0q0lAdBAbtKIzk7Mij0e3qwmV8kAK9v8lXxUK7Uh30lxYcrkQA7V07UsWP0Z6p_hiPTaOtaZD4aVipQXuC2fOokCy-Rij4aag4OAYrDRJdTx3NGu8apCKm7zWNuQewzIL2yINJKXOcZFHIJG23ynoXMWDWMWE4RZ44e8r92kYEGW4eR4",
        liveTradingText: "LIVE TRADING",
        id: "#TK-8821"
    },
    propertiesRibbon: [
        { icon: "SquareFoot", label: "Total Area", value: "12,500 m²" },
        { icon: "Building2", label: "Total Units", value: "450" },
        { icon: "Calendar", label: "Delivery", value: "Q4 2024" },
        { icon: "TrendingUp", label: "Avg. ROI", value: "8.5%", highlight: "+1.2%" },
        { icon: "MapPin", label: "Location", value: "Istanbul, TR" }
    ],
    summary: {
        title: "Project Summary",
        subtitle: "FinEstate Premium Tier • Series A",
        description: "Situated in the rapidly developing sector of Istanbul, Proje Başlığı represents a pinnacle of modern mixed-use architecture. The project integrates commercial viability with high-end residential comfort, ensuring consistent demand and appreciation.",
        tags: ["LEED Certified", "Smart Home", "24/7 Security"]
    },
    promotionalVideo: {
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPK6J14lCz9jrfdGI2Ig4zQ9K2EfXYCJLkmxP_KtMqylgiygC4CUY4MYUKFDAiFHESt_rAuvmH47BRzFUW_kdSfQ-98Ed4SyRUazOflcZ7i06caqewFvuPBzxpJEI_2QUch7xw8ZHDF5gsx3zFCYLYHdp6lmfZtB5OfSK2ZEHFk4GXkR8vbHXtSqHR5qaD8p2qdmEKwCjMItPCajT0xjSCrHSUnHUwzgJFcp0CH1l40kuGtDnMDv0uid97DX2zScU3TAHeTwsSLzg",
        title: "Experience the Future",
        subtitle: "Watch Video",
    },
    exteriorVisuals: {
        title: "Projenin Vaziyet Planı ve Dış Görselleri",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYmWzBw9BHMk0NjnXMFW1OaWRPbb8AggOyz78Irsfy7e9Nrw_Y1MAahGzeAzEQV--pU8oCK4eHiqJp6L-95eiZE8z5e-Z_9G4mInOX-kZdFs4WKOyPPMDGmfuBXlvi39K04H_ZBva-FXshLi98ghwAV0h_OkzF160z7hm33qqtHeqZ0LLRZFpLEP7mQnnRqNEj92yDCkHIuaPNZLZttPmo2t9bbLmwzyXbQnaAIJEvcL65DFkvubq4SbyLwsEe1_yPxOuJiVdhsVQ", alt: "Front Facade", label: "Front Facade" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6ImQA8JGJop0rHU-XrbOXtRIuIUkF_ct1dHRZ9I3nd2bRCI6TcVWydv2cqo6IgJBxVQSC0Xlj2MDFFSOU7hPzn8whtt5oLPhqDYA2iPj-Xe0d2ABY2k7JCWRP7375LIJLkqGFsOB9ocmOF9-ybFcewZWFksK98-dyqXGzFQjmJmIjhLx7bTlDlpQhxBC44TK_IFot6rQRbHKCnYXhh7Fn4qBxmkYucWdebqsHmjNVdnwwm5bcAls58tN8qEmpHItJcV07Wdy3MZs", alt: "Pool area exterior" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZJhnjtMjYFDPpvLZ7E5gxwj8ieGqCDDmriFC7JcFdXgEpYxCi-JihQlJ5ImAaQdSNtbuC3a3jMFT47yv27RDeR_bxPnBMAt9gdFKXScGQ3T8WwQiDuH51cMINk3eTm5SV7VjmwpubBJVEfFtNK895KmmvAxfIP8qnsgcypOm_V0us360lxlVAx28-MGXzAAVTFxSDqQUepK4p_6SAkvML6RzOpsQQTUxQUXmyDsREJfXKRSM6wcEJpjHDvJA-C97wKq9Yip3aE38", alt: "Entrance garden" }
        ]
    },
    socialFacilities: {
        title: "Social Facilities",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN1Ae5LwdVZVd50wAP_cGOgVYK6N2xso-HwNpuIU87ENtcgMQLxwt2NdT7GKbMEEjhUTDWcTyWsiBm-IYO5p3kx3kR9Oj0LI8ttMOgKXqG3kzZl_xh9E0EXYeTMdjDzO-yC3ffqzbPiuz-hd1Y6-FmQR5s6O_SU1HmLgmzNua3hbv1Si4I3FyNMq4dAEDhfL-vPJrOH9aSYUDKonQ4enEE2bPaPw6NeSsCCkf-eDW38rxoWtLIr5nDkv4MRz3sjEB6Wl6Gj_8zJ_0",
        facilities: [
            { icon: "Waves", name: "Olympic Swimming Pool", desc: "Indoor & Outdoor access", colorClass: "text-blue-600 bg-blue-50" },
            { icon: "Dumbbell", name: "Fitness Center", desc: "Technogym equipment", colorClass: "text-orange-600 bg-orange-50" },
            { icon: "Sparkles", name: "Spa & Wellness", desc: "Sauna, Steam Room, Massage", colorClass: "text-purple-600 bg-purple-50" },
            { icon: "TreePine", name: "Private Gardens", desc: "2,000m² Landscaped area", colorClass: "text-green-600 bg-green-50" }
        ]
    },
    interiorVisuals: {
        title: "Projenin İç Görselleri",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz8bCmp54H7JD-aQXmbVnArftpWQCN693tLf8U64zETxNoAL9XRUdEkTBV94-OX-IBEltiaDgfnAp0KSwSF8MtuBH-Snc9pTUaiOKGrzRKsW6wwCm_9j1nKUJaRagOkxnYJQY7khQwkCXuQsMiddnrcZZEyjWX0Qt-dIMrVtUyYHh54pYDxdkF6DHoyM7CcByY-lzcUGtNNq7VuLAx1f-A3pfBuSHgyuTBwoMejZOJaXMyJAYUg8FWPfXYTrFSIqvpSp00E2pe81U", label: "Living Room" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlBysXWNDVJZyMjlrZTAkTqzHeRj4CNvN8GCv55yGZojL2x0FZBrWUE-9X3boRHBtAyicVAykLi-kl9XrkAG-oOtVv_e2cq8MEOVSurohr_5QTP-gfNuZ8TUZnaSLnnCe7qZnSB5rJNwvjS8GUDGNMq_AoYznH1TQwrqiAwz7dzlqGku-nK1Bjr1XPaNgFLKampJmNo5WlLDgMjOoyzP-NfqiFODku1lbNIaY3UsZFFBQlWg34nE4UCzPOuB4_9fmIe94LtZPIKEQ", label: "Open Kitchen" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuJkZKwdBINI-CPQTtezIGFT99fCQkkuMJe6SKuPmq9ghxemb-XEX_GFZFBjniyUvyErMLgCO-cw3d6ipeqBOQ_4dS3TqwbmrtENwK6FwzUmyyOx51rtqLHKrf6DsTDSfl6CfG3iyJmp3ucSvg1A0jL7_EXpFT7mJVMYlbD7Enx5cHsFAkb27Y2xr_YIAkx4YWc6GwXmvxVJ_xWsednN_zddvdLqSQQ1-SCUa92g2y51oE0tVBlafSYmvstQdWSVs5xkRG9ibgXqk", label: "Master Bath" }
        ]
    },
    floorPlans: {
        title: "Floor Plans",
        plans: [
            {
                type: "Type A - 2+1",
                details: "115 m² Net | South Facing",
                status: "Available",
                soldOut: false,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHj_xTKDQceskWhvQYWXN9ydsUoZNZaVhxVsVOqA8AERf-mdy8mTVEKdjirO4wAV5QDtbrP2y7XQcGM9xEYj_qRy7Pk_LrDdjSNzW4wCK-BXm3sj4s7Kob3ogFih5OVkwindpO4oSM74VKArNIiPln-02JckjLsd3_9IhaXWQKVhoQbE2wCU5aDW4YSc5U4qgwTrMUbWHllN19rQliuxDmULihHtEjpdGV89RTPOT30itkfooIxkjaj9BLRfAHHCH9YCSS1dnKanc"
            },
            {
                type: "Type B - 3+1",
                details: "145 m² Net | Corner Unit",
                status: "Sold Out",
                soldOut: true,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7VR0LrE5_JCL37eycvIZlnT70RbPKmj2WdVyJTDz0qYLKmhpiBlZF5eNPf4L_LQEgXCze_acfPYheZxCntVK3uTUUXOGDOhS52zKS8cbJ8CV9lm0MeNpfXG_Gvit_OxHNbFnioLBMtF0JmFdSfnW0-h5ydk4nQQnT3xL87qQJMXmYJ-WJsdB1gfEzPaQHBVunbg4gAxdGFUTDYdaLAcg9MpfRLploN2M0n2rbAH_nxFFTRSPOA-RlszU6c-R4BSwNrGWhokjtnd0"
            }
        ]
    },
    documentCta: {
        title: "Investment Documentation",
        description: "Access detailed financial reports, legal compliance documents, and the full project prospectus."
    },
    sidebar: {
        maps: [
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALD6O9M7KEfF4MWFKSbAWxtFvcfAevJ1pZ88Qf_79T87XS-Y_-3ZKlZTa3GBcDY9bRReO6OVXjtesL1G5DFjgCqa_DkxaeWWesnoFKeMY7yZo_v3vcmTlSlyPfW1DYqegtbrY8pD10GdL3mZbK_kLmxVoKCujgHLz15dQMLyZ3Hhljfi62aIb6rWVhEhKthl3kiAXdt4GvSge4hkndUnDZz8KuNdvOh_gqBupIO28wnPmMDkxr0E6yCSiWsJI7SFG2QZfWAUvJ94s", label: "Street" },
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD5oUBxG9NxZBVo-q0cYWgnw0972pqnXJyPPXeSK0W0Jrq8eSgvlf4jy0TEaxNDQF2gI1eZV6KljDJMG1rZPw07NJgojChOsBRS0sAI_33hztbMvnJKcMjb-MYBZfVL3dn5lF64y5T0goyXDCK1uf6t8F8sZYRwgbt01CJFnE3u4z9498JipYCJ_2eb7EF6zo0bSmVtbQPRPkUtovr1d7fcQbVBfssRP5cdw1-MrPV51nzswKRxoeVyCon3vLPITHU8pqaUxddWHE", label: "Satellite" },
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwgLJFF822XlaXyryLhKgEO5YozaqE9zLlkmsE5Bq7g39cSp5b3jhKeSM8C4vo0Gfs0nPaXWVu7phmoQIaxMHZNFz-M84DaPHmteJpzhelg1ipwtDL59yuG3ToTnKDssS73MM08pWkPEeH-kX4nuoEm-PaXbfSI6nIyrULguorVZ7KxkG7FwwFAUiHhuSUkDPd9UNkcU-XF45t88JnrjBCv8m8orfy47VmgnptG-A9LkFctkE8E_uVSC9tpvqrJz-IsdoEt6d3Zpo", label: "Transit", grayscale: true }
        ],
        interactiveMapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp-i7mQY2cbqL7N7X2oMlBQtP18xngKlsOmZq01OaRZhCszjowlJ9k6z0LfEpixukLu-JqorF5e3yi7KgHa1l2CcVtPkIPjoJAyBn2Gnu1avccBktF2U--j97aLb_uNWOtQaO5M1boxn1AqmCwDMelmeFBsUSS7u7YODtHgsjPQ_M-nbseXGMu_68lctAScSKSmB9w2-d_6ZXQWGYLDdarj5ooW022HlxTZcRLGy2kYcyPS9UN71eQQZTrn4BgCU_K1IIKQ5l5RRI",
        locationDetails: {
            title: "Financial District",
            distance: "Distance to Airport: 25km",
            tags: ["Metro: 500m", "Mall: 1.2km"]
        },
        otherProjects: [
            { title: "Skyline Tower A", location: "Maslak, IST", price: "$450k", trend: "▲ 4.2%", trendColor: "text-green-600" },
            { title: "Bosphorus View", location: "Besiktas, IST", price: "$820k", trend: "-", trendColor: "text-gray-400" },
            { title: "Tech City Lofts", location: "Umraniye, IST", price: "$210k", trend: "▲ 1.8%", trendColor: "text-green-600" },
        ]
    }
};
