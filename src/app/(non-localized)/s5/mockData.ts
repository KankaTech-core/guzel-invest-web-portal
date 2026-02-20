export interface S5ProjectData {
    hero: {
        yearRange: string;
        title: string;
        bgImage: string;
        exploreText: string;
    };
    propertiesRibbon: {
        icon: string;
        value: string;
    }[];
    summary: {
        title: string;
        description: string;
    };
    promotionalVideo: {
        bgImage: string;
    };
    exteriorVisuals: {
        title: string;
        subtitle: string;
        images: { src: string; alt: string }[];
    };
    socialFacilities: {
        title: string;
        description: string;
        facilities: string[];
        image: string;
    };
    interiorVisuals: {
        title: string;
        subtitle: string;
        images: { src: string; alt: string }[];
    };
    floorPlans: {
        title: string;
        subtitle: string;
        plans: {
            type: string;
            image: string;
            rotate?: boolean;
        }[];
    };
    documentCta: {
        title: string;
        description: string;
    };
    location: {
        title: string;
        maps: { image: string; alt: string }[];
        mainMap: {
            image: string;
            title: string;
            subtitle: string;
        };
    };
    otherProjects: {
        title: string;
        projects: {
            title: string;
            year: string;
            type: string;
            image: string;
        }[];
    };
}

export const s5Data: S5ProjectData = {
    hero: {
        yearRange: "2022 - 2027",
        title: "Proje Başlığı",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkM89VUcQsSIM4uW2QrD_Laj1qKGe70BL5MpVCwsPte3bscZDqRZb3YIY66gwzFcHNm5R7ECMjH_sEt174plmsavkkBVmsUsemtQRLcOzwo3TVrXKdAaFy2Nh1Cof18aN7yJStGM5v99WMJ2lRMb3dDV15M_31138eBAaCCMieaYE68-Mgswo26Fr0fdIlryhhfunPhKIgVukNFBBBlJWJX_tR7caOaJD_Liri-3NZ0w44wQqfV4XJ7cJYZSc96gi73zFSbUEK58s",
        exploreText: "EXPLORE PROJECT"
    },
    propertiesRibbon: [
        { icon: "Bed", value: "3 Bedrooms" },
        { icon: "Shower", value: "2 Bathrooms" },
        { icon: "SquareFoot", value: "185 m²" },
        { icon: "LocalParking", value: "2 Spots" },
        { icon: "CalendarMonth", value: "Dec 2027" }
    ],
    summary: {
        title: "Serene Living.",
        description: "A sanctuary designed for modern lifestyles, where expansive glass facades meet natural wood textures. Inspired by the harmony of Scandinavian architecture, this project redefines minimalism through functional elegance and abundant natural light. Every corner is a testament to thoughtful reduction."
    },
    promotionalVideo: {
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW5stCHrFF2EKNpErHCYsZa2GtPq9UNO-1wp8dy9F30HFRNgjgEVzyp8LbKtT2MZTge_SV1cV8i8pfpF9Uu_i_pBZ2vPyC8KMq4WRIL3C6TWcQfR9qrVGyt1LK4lQatGf4TmyvRlZFsMLHKEFY1VDC6s8IG2KsONXoCotixBjvhPeznLqy-YvT9a-E2I-j-L-RQ3Yy9yF1u235lb6WB9nwPcC0Im6A427CKca-dj8PFmN1nw3aOUUgomOWKpWcFz4hkIQnIYGQmmg"
    },
    exteriorVisuals: {
        title: "Projenin dış görselleri",
        subtitle: "Gallery 01",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPpgqYuhmvKPfWAr3kj1wvRPZB6Y6lbuf13P8nOMOCltYDmYGJjSlzY5dFkGlpO1-RtmtDKQRG912rCZXjfy5_cm9bwvj6yCctT6XN_oxuhlvZf51aRNzzzeobnuSUWb5QvgwJ0B7CUDZ2wgLxdVNL8TLTKqmojEjavdp-oit7fvh1aaOd_4kk6ftXP9p-zHReb79lwuacrUIsRkn8GtzZmME_Bj82149ZSHUpH-ompNZvKCAJYPhF5Ba5-d_fgAYKMdpuhGAJIV8", alt: "Exterior 1" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqYVn-SgiGYi1d39STw1GVAolzk-iHpr5ykdyqFpAJgBGCX4qPU63dXH-36n10SRVg7ffPtbflMoJn00xFd0mMxP9CvhFXut0QYNgKn9e2DB1NrbB54cTwtLk5Jt4f23J5V3kyLmDtiXpOQF7962zzLhCrgfT4X9C3KjSZJxTHT6cl3wSqcs-ga98rwfTIDzyFfEM7n2mAF-Tep-sjK41zfsY8Bg2a0gEnZvCnYy-2hGKMgvpA2pvaHcZoOXrK4zqmA2hM5jJt7Uw", alt: "Detail shot" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8bqzdMDLAUErdTO2MPtYdMIQz5of27fbbfDgpnSxVRVCUix7QhtgDI6z28yuAWWyD6HCxWORbi_76U0ZAOYaAlwfb0EjsiZLRzXK_chBCQBSkpcweDtofJf9HK2JKJlzWYnbKgZaMompBaJVjGEDbI9FzDzZxwGgr7vLdY-8l0rSalXn80fEyjT6rX8KLMCYT-pHCTXgtsiXAKRtWV9h4eTrF1VEigbP2anIadmU4fEXcVLd9VhO-YgdfeJ7HsojAHVPxqsNnoFw", alt: "Sunset view" }
        ]
    },
    socialFacilities: {
        title: "Social Facilities",
        description: "Designed to foster community and well-being. Our facilities are integrated seamlessly into the landscape, offering quiet spaces for reflection and interaction.",
        facilities: [
            "Private Fitness Studio",
            "Zen Garden & Lounge",
            "Co-working Library",
            "Heated Indoor Pool"
        ],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHo8PXid4RKhNfUnGMTKf7UG4_XU9NzQP5mnv8pCwKNHioMUwhwymxD0xZog9AUfWpy5JS03tmnJCm6cYvv5KqgbpXIc8ztHe1wvTyNJm0L1gQB_8b9MEALmsivCSmOvLPnuBNFlaBSYkykO7ybmMEPT650QEi4ZMW1PilLKpnTCIsqPq4f5hcmad2QoO6xNPC3lk1iIH5wbCcYzfon8gh7E36MrGylv2PGE-DCN1M-ijTuc3bFxvWOONkYUFBXZ1_dRfqrvzqF1M"
    },
    interiorVisuals: {
        title: "Projenin iç görselleri",
        subtitle: "Gallery 02",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuABfLUK2I9tiuJYm11H4F1WwzgslOYH-y4RksWAsNnZmiC1HAPgbbJFF1VgyM6_zqcEveluwuMyf8ANOczTVGuX_uoqM_QdsOOU0CRsoYbatfZ_vvz-F20OQIrgc9r34vrWWxWUC7KicHwmBTprSlAXoUbIrRJnRhq9OdtaA_shvZ-XoIZpc4Ht5iJSEcEJexJ4MOiq5qzABhk9L-pIMR8-CqfEEfhuJAWStP1BJoqEU_OLzAaGJ7tdRUBm0-uIJykNCPCRiO5Uiic", alt: "Living room" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3PRhQpoUFC8ylXHZYeAEYXSKWLkA2hSWSS2KPZBRQTRujdhJ1Z8t1Z_qMoOnS8x538iN1UqrM77iZHsGFUIIinT6RfZeuo2slWVEPUVb8mdL13AKVtCRs9Q3G3qOlCwjXEppcKBcASm5dhoi9L4vgBqREpwkpMomDQLHGrYOgwLoCDZcypkQXbik5VaEmpdMs6uwJfAEDlaZEsOPYGlOaH2UN8ZB8987H4_YU0GZ3VE9GtbOwPzEjjnpP9Bv-THwVq4l2BTgfaPc", alt: "Kitchen" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNPJARD_qq_1gKOL_tfRuQupegQrwH1KQ7L4CoOc49RYaVEkcz4yCFizLDWuFBwKZiKKxkKCSUU-ucNG8sT_4WmjmLiHJsQgcfzYJF9W45MpFnrWmjfyDdDRG8-dsrfm7F9IqVpeHBwbiuchbi3kHdkEuF4_nSywH0fDFvCkSCu5tE_bllQnPgOmiHfEpUaansdp0Qtr62QIKr45K49Ri8S6ehYG8Tp021Ib9mT6Pyji5kUH7HEom-Zvffa7h5ZSiNAqYtZdjNb6A", alt: "Bedroom" }
        ]
    },
    floorPlans: {
        title: "Technical Diagrams",
        subtitle: "Typical Layouts & Configurations",
        plans: [
            {
                type: "Type A — 3 Bedroom",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvFx0y8NEtuy0XLcRur3-WxydfZsb1Pbo5Ry4beWfEqeHm1f7KPuWemHaljdni5ogPHtjpRiAA0DsERyso-EtWo756ao1_MJ48yrjO_l3uccTmuvTNJ-O83cic972rWatiMHkgL2C3-SMW47JVo96XvlNah3Hfaz5uLhmIpmliWd1j0skkmq7RuYszF9wTSTY2pJC_kft-I5q9kHE7EZEDHjDUJ2lp21xBzInLMCLmifnk8Ona92_x-Dim3r49PYoXPgXt3ODtjkg"
            },
            {
                type: "Type B — 2 Bedroom",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUcN7qwT8z1X0DG81G8qLcceIfOTehVehiFvreAlIR0PV5xUrd1sXsqarCrCZoQeFa_Amx8n0kPrTOdVHclRotrEYRY1CRwJwB-_7v_gIvIkNe8PZLlFH6E_OKdQ0QhxWtiRLugsNfIotPPKEzN1zLFbsjq-HsZRlhdt71MgcI3O4psLo6MkLzEITRP0OPSoZJhg53GluUWTj7cjBt4fNNZhvcCsSoS-XcVuY2Rj9ux2zrh9kYwsa2fjxefPV2nsrtJ_KH79dnDvE",
                rotate: true
            }
        ]
    },
    documentCta: {
        title: "Complete Specifications",
        description: "Detailed material lists, appliance brands, and technical architectural specifications available for download."
    },
    location: {
        title: "Location & Surroundings",
        maps: [
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPN4LxB2kGodEi-qw8b1RKWf1dh2EprKIZfOOisHo7ENaS079b7La4Qe5OeUVy3yKmCR_WhWEGBjlTO6jB2mhfVYhsG9n6hP1pEwoO92iEf1SZOp4ewQvF8KNsoQrSlKf4mUJBQyaYdsWTEKsmeW5u8qd9V9xN_l6YCszuyo-kDFRSj-hsfqPEkpscW1VzEbbzo_peQjZtcQ3b6jRKV9qQgkEPolRt7GDYvYEe8sQpsCqcMzhy7qZNxItxqjRXuf5QLXtufqdRFw", alt: "Street map" },
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHc2B4IFazdbGAla0Zs73XvTACOBx9k_F1vZ7wEEE54nXDSmvFJxJBKzeAi_yTMZOEXXhinhY1B0JDGAR29bEemVZsiUcyzBdovB2iXJf5YiKQc06CA4XbGwDjle506-bVJTV4RpPjA5ExiX1OsBLuutRMsS5JiBA0jdeg7JW4-q1FNf_YhI56ISug06DEKuQ-eGRz1xr8P-oM3c8Z--WjrXo9icutYWTBJ-gRbaZbaFcK5DUCIrzX-L3jgvC_Rq54uc0osD7HH8o", alt: "Bosphorus" },
            { image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPN4LxB2kGodEi-qw8b1RKWf1dh2EprKIZfOOisHo7ENaS079b7La4Qe5OeUVy3yKmCR_WhWEGBjlTO6jB2mhfVYhsG9n6hP1pEwoO92iEf1SZOp4ewQvF8KNsoQrSlKf4mUJBQyaYdsWTEKsmeW5u8qd9V9xN_l6YCszuyo-kDFRSj-hsfqPEkpscW1VzEbbzo_peQjZtcQ3b6jRKV9qQgkEPolRt7GDYvYEe8sQpsCqcMzhy7qZNxItxqjRXuf5QLXtufqdRFw", alt: "Metro" }
        ],
        mainMap: {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABOU0SZkNPU27vziGYs5Ru1jSS8cSa2eaRDcVVpu9PsnhvF3I4A0a4BtdQ_tnfEANCLLH9j1zcF4z-frsQ5AczsCYBMo6WPErDPuskdmbTUk9Z6Jo_8CvNmtoFMKxXOOqJ_Yv51yOZl4sR2qbQ7hp_whLzlCiF3KDIhSFqhPc4KDckXQIrG3khFbG9SCkCn8OvDMWE-JVHBJcT4bdaYP0k4QzAcGnI2dP1SieA7gLbGeX3nfmJIj5j-3c-gK2jtWp9ULAjj8uuRl4", // Reusing map image from prior since it was a placeholder
            title: "Project Location",
            subtitle: "Beşiktaş, Istanbul"
        }
    },
    otherProjects: {
        title: "Similar Projects",
        projects: [
            { title: "Vadi Istanbul", year: "2026", type: "Residential Complex", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDh23D2D4lhDZSMuxESb35jMfGHz-Xp83bYWa9SDt1QHmkE8ZjgvEniEKU85QQbBxO6jn_KZ_NJSRNioBKA_0EdhzEG-tQ5srT80ZEXg_mBWWj8kehmqcF-R9Hi75rsXVZvEG8diNMO3SovdSqPpM-RC9QI9aoWec5nRKNqoB4YUgxuMI3oEDeORF89Jo1iS5VDdwJ_-1Ssvy4b5Z5KibYADR-VUcB1Mhhj7kQZVR1_gTOLx2JPfGW_lOHJ_z-ztPXfPH_f2LZMsXo" },
            { title: "Orman Lodge", year: "2025", type: "Private Villas", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpNBIoYeheiDA_g_tQ8zDflOSrlt9puEIGxqI-X0p7TXmKZI2J7H-_gz8JPDPhJESRMkQghWwcBiVnsS6CS88LweJd7u50IpA41Gvrcz2izrjZEt36fQ_VkjCNcgA_E2fJTGMxkaBRrxos_YMMl2JST6V5wEEBQzkx09px-F22D3e5CftPlIVH8FeH4MZYZ4oeZEi_y_Py-JlHYaZmuzRISAiOZ4s61yp9w_cEbWxBPrSNha84dP7nwA8pZBg3F1OYv3YQj0arXb0" },
            { title: "Skyline Tower", year: "2027", type: "Mixed Use", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJTJwodDlHdLgAmW83pbt_CdGgytdkBRYSHV4rax0lrPOJ5MTpjw1anWOTE28EXwQdxMFct6PoxN0YZt_v2aBrVJ-q8FcemODLd94px7yCC9yFw5sVaOy7tigk8Sx471mmo3dZJCpWTDTkFH204mFYsbwRWi1CsMuLJ3t2E8s0t-ygyWbz8BjSz5dbWY1qztW1qn8RtnNCEqlh6eJ67EURc45lEL96_IkHCn1NCMVG2pdX3wLxPctphkU-BRjvDXUkpA_EdNUhCfA" }
        ]
    }
};
