import { LucideIcon } from "lucide-react";

export interface ProjectData {
    hero: {
        yearRange: string;
        title: string;
        description: string;
        ctaTitle: string;
        ctaDescription: string;
        ctaButton: string;
        bgImage: string;
    };
    propertiesRibbon: {
        icon: string;
        label: string;
        value: string;
    }[];
    summary: {
        title: string;
        description: string;
        tags: string[];
        deliveryDate: string;
    };
    exteriorVisuals: {
        title: string;
        images: string[];
    };
    socialFacilities: {
        title: string;
        description: string;
        image: string;
        facilities: { icon: string; name: string }[];
    };
    interiorVisuals: {
        title: string;
        images: string[];
    };
    floorPlans: {
        title: string;
        description: string;
        plans: { title: string; area: string; image: string }[];
    };
    otherProjects: {
        id: string;
        title: string;
        location: string;
        price: string;
        status: string;
        image: string;
    }[];
}

export const s1Data: ProjectData = {
    hero: {
        yearRange: "2022 - 2027",
        title: "Modern Yaşam Kompleksi",
        description: "Şehrin kalbinde, doğayla iç içe lüks ve konforun yeni adresi.",
        ctaTitle: "Özel Sunum Talebi",
        ctaDescription: "Proje hakkında detaylı bilgi ve özel ödeme planları için uzmanlarımıza ulaşın.",
        ctaButton: "Hemen İletişime Geç",
        bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2800&q=80",
    },
    propertiesRibbon: [
        { icon: "Bed", label: "Daire Tipi", value: "1+1 - 4+1" },
        { icon: "Building2", label: "Konum", value: "Hastaneye Yakın" },
        { icon: "Sofa", label: "Donanım", value: "Tam Eşyalı" },
        { icon: "PenTool", label: "Tarz", value: "Modern Tasarım" },
        { icon: "Star", label: "Kalite", value: "Yüksek Standart" },
    ],
    summary: {
        title: "Proje Özeti",
        description: "Bu prestijli proje, estetiği ve fonksiyonelliği bir araya getiren özgün bir mimariye sahiptir. Toplam 25.000 m² alan üzerine kurulu, 5 blok ve 350 bağımsız bölümden oluşan sitemiz, akıllı ev teknolojileri ve enerji verimliliği odaklı tasarımıyla geleceğin yaşam standardını sunmaktadır.",
        tags: ["Öne Çıkan", "Lüks Konut"],
        deliveryDate: "Aralık 2027",
    },
    exteriorVisuals: {
        title: "Projenin vaziyet planı ve dış görselleri",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3wnBNtlGhRBJITWrkMGnrknon1Hxxh6sEh8uTCMVO2BSuIMEPijZrgXlr4ZsRh01SOO6J8EojQz__vKykj3Ys4twYPW73x99f0s3TwB0TqKnTe7GYnVjADaxAVAYs-h3lo7VtBQRzqifKQXKe-IqGwd59YP9B1qLVvTiPFNajzZ4aM7yHWmpz-AgsFR5ln7ymmEP9rmH9ofyBBUfFxU2AYbPBlJzEQr1UtN0u4fE1NUX7i1ztbzVzttdY1rUpy2C8rGHQi2edevv",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC_KvRF5uNtUCb17ZWNemB8DEdbUJewKL6VjePDTl8jDwZbuPufgP0n9mzBB96CK9VmFi7LksRx8DY7UC59KRDuJtCsihAfxqsiMiE_j7aN2_1P9Ti0HDHmaQWEcKYD05aNSuEXTFfCs2BiQnyVpnhsOlnxOkbN2XuF2ouMU0ll9XLNNfaUGzp8mHmkpsVzjd-OvjhcBxiL0gjUe9apVyif2H6ZXH9Pup9JJbBdZk3CN1dhHhnHDmOSBJEUIGxXv6ZWwceq5gW45Mjt",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD5js6yfI7R5PoPgDtPD90YENCsK3nypHLLaPjDOFJPPdDCQx7BM99U6MD7KPlZVSpG7oQftJ7JcAHq8HLGt1OzJggdqCDOBvn8miZ6dWI4uSIvNDPk_JfRJ_sOn970QU-Sq6eWIy167mdyq4l3ZwFSawz3NqWDKvhC_XZZqWNMrk2lRrNBpQA9SFufqb4H9sgVUkGYrMKDlHOJTlQ8h9Qx6in-YeM8HIk_G1VWv_ZoTyOeNosdINp8QxoL5430gagW28mSu0uPYw84",
        ],
    },
    socialFacilities: {
        title: "Sosyal İmkanlar",
        description: "7/24 Güvenlik ve concierge hizmetleri ile her anınız güvende.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgvNlNsDtXZl2F1cdLHI1d8l26pD4SlmjlpVy_B9otVSNvZdWf-qfjd1GQAFDOdlgEBJg6jXVHN2mgCV6HgWbGWL6wH8DwY34miukuojoK3hUpUbICFJfcysX0ow7oSVmWr8WgLM2ugG0cHvTtqZPtHC5PzhEAU4kL-v7qb0XkfxeE3s22XD1S_OOIevP7-ak5g30Kdv4Grs3tKuH1VqPnWtzTvzr6yFE3XtesYSI8XV9FB8Ew8gQZyH0JpgU4gAbUD7DKyqdubXRL",
        facilities: [
            { icon: "Waves", name: "Açık/Kapalı Havuz" },
            { icon: "Dumbbell", name: "Fitness Merkezi" },
            { icon: "Film", name: "Cep Sineması" },
            { icon: "Sparkles", name: "Hamam & Sauna" },
            { icon: "Baby", name: "Çocuk Parkı" },
            { icon: "Car", name: "Kapalı Otopark" },
        ],
    },
    interiorVisuals: {
        title: "Projenin İç Görselleri",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBr228fd3KT2ogPFULmfapguQLCDihAA6Jhh-ytpNZ041EGw1izpSVpmEu_rw_7KUGzF1_R7DHLa6upP1xsT3bXRWYV9F5BQ9RcfrO9XfICAWtZVNxEnG_SFLD6YC97lOWi4-q_hlNYj9EGAQwuecDIFcZSnY7fyoRUvpHs-phNznbJK5CxPeo9JUhtQ5M_Dk4DmWG7aBv13jX8vTLC-pg6bDTaHnH2avd8enAYw8ReFgmresl2iUO4WbnIMVJGtxQo4BSBaaFcM4xi",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAbO6aJYlZ9LEXK52KtcCZ8_wkXkyCAiF9DbpEdDm7XA5Kyaobl70J-R1e69_7tIxD7lq2qphRA_pLhTCdRVEzpvStbpk634YOPXuXzhhWNxY8Wl4hn6xK3mjbTIXjx_AAyDp_vGNsK23PuW8Z8bj1Xrw88C4GQXEA936D-DU7_kE020J_xtwn-aqa6I_BxBEPwtsUispKfRjd-az7zPtNNYQW1OUK8SXHfKSZVPsBQ2vKptP2FByJtst0UckAWdqLozfaU86k263pO",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCeiwsd4zw1WD6-kmo9S03E5LJLLG6S9zdPPRyby8GYoaijDutcvCHz55ZYsj6nvXkgaLsPJjqYmrs094LO2FNvskxNK8aY3r4iD1JGdUtL3gPcgfLAuB8rZfpITexvMUD6F4TjD4IVxVn0YgTX3eRJm5yy_3OaVKDVrg8_oJCqVotIxhZ_oS4KlK9qOP9zSij0Fwsd9_JwyOkh5zhjWe371qalmX70B0AUeRntBtWt8GE_kUeE6ZLnQAVtAGW1jEdd-Uqg9zEbHrMk",
        ],
    },
    floorPlans: {
        title: "Varsa Kat Planı",
        description: "Farklı ihtiyaçlara yönelik tasarlanmış, optimize edilmiş yaşam alanları. Her metrekarenin verimli kullanıldığı, ferah kat planlarımızı detaylı inceleyebilirsiniz.",
        plans: [
            { title: "2+1 Plan A", area: "110 m²", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfAp-zwRsk0fnZMnOTz6c3u3Kb9bGmovOmudWvxKjz8fubZB38SzYgy3tsP1vMoWx12OQXE_B4YcjQzMyYRaf_vwvw1ORKVS2zxGRmvkL2HHpPygrMpSAu5uimNUYwYMdaXTEoIUmwvOdePmm5aBZJwy8E-FCUDT_kCjBfHopkplxV_idyaQk3EaySJzklVZ6rpTnSVxH7WQ1RWB5TFDDAYMW4w4BMMgDSvsaGo4i2YTFa_GKRVE5O7yPCtuWFn0p0jAZqSpEj1kOJ" },
            { title: "3+1 Plan B", area: "145 m²", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnuU1He0BDvo806Hv-chY4NKGn3riYG9DYK6caBN3j1AKbKtKcreAC5Y4v192SO-z8fOW926yYwPkH_T8vvKI_nBntBn7YRllUX08xGRDf_jIYdNF8qvpOayUq2ufnItvQUu4hj_2PcghKPBLUM8RINb58ggGZfxxmCNsTJ4TlNXNbs0S1hnBjVzaly7mrjSkeALv0ZmvUEzAM4ObImvYn3s5b3aYhil_hWMecBwdMI0Mk2vNQhEnI7ZH0ukx4oVio-49-J7YBzLJz" },
        ],
    },
    otherProjects: [
        {
            id: "1",
            title: "Park Avenue Konutları",
            location: "Beşiktaş, İstanbul",
            price: "12.500.000",
            status: "TAMAMLANDI",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdnhSp-Q6BUwn2I03xAy3IsZb0WKU0uW_F0rFU_t3Vq0S12gq_dGXNRcH_CfDtJjzgarb9ZmDm7AcGyWrRUGFK87WgTqFgdL8E47i99Akv8j77fWb5E4t1k3GhUDCOeEX5_wIYSJOxr-bXhFU5VMamagzYt1Gf5I5i-BfEAVbN3UGjXsoNNtJ6ealJ6ZkXJKoHyDlP3z0CBAdb54_RHW2Eezj3JZn75t-PyB707RDL7vpmhzAcGeuGCaKW7DlJ13vMHpdwniCMjYNP"
        },
        {
            id: "2",
            title: "Skyline Business Tower",
            location: "Levent, İstanbul",
            price: "18.200.000",
            status: "YENİ PROJE",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtRCOM95yYvxG5n2FX-cqGPXkbW7aN6IKJGoI0KObsQBhX_0szrJfpZveHS884jUtHTqe_PTX4MCvEeKK6eYtjwbv3EWvrar2McAV4Qm5t4apyANsYDVQxKk8nlrtlMZpTGldh5s5IMHImBwkNiAEy4hy_WavM1E9dxMdAHoIKwQeD8XDb6IoyZaUjOm-8w-HIOqCnwzY_ZFrUSQTaGbadilBlxKsqn1Pj1_JbZMGN3FauAm1a7085r3FUJRJaMyMBBQhRKkaNBTN5"
        },
        {
            id: "3",
            title: "Marina Villas",
            location: "Bodrum, Muğla",
            price: "45.000.000",
            status: "SATIŞTA",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Bui84dDQH8jRjxnWtFYrwvyu5zrK82ap90AyXO5kDQ45f1gJooCZUP8fyWrRPGhUQfJH2uIdxZC9tmAGWPSy6inqLv3IT1syjhcDebEB905uC-UL-L_GsddThkKc0ulZBq-h9rIpkHC3aw7KwflHAiTtf0n209gtTqr2vouTg97gcmv72yUKrMcrEl9g33rKEmVB_hfj96vzz04_0JmQDwsdqz5zZKm70JpVgdn96Az2dASuHFbDX8h_qXytZ2HbIMcgH76a-D7Q"
        }
    ]
};
