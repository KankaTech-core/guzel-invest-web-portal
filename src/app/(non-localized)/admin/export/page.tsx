"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    FileSpreadsheet,
    Filter,
    Loader2,
    Upload,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportJob {
    id: string;
    type: string;
    status: string;
    filters: Record<string, unknown> | null;
    rowCount: number | null;
    createdAt: string;
    completedAt: string | null;
    createdBy: {
        name: string;
        email: string;
    };
}

interface ImportResult {
    entity: "listings" | "projects" | "articles";
    total: number;
    created: number;
    updated: number;
    failed: number;
    errors: Array<{ row: number; message: string }>;
}

const ENTITY_OPTIONS = [
    { value: "listings", label: "İlanlar" },
    { value: "projects", label: "Projeler" },
    { value: "articles", label: "Makaleler" },
] as const;

const PROPERTY_TYPES = [
    { value: "", label: "Tümü" },
    { value: "APARTMENT", label: "Daire" },
    { value: "VILLA", label: "Villa" },
    { value: "PENTHOUSE", label: "Penthouse" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
    { value: "FARM", label: "Çiftlik" },
];

const LISTING_STATUS_OPTIONS = [
    { value: "", label: "Tümü" },
    { value: "DRAFT", label: "Taslak" },
    { value: "PUBLISHED", label: "Yayında" },
    { value: "ARCHIVED", label: "Arşiv" },
    { value: "REMOVED", label: "Kaldırıldı" },
];

const ARTICLE_STATUS_OPTIONS = [
    { value: "", label: "Tümü" },
    { value: "DRAFT", label: "Taslak" },
    { value: "PUBLISHED", label: "Yayında" },
    { value: "ARCHIVED", label: "Arşiv" },
    { value: "REMOVED", label: "Kaldırıldı" },
];

const ARTICLE_CATEGORY_OPTIONS = [
    { value: "", label: "Tüm Kategoriler" },
    { value: "Yatırım Rehberi", label: "Yatırım Rehberi" },
    { value: "Piyasa Analizi", label: "Piyasa Analizi" },
    { value: "Alım Satım", label: "Alım Satım" },
    { value: "Mülk Yönetimi", label: "Mülk Yönetimi" },
    { value: "Vergi ve Hukuk", label: "Vergi ve Hukuk" },
];

const getJobDisplayLabel = (type: string) => {
    if (type === "csv:listings") return "CSV Export • İlanlar";
    if (type === "csv:projects") return "CSV Export • Projeler";
    if (type === "csv:articles") return "CSV Export • Makaleler";
    if (type === "import:listings") return "CSV Import • İlanlar";
    if (type === "import:projects") return "CSV Import • Projeler";
    if (type === "import:articles") return "CSV Import • Makaleler";
    return type;
};

const getEntityFilePrefix = (entity: "listings" | "projects" | "articles") => {
    if (entity === "projects") return "projeler";
    if (entity === "articles") return "makaleler";
    return "ilanlar";
};

export default function ExportPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);

    const [entity, setEntity] = useState<"listings" | "projects" | "articles">(
        "listings"
    );

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        category: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchExportJobs();
    }, []);

    const fetchExportJobs = async () => {
        try {
            const response = await fetch("/api/admin/export");
            if (response.ok) {
                const data = await response.json();
                setExportJobs(data);
            }
        } catch (err) {
            console.error("Error fetching export jobs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const activeFilters: Record<string, string> = {};

            if (filters.status) activeFilters.status = filters.status;
            if (filters.startDate) activeFilters.startDate = filters.startDate;
            if (filters.endDate) activeFilters.endDate = filters.endDate;

            if (entity !== "articles" && filters.type) {
                activeFilters.type = filters.type;
            }

            if (entity === "articles" && filters.category) {
                activeFilters.category = filters.category;
            }

            const response = await fetch("/api/admin/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entity, filters: activeFilters }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || "Export başarısız");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${getEntityFilePrefix(entity)}-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            await fetchExportJobs();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            setError("Import için CSV dosyası seçin.");
            return;
        }

        setIsImporting(true);
        setError(null);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append("entity", entity);
            formData.append("file", importFile);

            const response = await fetch("/api/admin/import", {
                method: "POST",
                body: formData,
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload?.error || "Import başarısız");
            }

            setImportResult(payload as ImportResult);
            setImportFile(null);
            await fetchExportJobs();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsImporting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "FAILED":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "PROCESSING":
                return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "Tamamlandı";
            case "FAILED":
                return "Hata";
            case "PROCESSING":
                return "İşleniyor";
            default:
                return "Bekliyor";
        }
    };

    const statusOptions =
        entity === "articles" ? ARTICLE_STATUS_OPTIONS : LISTING_STATUS_OPTIONS;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dışa / İçe Aktarım</h1>
                <p className="mt-1 text-gray-500">
                    İlan, proje ve makale verilerini CSV olarak dışa aktarın veya içe alın.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-8 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <Filter className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">CSV Export</h2>
                            <p className="text-sm text-gray-500">
                                Entity seçin, filtre uygulayın ve CSV indirin.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Veri Türü
                            </label>
                            <select
                                value={entity}
                                onChange={(event) =>
                                    setEntity(
                                        event.target.value as
                                            | "listings"
                                            | "projects"
                                            | "articles"
                                    )
                                }
                                className="input"
                            >
                                {ENTITY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Durum
                            </label>
                            <select
                                value={filters.status}
                                onChange={(event) =>
                                    setFilters({ ...filters, status: event.target.value })
                                }
                                className="input"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {entity !== "articles" ? (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Mülk Tipi
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(event) =>
                                        setFilters({ ...filters, type: event.target.value })
                                    }
                                    className="input"
                                >
                                    {PROPERTY_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Kategori
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(event) =>
                                        setFilters({ ...filters, category: event.target.value })
                                    }
                                    className="input"
                                >
                                    {ARTICLE_CATEGORY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Başlangıç Tarihi
                            </label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(event) =>
                                    setFilters({ ...filters, startDate: event.target.value })
                                }
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Bitiş Tarihi
                            </label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(event) =>
                                    setFilters({ ...filters, endDate: event.target.value })
                                }
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4">
                        <button
                            onClick={() =>
                                setFilters({
                                    status: "",
                                    type: "",
                                    category: "",
                                    startDate: "",
                                    endDate: "",
                                })
                            }
                            className="btn btn-ghost btn-md"
                        >
                            Filtreleri Temizle
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="btn btn-primary btn-md"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Dışa Aktarılıyor...
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="h-4 w-4" />
                                    CSV Olarak İndir
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Upload className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">CSV Import</h2>
                            <p className="text-sm text-gray-500">
                                Aynı formatta CSV dosyasını seçip içe aktarın.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Veri Türü
                            </label>
                            <select
                                value={entity}
                                onChange={(event) =>
                                    setEntity(
                                        event.target.value as
                                            | "listings"
                                            | "projects"
                                            | "articles"
                                    )
                                }
                                className="input"
                            >
                                {ENTITY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                CSV Dosyası
                            </label>
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(event) =>
                                    setImportFile(event.target.files?.[0] || null)
                                }
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        {importFile ? (
                            <span>Seçilen dosya: {importFile.name}</span>
                        ) : (
                            <span>Dosya seçilmedi.</span>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <button
                            onClick={handleImport}
                            disabled={isImporting || !importFile}
                            className="btn btn-outline btn-md"
                        >
                            {isImporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    İçe Aktarılıyor...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    CSV İçeri Al
                                </>
                            )}
                        </button>
                    </div>

                    {importResult ? (
                        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                            <p className="font-medium text-gray-900">
                                Import sonucu: {importResult.total} satır işlendi
                            </p>
                            <p className="mt-1 text-gray-700">
                                Oluşturulan: {importResult.created} • Güncellenen: {importResult.updated} • Hatalı: {importResult.failed}
                            </p>

                            {importResult.errors.length > 0 ? (
                                <div className="mt-3 space-y-1 text-red-600">
                                    {importResult.errors.slice(0, 8).map((item) => (
                                        <p key={`${item.row}-${item.message}`}>
                                            Satır {item.row}: {item.message}
                                        </p>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                            <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Aktarım Geçmişi</h2>
                            <p className="text-sm text-gray-500">Son dışa/içe aktarım işlemleri</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : exportJobs.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            Henüz aktarım yapılmamış
                        </div>
                    ) : (
                        exportJobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-gray-100 p-2">
                                        {job.type.startsWith("import:") ? (
                                            <Upload className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <Download className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {getJobDisplayLabel(job.type)}
                                            {job.rowCount !== null ? (
                                                <span className="ml-2 font-normal text-gray-500">
                                                    ({job.rowCount} satır)
                                                </span>
                                            ) : null}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(job.createdAt).toLocaleString("tr-TR")} • {job.createdBy.name}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={cn(
                                        "flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium",
                                        job.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : job.status === "FAILED"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-gray-100 text-gray-600"
                                    )}
                                >
                                    {getStatusIcon(job.status)}
                                    {getStatusLabel(job.status)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
