export interface S4ProjectData {
    hero: {
        yearRange: string;
        title: string;
        bgImage: string;
        price: string;
    };
    propertiesRibbon: {
        icon: string;
        label: string;
        value: string;
    }[];
    summary: {
        titleHeading: string;
        titleSpan: string;
        description: string;
    };
    promotionalVideo: {
        bgImage: string;
    };
    exteriorVisuals: {
        title: string;
        images: { src: string; alt: string }[];
    };
    socialFacilities: {
        title: string;
        facilities: { icon: string; name: string; desc: string }[];
        image: string;
        quote: string;
    };
    interiorVisuals: {
        title: string;
        images: { src: string; alt: string }[];
    };
    floorPlans: {
        title: string;
        description: string;
        plans: {
            type: string;
            image: string;
            rotate?: boolean;
        }[];
    };
    documentCta: {
        title: string;
    };
    mapImages: {
        location: string;
        bgImage: string;
        distance: string;
    }[];
    interactiveMap: {
        bgImage: string;
        address: string;
    };
    otherProjects: {
        title: string;
        description: string;
        price: string;
        image: string;
        badge?: string;
    }[];
}

export const s4Data: S4ProjectData = {
    hero: {
        yearRange: "2022 - 2027",
        title: "Mediterranean\nEstates",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuACEOC8Yvc9vrwEWj58VPWmDJXUEyr_Y05pCtPsAskZh90TwRAaWnbP-C5E6BG4_oOFyS3uR3U0glZZ7VFDhIeE6vwj2RhH4keUp-4jB_mTdNNVyxKcQOxkorjOUsC7tRjLHwTXhAbzvhO_Df4I8YNLE7YAFZzB9_uGYbTv9z80taaEP5XbrA1vmVcMSZnZoBJKI4izXbdEXNTqFx6_iP-gSeEbAruprXQwwuHhz-DoU4sE3wRHZXnZqQn0HfhXCk5PZBh5ySYP4Ac",
        price: "€850,000",
    },
    propertiesRibbon: [
        { icon: "Bed", value: "4 Beds", label: "En-suite" },
        { icon: "Bath", value: "3 Baths", label: "Premium fittings" },
        { icon: "SquareFoot", value: "250m²", label: "Living Area" },
        { icon: "Waves", value: "Private", label: "Infinity Pool" },
        { icon: "Car", value: "2 Cars", label: "Garage" },
    ],
    summary: {
        titleHeading: "Experience the pinnacle of ",
        titleSpan: "Mediterranean",
        description: "Open spaces, natural light, and seamless indoor-outdoor flow define this exclusive development. Nestled on the sun-drenched coast, each residence is designed to capture the essence of the Mediterranean lifestyle, blending modern luxury with timeless architectural warmth.",
    },
    promotionalVideo: {
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKFUSWCeLR91MfjEeu9wdV-EniIfukV6I4JNubv8PUL8byA6KltzFkGzfAjqiWtlmRxKNH2IRoD7lrL-Pw5HM3w2Hy2k3U55CqxMIq5rjMJ-vZRtbO_apUO6nWe0AVrnCyXfCAczNxPIpIbzrKyx-dI4HBKNpRqdXg4hgD3kI8sc5slC9g5LQrVA6qQiRsXmHWhPAMXzQi-Z3AwSlh7KjYMnrCrB1dBQN2v48i5CYeKCCvkU3R6d__t7b2J53cjXW9CwyNIB9iero",
    },
    exteriorVisuals: {
        title: "Projenin vaziyet planı ve dış görselleri",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiWwdWUBBg8G6572CvbzhXXTx0ZXhMLl-ecaPz7-R_pVaSQYuz-5inI_0OrQyBMeaBTeykjlcis1Mq1gRC3BcW_oUyLw3hPgFqg7E9QIiIbrsKc7xIB3VCrYOB9zGfoMoFZuWrU64OGQU-hg_WvfU9NN1vAFye9K5qjTifEw0iIVR2v3g_RR2Bb8Y5jj_6n6vy95JObhjQqguolk96PybdMkg8clZ-_lGDwEZw_WT_Oc_wqW0KGZS9iXyf8kGCgQbOSYT5CjP9SB4", alt: "Exterior 1" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaV4nBb-TQwa0QyB77jSfIZUaHRmnAp62Kz2biYjsfEnLx5ROrZwkjUkz-IUeI89PC5gu8D9dLasSOLYBaLfOZYn13LCTE4IJ51AX_xniLBCLlQtW8wA1wdOKMnJ3N3c8jtZoOZHrw2CJ-e1iaQ8x4I-TPCixbqWC1PkBZ6nJhTOlR2aIQIvf1YYpNpvY0scknEQfFjmLCQVTX8CDUGOS0eGOoIFRlcEPcoF3T3u8L1x4Eq7bWq8ipXAEhwjNj65mxVZvgB1oVaPE", alt: "Pool area" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ISfd8JtF7iQPBpZssEKKSwC0-1Wnth_Jmlb8yUZwwKTPnmRTHoKdoc18pExIIwmJHdUzzAca1y9V5NTRH333H2RkNFnuneJ-m6T6GDl5BfRQhfAhd7mgPHeIgOaTt6e-CdV6UfALp0JKutHvvOqPt8SZI2e4wpm3yMJ8CPJesGCwJ1iKp1AeMDuHd62a0n6BbJ8uhI-LqPUuWorvKe5EdSGxAwu7d02rY1bVQL0om6zJFm3g3XqndXFCceLkCcacqXHbGs3ULNs", alt: "Patio" }
        ]
    },
    socialFacilities: {
        title: "Exclusive Amenities",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQceu29t6ODDk3shg6f1yBdwjS2V3uUBz2yMqSQuKcBFlOJUEDG4PuHq5_o9phtUBiJwcPWa2w5esaiZxRLQ5gbpU53aPqh4Ff6VqjNjh9o2zOEAcsoE4r0ETHQCjcBkbBW8A00a2S3LxEQEfzdG7DY_BEK7CdXdeViTaxgMHeuOiJIb2NyFF-cPfo9iqDkQbZ0nbj0qqs4ZPxOZTzdWonQRVd5L6bpIpCC2BCWRdShXf97igX8TBefscyGXNbwRebVIvONWrlLKc",
        quote: "\"Every day feels like a holiday.\"",
        facilities: [
            { icon: "Dumbbell", name: "State-of-the-art Gym", desc: "Fully equipped fitness center with garden views." },
            { icon: "Sparkles", name: "Wellness Spa", desc: "Relaxing sauna, steam room, and massage areas." },
            { icon: "Umbrella", name: "Private Beach Access", desc: "Direct pathway to the pristine Mediterranean waters." }
        ]
    },
    interiorVisuals: {
        title: "Projenin İç Görselleri",
        images: [
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp39DasZDDr7m1FlzUvqLQ33S4bV2B3mmrl9xd2kQvcpunk_mzngQM8tS_YDuQxiFX0OOFHMa8Xlnp6OWshQ4VO1diqrzcTI7DCVzsdjQOik5IC-6QVPmKkIXQIS_xgzjL0WVyVxzHnKl5M6aOkoBsLwSfMaubMXLe7VxLwWMW9XoDB0MY0tL2CnGbcl2dNTfajUUULmnY0uFBlPaUVHAp6tMU6AeA8nMdHIjDV30M2YqwXUTCrJJodxogh_6BdfH2QKWhw2ZQbd4", alt: "Living Room" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD_HH7lsNWGqyXABmwVcVl0036zvXYAq2EffW2rS6lycODvkg2H9s8y_vkNtitXvBClgUPkTNjbtoWfap8V74E4Zw-l2LlmyR-rY2IQsS66bi90Uw1Q3RE6FuWBoim-acED6n7OgP9KvbeVgnnlR6Hz631zUa0p7i9N0_r3UwmmK-r6FtA-nadImrSwSomMglyZyuWO_KkK6UsjZkdvymOLhin7ly3Dc95yRv6qq6H0bP-pPavj_GaIQXZMMYc3d0IOep_1bbOlMg", alt: "Kitchen" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2n2d5ck94DeZv69v47v1xxCF_kYWJ_-Hed_C7uuT6zp8lVLlVTLG8na1WOut-GtKUc0S0jIi-RQAnK_tf3ZDmCAV2_HzT4L4mP5ip99cqe18xhVfIEjb05yUmhDR7nZ2_Zo_wIv10pIPLNkGhg8s-zISXD8Fi_4yB6zZEcc_MflgDNefcUP2YfjPglb3nMwd4fehw-nb0ETnxPpZbVtAFI3bX3YEfWK0G8OWrI0FBAPwvt2YBG14zK3gtzF9KNva1d8yedRFX12U", alt: "Dining" },
            { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo-cFs-g3X24ozxXDjFmZ2MUfAMP3XtQw32wJfdu209Y6tXaR6NsbgcWbwv79yb3iYdkOBUnF-24ETFoNjjL518X34FiDTLXduHfuguhT9SSj_Mp1uwBwXbgDiQW3c6mo5d2eVzEdl9V3VR7lxwFkNDk1W5vXPmA-2562ce41dKboW9IkkZqvKXGnhXr7DUrLf5l0tZ_T9Vb7FCYmez3rd76AX8mbJMwZcDjOT7n1G2AS2dDhX2C_H91NVZzheMEkzlXvBW0PNUh0", alt: "Bedroom" }
        ]
    },
    floorPlans: {
        title: "Floor Plans",
        description: "Thoughtfully designed layouts maximizing space and light.",
        plans: [
            { type: "Ground Floor", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtpb3RJBetbiXVM73eYwUyy5qv7FmwSPbAB1IAW9QL-zw1KEIAc80x8q97kunj5_aXjPrg1M-NvCpde4QiXYtl2tFL1HjY5yZsBp1HGdZUmwYZidAxElq3jePjfSN4gkxH9nG-XZ648MwI6-eCVR2DvkIOwg7XjQO-ljtOTSzKRH58UMkz8WLPlbfrYCZmgClrYLE2tGcFdz0If7I-8i0g03NPP99mlR6N46g4frlDsAeSyjtfilNDNf7jfvkIqs0-nLLdK-CokE8" },
            { type: "First Floor", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR0DoNCBVQW5PDTG_qqMWU-ecpK-wi7BHN1ivpgmHxu_nPm_C60YLUpjUgv5SvEl1ijt-LTL4Dl4Yk01rPu9KEThJ-CLo--6Ty2azvJJ3098zQ67m9qA6D6masLSsJW3cgOCeQtmEhIXnXi1KoyF8eJIEfZ80v6SgNI60TwHJemW1YjXV7JeDcUC6qVynkkYSYfsYIlhBb-QtWJ2N6RM-DgTI4V1AhZuDW8Kg8nfThjtfeIaUfqzVshHwMtJBTcl19yE8UPkAl6R0", rotate: true }
        ]
    },
    documentCta: {
        title: "Detailed Specifications & Brochure",
    },
    mapImages: [
        { location: "Antalya", bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqDTkV9y6vzBvwEL6viy7h_sbuKVmxT-3t0PVfgagmqR85uwzcYktKBygCCiR-Jo1eyrxyugCNsUf8OI0lENc4v9QYQGk3fN57fIec8grZfIJ2iMBViAO0Tsy8Xy1s7Lc2R9vsh7S969lkl9r-_7NIPw7tWnG49dfcqQjweYu_HByO5orz0emA7GHf4Ym_UtgU7E5EK1CjhJIrMupG-e3HnpjN1K7OQy_RzZHrzwk0-8K0CG5Dmd5PTyB80CPphy-L5Nr8SLF1Gac", distance: "City Center (15 min)" },
        { location: "Mediterranean Sea", bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDawJGyX8P1-s_Ao4amnsOEaci6DP5PQVxNN4BCBZ43a02bIjNEBmxhfq2uA-EmxudpKchTKrjtspb_M4ozdA4vO33TjrcqD9rVlW7TJEu_fiL2NtYpHimt4Z2mx5IBLjir3y1yX8rvpWw7GnGS-xCOmHKqVmP5tNr8a-qFnGr4dBtETCERXTwR-Yt11UNdj1oY4dnlUEa6NNxfE8xsA8rQ8hoEUP1SvPayxii-kt_PToMrPyRZc4pmwQQ6swIjWVNRLff1uhvxtM0", distance: "Beach (5 min)" },
        // Mock image for marina
        { location: "Marina", bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDawJGyX8P1-s_Ao4amnsOEaci6DP5PQVxNN4BCBZ43a02bIjNEBmxhfq2uA-EmxudpKchTKrjtspb_M4ozdA4vO33TjrcqD9rVlW7TJEu_fiL2NtYpHimt4Z2mx5IBLjir3y1yX8rvpWw7GnGS-xCOmHKqVmP5tNr8a-qFnGr4dBtETCERXTwR-Yt11UNdj1oY4dnlUEa6NNxfE8xsA8rQ8hoEUP1SvPayxii-kt_PToMrPyRZc4pmwQQ6swIjWVNRLff1uhvxtM0", distance: "Marina (10 min)" },
    ],
    interactiveMap: {
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuABOU0SZkNPU27vziGYs5Ru1jSS8cSa2eaRDcVVpu9PsnhvF3I4A0a4BtdQ_tnfEANCLLH9j1zcF4z-frsQ5AczsCYBMo6WPErDPuskdmbTUk9Z6Jo_8CvNmtoFMKxXOOqJ_Yv51yOZl4sR2qbQ7hp_whLzlCiF3KDIhSFqhPc4KDckXQIrG3khFbG9SCkCn8OvDMWE-JVHBJcT4bdaYP0k4QzAcGnI2dP1SieA7gLbGeX3nfmJIj5j-3c-gK2jtWp9ULAjj8uuRl4",
        address: "Mediterranean Estates, Coastline Ave."
    },
    otherProjects: [
        {
            title: "Azure Heights",
            description: "Sea view apartments with luxury amenities.",
            price: "€450,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6zXHPf2XV6_dAx-IUnR4KCG8vhLByT4mnxUcC7JfQz4h0XrV4kOoUABP5ChFEPThIURThPiVmKWBmTTi_GKyrTW0O5cmysK5f8fAX_exE8iyGyEmM8NJ9eem8RIouAf-_aKfVmJcyz39H08kohsht1VDeUUgODQqTFiILDPC_vmXo8B58BiTimeAD9Gt8p1m-AjTQIumm4kiO9uMQyQUohasAVx7eqQI-90jjANMFveVukOsaEG-0nTBza-_1H2dIti6Mgj1ilk",
            badge: "New"
        },
        {
            title: "Palm Grove",
            description: "Exclusive gated community near the marina.",
            price: "€1,200,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXbkLvAuKCjVeF5BoOjHefmMFYL6CbWH8o95FBy9u4vFwAQybHEPEZ18LSVPBWVe1iPemwiPuXyCJWLz4Rwhiv-5f6NmGllkWntQ6cGN3i3UHQh6i1PqZKJGTP1DVcPiwTYe8jZSSQlBwfE7_sWACO1SUN89xg66WlESZ4iE3GsnRp8mQoMXwGuUFLqNDsClH1x_QL90MdykbBG5jkJWzEP4nlPUCxA8Ei3zi5rzlQYEw10pTVyCkspcKtLzQ8ficcRQDSoyBlcs0",
        },
        {
            title: "Sunset Villas",
            description: "Contemporary design maximizing natural light.",
            price: "€720,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzA8sjd65VXrhDcXo-uNxXyAJwxSj0XY8_oNN2hPFGzReGnXQyqF96o-MM7O_BZUNwJsPrP_W4wCbSbD9uHF0ts77x8IylvYMZYGejChmI_S1aGdjmTEP3KmLzYsFWGZsWM3RJQnpCUAHSjinc087HDxLx0VsG0ERsofO0zAQi3ijJmKu6XM_s_X3olEfbZ0MYe1SXyUpjMBdrm0uMfFZ4wX-NHrIJRaNOetNzb1ibVNayghkmHf--QnX8FqMx3fx0YjSquwX3gUQ",
        }
    ]
};
