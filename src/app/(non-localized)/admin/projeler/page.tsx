import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronDown, Plus, Star } from "lucide-react";
import { ListingStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { cn, getPropertyTypeLabel } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import ProjectsFilters from "@/components/admin/projects-filters";
import { ProjectHomepageCarouselToggle } from "@/components/admin/project-homepage-carousel-toggle";
import { HOMEPAGE_PROJECT_LIMIT } from "@/lib/homepage-project-carousel";

const PROPERTY_TYPES = [
    "APARTMENT",
    "VILLA",
    "PENTHOUSE",
    "LAND",
    "COMMERCIAL",
    "OFFICE",
    "SHOP",
    "FARM",
] as const;

const SALE_TYPES = ["SALE", "RENT"] as const;

const SORT_KEYS = ["sku", "type", "projectType", "status", "updatedAt"] as const;
type SortKey = (typeof SORT_KEYS)[number];
type SortDir = "asc" | "desc";

const SORT_DEFAULTS: Record<SortKey, SortDir> = {
    sku: "asc",
    type: "asc",
    projectType: "asc",
    status: "asc",
    updatedAt: "desc",
};

interface AdminProjectsPageProps {
    searchParams?: Promise<{
        status?: string;
        sort?: string;
        dir?: string;
        q?: string;
        type?: string;
        saleType?: string;
        company?: string;
    }>;
}

const getStatusLabel = (status: ListingStatus) => {
    switch (status) {
        case "PUBLISHED":
            return "Yayında";
        case "DRAFT":
            return "Taslak";
        case "REMOVED":
            return "Kaldırıldı";
        case "ARCHIVED":
            return "Arşiv";
        default:
            return status;
    }
};

const getStatusBadgeClass = (status: ListingStatus) => {
    switch (status) {
        case "PUBLISHED":
            return "bg-green-100 text-green-700";
        case "DRAFT":
            return "bg-yellow-100 text-yellow-700";
        case "REMOVED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const resolvedSearchParams = await searchParams;
    const statusParam = resolvedSearchParams?.status;
    const sortParam = resolvedSearchParams?.sort;
    const dirParam = resolvedSearchParams?.dir;
    const qParam = resolvedSearchParams?.q;
    const typeParam = resolvedSearchParams?.type;
    const saleTypeParam = resolvedSearchParams?.saleType;
    const companyParam = resolvedSearchParams?.company;

    const validStatuses: ListingStatus[] = [
        "DRAFT",
        "PUBLISHED",
        "ARCHIVED",
        "REMOVED",
    ];
    const statusFilter = validStatuses.includes(statusParam as ListingStatus)
        ? (statusParam as ListingStatus)
        : undefined;

    const typeFilter = PROPERTY_TYPES.includes(typeParam as (typeof PROPERTY_TYPES)[number])
        ? (typeParam as (typeof PROPERTY_TYPES)[number])
        : undefined;
    const saleTypeFilter = SALE_TYPES.includes(saleTypeParam as (typeof SALE_TYPES)[number])
        ? (saleTypeParam as (typeof SALE_TYPES)[number])
        : undefined;
    const queryFilter = qParam?.trim() ? qParam.trim() : undefined;
    const companyFilter = companyParam?.trim() ? companyParam.trim() : undefined;

    const sortKey: SortKey = SORT_KEYS.includes(sortParam as SortKey)
        ? (sortParam as SortKey)
        : "updatedAt";
    const sortDir: SortDir =
        dirParam === "asc" || dirParam === "desc" ? dirParam : SORT_DEFAULTS[sortKey];

    const baseParams = new URLSearchParams();
    if (statusFilter) baseParams.set("status", statusFilter);
    if (queryFilter) baseParams.set("q", queryFilter);
    if (typeFilter) baseParams.set("type", typeFilter);
    if (saleTypeFilter) baseParams.set("saleType", saleTypeFilter);
    if (companyFilter) baseParams.set("company", companyFilter);
    if (SORT_KEYS.includes(sortParam as SortKey)) {
        baseParams.set("sort", sortKey);
        baseParams.set("dir", sortDir);
    }

    const buildUrl = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(baseParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        const query = params.toString();
        return query ? `/admin/projeler?${query}` : "/admin/projeler";
    };

    const nextSortDir = (column: SortKey) => {
        if (sortKey === column) {
            return sortDir === "asc" ? "desc" : "asc";
        }
        return SORT_DEFAULTS[column];
    };

    const renderSortHeader = (column: SortKey, label: string) => {
        const isActive = sortKey === column;
        const indicator = isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕";
        return (
            <Link
                href={buildUrl({ sort: column, dir: nextSortDir(column) })}
                className={cn(
                    "inline-flex items-center gap-1 select-none",
                    isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                )}
            >
                <span>{label}</span>
                <span
                    className={cn(
                        "text-xs",
                        isActive ? "text-orange-500" : "text-gray-400"
                    )}
                >
                    {indicator}
                </span>
            </Link>
        );
    };

    const orderBy: Prisma.ListingOrderByWithRelationInput =
        sortKey === "sku"
            ? { sku: sortDir }
            : sortKey === "type"
              ? { type: sortDir }
              : sortKey === "projectType"
                ? { projectType: sortDir }
                : sortKey === "status"
                  ? { status: sortDir }
                  : { updatedAt: sortDir };

    const where: Prisma.ListingWhereInput = {
        isProject: true,
        ...(statusFilter
            ? { status: statusFilter }
            : { status: { not: "ARCHIVED" as ListingStatus } }),
        ...(queryFilter
            ? {
                  OR: [
                      {
                          sku: {
                              contains: queryFilter,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          translations: {
                              some: {
                                  locale: "tr",
                                  title: {
                                      contains: queryFilter,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                      },
                      {
                          city: {
                              contains: queryFilter,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          district: {
                              contains: queryFilter,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          neighborhood: {
                              contains: queryFilter,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          projectType: {
                              contains: queryFilter,
                              mode: "insensitive" as const,
                          },
                      },
                  ],
              }
            : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(saleTypeFilter ? { saleType: saleTypeFilter } : {}),
        ...(companyFilter ? { company: companyFilter } : {}),
    };

    const [projects, companyOptionsFromProjects, companyOptionsFromConfig, homepageProjects] =
        await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    translations: {
                        where: { locale: "tr" },
                        take: 1,
                    },
                },
                orderBy,
            }),
            prisma.listing.findMany({
                select: { company: true },
                distinct: ["company"],
                where: {
                    isProject: true,
                    company: {
                        not: "",
                    },
                },
                orderBy: { company: "asc" },
            }),
            prisma.listingCompanyOption.findMany({
                select: { name: true },
                orderBy: { name: "asc" },
            }),
            prisma.listing.findMany({
                where: {
                    isProject: true,
                    status: "PUBLISHED",
                    homepageProjectSlot: { in: [1, 2, 3] },
                },
                select: {
                    id: true,
                    sku: true,
                    homepageProjectSlot: true,
                    translations: {
                        where: { locale: "tr" },
                        take: 1,
                        select: {
                            title: true,
                        },
                    },
                },
                orderBy: { homepageProjectSlot: "asc" },
                take: HOMEPAGE_PROJECT_LIMIT,
            }),
        ]);

    const companyOptions = Array.from(
        new Set([
            ...companyOptionsFromConfig.map((option) => option.name),
            ...companyOptionsFromProjects.map((project) => project.company),
        ])
    ).sort((a, b) => a.localeCompare(b, "tr-TR", { sensitivity: "base" }));

    const homepageProjectIds = new Set(homepageProjects.map((project) => project.id));
    const homepageProjectCount = homepageProjects.length;

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
                    <p className="mt-1 text-gray-500">
                        Single proje sayfasında ve ana sayfa carousel alanında kullanılacak proje
                        kayıtlarını yönetin.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <details className="group relative">
                        <summary className="btn btn-outline btn-md list-none cursor-pointer border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 [&::-webkit-details-marker]:hidden">
                            <Star className="h-4 w-4" />
                            <span>Ana Sayfa Carousel</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[360px] rounded-xl border border-gray-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                            {homepageProjects.length === 0 ? (
                                <div className="rounded-lg px-3 py-2.5 text-sm text-gray-400">
                                    Carousel için seçili proje yok.
                                </div>
                            ) : (
                                homepageProjects.map((project) => {
                                    const title =
                                        project.translations[0]?.title || "İsimsiz Proje";
                                    return (
                                        <Link
                                            key={project.id}
                                            href={`/admin/projeler/${project.id}`}
                                            className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                                            title="Carousel'e seçili projeyi aç"
                                        >
                                            <span className="font-semibold">
                                                {project.homepageProjectSlot}.
                                            </span>{" "}
                                            <span>{project.sku || title}</span>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </details>
                    <Link href="/admin/projeler/yeni" className="btn btn-primary btn-md">
                        <Plus className="h-4 w-4" />
                        Yeni Proje
                    </Link>
                </div>
            </div>

            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Link
                        href={buildUrl({ status: undefined })}
                        className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            !statusFilter
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Tümü
                    </Link>
                    <Link
                        href={buildUrl({ status: "ARCHIVED" })}
                        className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            statusFilter === "ARCHIVED"
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Arşiv
                    </Link>
                </div>
                {(queryFilter || typeFilter || saleTypeFilter || companyFilter) && (
                    <Link
                        href={buildUrl({
                            q: undefined,
                            type: undefined,
                            saleType: undefined,
                            company: undefined,
                        })}
                        className="text-sm text-gray-400 transition-colors hover:text-orange-500"
                    >
                        Temizle
                    </Link>
                )}
            </div>

            <div className="mb-1">
                <ProjectsFilters companyOptions={companyOptions} />
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                {renderSortHeader("sku", "SKU")}
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Proje
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                {renderSortHeader("type", "Tür")}
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                {renderSortHeader("projectType", "Kategori")}
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                {renderSortHeader("status", "Durum")}
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                {renderSortHeader("updatedAt", "Güncelleme")}
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                Ana Sayfa
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                İşlem
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((project) => {
                            const title =
                                project.translations[0]?.title || "Başlıksız Proje";
                            const location = [project.district, project.city]
                                .filter(Boolean)
                                .join(", ");

                            return (
                                <tr key={project.id} className="group transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        {project.sku || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 transition-colors group-hover:text-orange-600">
                                            {title}
                                        </p>
                                        <p className="text-sm text-gray-500">{location || "-"}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                            {getPropertyTypeLabel(project.type, "tr")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {project.projectType || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "rounded px-2 py-1 text-xs font-medium",
                                                getStatusBadgeClass(project.status)
                                            )}
                                        >
                                            {getStatusLabel(project.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ProjectHomepageCarouselToggle
                                            projectId={project.id}
                                            isSelected={homepageProjectIds.has(project.id)}
                                            isPublished={project.status === "PUBLISHED"}
                                            selectedCount={homepageProjectCount}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/projeler/${project.id}`}
                                            className="inline-flex rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Düzenle
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}

                        {projects.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-10 text-center text-sm text-gray-500"
                                >
                                    Henüz proje oluşturulmadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
