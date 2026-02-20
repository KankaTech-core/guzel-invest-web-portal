export interface ProjectData {
    hero: {
        yearRange: string;
        title: string;
        bgImage: string;
    };
    propertiesRibbon: {
        icon: string;
        value: string;
    }[];
    summary: {
        title: string;
        description: string;
        location: string;
        status: string;
    };
    promotionalVideo: {
        bgImage: string;
    };
    exteriorVisuals: {
        titleHeading: string;
        titleSpan: string;
        images: string[];
    };
    socialFacilities: {
        title: string;
        facilities: { icon: string; name: string; desc: string }[];
        image: string;
    };
    interiorVisuals: {
        title: string;
        description: string;
        images: string[];
    };
    floorPlans: {
        title: string;
        description: string;
        plans: { type: string; area: string }[];
        images: string[];
    };
    otherProjects: {
        id: string;
        title: string;
        location: string;
        status: string;
        image: string;
    }[];
}

export const s2Data: ProjectData = {
    hero: {
        yearRange: "2022 - 2027",
        title: "PROJE BAŞLIĞI",
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTWxJ-cguHSwFM2FGHuO9jfuMKql4c1f5Q_CRZNrMdkyCktceW8gHtZqrGjmwZxk3P4w5sR1zgxU38Wyiqj8JIHQovpA86OCay2i_IC7OVIekodopnGhUQaW7bXYCcrm85Ac7m1pHs-hjyB6Klks005dbgT5QYF0s5Jbvlr7WJPVF_Shn3poWYqZwoRIK4lKVh-bXxkug9MwTZLCF6laD15Fe6A3KMV6Lemfxc8WW-WhsWEb3ZpQ9t2nK1yHxlUkwtTny9atTemTw-",
    },
    propertiesRibbon: [
        { icon: "Bed", value: "2+1, 3+1" },
        { icon: "SquareFoot", value: "120 - 240m²" },
        { icon: "Calendar", value: "Aralık 2027" },
        { icon: "Building2", value: "4 Blok" },
        { icon: "MapPin", value: "İstanbul" },
    ],
    summary: {
        title: "Proje\nÖzeti.",
        description: "Modern mimarisi ve merkezi konumuyla dikkat çeken bu proje, lüks ve konforu bir araya getiriyor. Şehrin kalbinde, doğayla iç içe bir yaşam.",
        location: "Beşiktaş, İstanbul",
        status: "Yapım Aşamasında",
    },
    promotionalVideo: {
        bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXsdr-SrjpQnc1s3fIS2Vq141kVKyhegBw1DqdNEus-CtRDMNf29FnnamPItCKBbP431j0Gr4zh4dTURQkR6H5OMfB9zjgUwu4-FV5NaFHShURH3sNi1P_0ufKIAanvl7VNs0k49w0byFjSV-Dlr_bsca6s2kMjRLDJf-ilzTGCC_ch5rbYVkci7CyvjCrUqOZDnOji064yeNjGwuSBqchVPS9PKACeRKaE_7srAgC8iRQ3sNMIfPqZISvV4kEe0klbzCawZwbCOBi",
    },
    exteriorVisuals: {
        titleHeading: "Projenin vaziyet planı ve",
        titleSpan: "dış görselleri",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDit9fTziL_--VZ59upWwd8hsx1z_5IgpCYzhPVtsJULBZqgQGzuyREeo1jnLwRil7Uq96W9_kHAe7sXDpcxQY0Id9rC0vjXWsioW4bnGoZXZvjUB3h6zK5RU7xciBcmgGad5LS2UBBhMaatCvkCxDtzFGP9Ih5-ANLI1BMsMQTyNJsgKY8jY5u4AeJTdFTvdQ9fDNGdSvGfDODbsWqMq1g97jjzxYFlmKIaGfUMbq6XQrieIoH-iNaYdVupHsSfE-INWniC6O-N6-A",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGYs_fQ6CCxwktz6jZQhPGj_bLzYNGmdOFkpaHsU_XbTvtekS5sePGv7BMyi4yBRrpjHoaMdfrn2oUJ2ygFwdmXJsoAmbzQyYXVe9XUOU7-rYlIxvAp8u-VYqaP7uP7wWjab3H50K3rmcyZKT7KjSZNtUEr15V3yB-pocuWMtiZN8yQtj-Pu2oh04L0MrTIWBZxaM18NdlyWmCe1d2n3LqOL-bAsA64iL7QcjjM5uRfCJiS5YVbAss5L1zR-aJVWwh5Y8IyOaOCvNH",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCmgmhByQNfF1UzrCS2wefA1Sm6AEnwYsDa9xZc5DD48oHkTyjnS4phJB2WfKlAR5V4AfNM50o8nHFeJsj5GzR4VEmn32gkw6ZyyCvat4x-7HBy97h_KuTkX_NZy9FQEkwY2P582Y5tpeSGvlNlx83iiQrsupPEUV_yDI4PlNn66ctng7sWFwVQB9z4M3UhIAH0ul4nI53kX5kBMba01M2P2Ec9lQCokU6QCytHDIUnMPW-5zB642tGE1TwMQz9v-8rW-Q9hzFDTzMc",
        ],
    },
    socialFacilities: {
        title: "Sosyal İmkanlar",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQSq_nL06GAiQpxMFG2g4C1n7fZrjJmiokJXLCUp8kSPp3SrgsT8eL-QtqqrKIKExHOSRpsp3zQdMoMB_p3APf3UVdF_q5bj7T3GFk9KBZ5BrAB1lMsiAiMj6JXCLhm0UPW1l96IsqU4Boxu6i4cf2QJiJl4x1OgqHcYy48CAxmkODQvRYUtinos0T7bgFXjmqL_2OGdqwd5Pvmek6coV2GEwBh_9ij4Hw7p_jrRFipHy1ArW0Z0rqMZBgqb5BcxFaSS_e7mgesvRT",
        facilities: [
            { icon: "Waves", name: "Yüzme Havuzu", desc: "Olimpik standartlarda kapalı ve açık havuzlar." },
            { icon: "Dumbbell", name: "Fitness", desc: "Son teknoloji ekipmanlarla donatılmış salon." },
            { icon: "Sparkles", name: "Spa & Sauna", desc: "Günün yorgunluğunu atabileceğiniz özel alanlar." },
            { icon: "TreePine", name: "Yeşil Alan", desc: "Geniş peyzaj ve yürüyüş parkurları." },
        ],
    },
    interiorVisuals: {
        title: "Projenin\nİç Görselleri",
        description: "Her detayında kaliteyi hissedeceğiniz, modern yaşamın tüm gerekliliklerini sunan iç mekan tasarımları.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDCteN5xkjJaZEsQ_QUfbUAb19tX8AwSfw1Hxs16fzdYQzxgyEkoOzb1v6be7mlUuNeF_1TouMEGs-cWjlKNMT3LiDlJXrmmCcvvXchakecUe3e_rGZgsm8aEDYoJWQvI-G9xk0WPawOP19-SNv3OVwuMpEvwMlV6BN-cNAFovaP3sQbnmAVD1QxbZ0QsssTyffUV8MMhKhZ38DW1PnCPtJ-1y_ETN11T_bMD5ETmYmcY-I_Da3FSex5Z6FMPao1KLZ_IMySNHj496q",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB0NZk6bQkbcuJWijdyF0fsMGJXvbfFDL7DvcXj2LwSS4wMEoX8zfyaCuC7k7G_83IXJdbDuHtwS2AL-WMwkjVZXpY00JR3IHttGSesnHTZXOPazEiizFr1T300R4UXKW6_CriXo6nwCwM__JYu0s_gKlxXbj3INITJLTRJfXdoYHkK0lD-UCzmkzHUYvf5BbDEs58U8GOli7cDCOC_Rxi0RARIKQyGcPuaLOSZptHmwEhK16dbpXpStOVVF-cCpSvM8SLwvO1LpvHx",
        ],
    },
    floorPlans: {
        title: "Varsa Kat Planı",
        description: "Farklı yaşam tarzlarına uygun olarak tasarlanmış 2+1 ve 3+1 daire seçenekleri. Geniş balkonlar, ferah odalar ve fonksiyonel kullanım alanları.",
        plans: [
            { type: "Tip A (2+1)", area: "120m²" },
            { type: "Tip B (3+1)", area: "165m²" },
            { type: "Tip C (Dubleks)", area: "240m²" },
        ],
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDXoUCmWbUr41aCtlYhRjKDbdbqZIRO4ExSmJuT5afYh5kokP8mM2JHKiMh8VlA0_w4oFCSOQDGGJmKfQq13Aef-of-m1GoW44GDpvJVDGJIzbBP29tL5gRqlhOmgbue7AgJjPytW4I4i52ovVaQofZKwqlx3PK4WNqk0fNdei_KXoVEVorn6HvHblIdrK9d6F2HOZseTzfXA03gU2GV2Jsz7i08qmOFs7a8gJWHa8qbBxCjB3acX2ZlUL-AJnRJqfbBMZxoA4XJ0qi",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDMmoh8Or1Pp8rShUsphW3DeGK8VBXYIzPm93VFDjxzi_bHPS8Yori-uj9p2lSv4Bkyu8nJF6abQ1pnKA3OXisXq7WVQ2enJcNXlMvGtivw3QpFStXBX4eS9FC7JXh2MLLD8xu3igfP6ye1cehsXBqxjUVxjLiYc7whqpoOJ046kbV8GPmO8ZDDHGYvWsTxMQnGxCcvlHvKXvGQS8MFRlwG77EViEcSqbY8K3qQQt_LwKy1LD9qOnmr5ajWXIzXbSnZI4GC21Y5rCAs"
        ]
    },
    otherProjects: [
        {
            id: "1",
            title: "Vadi İstanbul",
            location: "Sarıyer, İstanbul",
            status: "Satışta",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoXiLKGSOKVRprP4kffTOQggsmz9GVFLBGgh4Vcy8QFa1AjBsxojAKpI01T2oyDGedONxjm6eXrReEvN2aX1-ZcGv3FuIlZZeELyFflBDSu7BuLwjrMg4s3n4Sqe7qloZt3IZB2_q5VIacFBmTv4pNvgbmvWgYpplvhBQx_y8yCpxFbXE9eDwpWHr6ekBRqVMlaudmQrkbGq9hi0F1qeXn1HJ5v82RXMBpzZQiSg5g2kYuagxCUv_wnYdwcoFunqTZGEcdbHdkMzKn",
        },
        {
            id: "2",
            title: "Skyline Tower",
            location: "Maslak, İstanbul",
            status: "Son 2 Daire",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFvD4jQRLKqitP0J5N0D8fXuDnXSPo6Y2YsGBRjMi_DrHpRKFuWPKN6haP1yfdoNn_EnKnhCrwhx6JX8L5b2lTK5qnvBXuWLLj1iHx_DVPr_0o3Dt_V3iBc6Y0rT8DWnVPM3nhGjBf-VRQUxPKxQxEQd-Ctd6hiMPvsNZy6H7AjHYU276JcvZooKnKMelzuWwsJ80VYjqEutLPvRVxok7PGqSs4jtUbm95DgA6dfZ8AuwswzNoU_e18cJF6qFssxm8NIGQk6j4o-Zv",
        },
        {
            id: "3",
            title: "Marina Residence",
            location: "Kartal, İstanbul",
            status: "Proje Aşamasında",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbtHocGt2WESzoallrdon0CmgnjSNPFRcytVguM7q6sW02HsOtorBGKIWMWMq5LZfZ5kKAqIlIomYfLxyJBxT07d4z8Xxle_ggujMFx8EOvJ_LwHEvSHkWYKbQ-_EmBHAEw_JqbQVxE7SvFJeN-DmU_vFEeWGUkCIEW1WduRt01RMxnJkQ6KAHbAhIBmUPNO4ClG2NtwWkzYauDQ-PGGTswSbGA0jwfwdQvr_8hbQ0QJypdXk6170dCNQAiIkcsOLT3P3v7m2oKqPF",
        }
    ]
};
