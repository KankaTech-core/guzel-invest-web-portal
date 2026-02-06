"use client";

import { useState, useEffect } from "react";
import {
    Download,
    FileSpreadsheet,
    Filter,
    Loader2,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportJob {
    id: string;
    type: string;
    status: string;
    filters: Record<string, string> | null;
    rowCount: number | null;
    createdAt: string;
    completedAt: string | null;
    createdBy: {
        name: string;
        email: string;
    };
}

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

const STATUS_OPTIONS = [
    { value: "", label: "Tümü" },
    { value: "DRAFT", label: "Taslak" },
    { value: "PUBLISHED", label: "Yayında" },
    { value: "ARCHIVED", label: "Arşiv" },
    { value: "REMOVED", label: "Kaldırıldı" },
];

export default function ExportPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state
    const [filters, setFilters] = useState({
        status: "",
        type: "",
        startDate: "",
        endDate: "",
    });

    // Fetch export history
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
            // Build filters object, removing empty values
            const activeFilters: Record<string, string> = {};
            if (filters.status) activeFilters.status = filters.status;
            if (filters.type) activeFilters.type = filters.type;
            if (filters.startDate) activeFilters.startDate = filters.startDate;
            if (filters.endDate) activeFilters.endDate = filters.endDate;

            const response = await fetch("/api/admin/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filters: activeFilters }),
            });

            if (!response.ok) {
                throw new Error("Export başarısız");
            }

            // Download the CSV
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ilanlar-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            // Refresh export history
            fetchExportJobs();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsExporting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "FAILED":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "PROCESSING":
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
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

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dışa Aktarım</h1>
                <p className="text-gray-500 mt-1">
                    İlanları CSV formatında dışa aktarın
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Filter className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Filtreler</h2>
                            <p className="text-sm text-gray-500">
                                Dışa aktarılacak ilanları filtreleyin
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Durum
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({ ...filters, status: e.target.value })
                                }
                                className="input"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mülk Tipi
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    setFilters({ ...filters, type: e.target.value })
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Başlangıç Tarihi
                            </label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    setFilters({ ...filters, startDate: e.target.value })
                                }
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bitiş Tarihi
                            </label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    setFilters({ ...filters, endDate: e.target.value })
                                }
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4">
                        <button
                            onClick={() =>
                                setFilters({ status: "", type: "", startDate: "", endDate: "" })
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
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Dışa Aktarılıyor...
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-4 h-4" />
                                    CSV Olarak İndir
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Export History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Export Geçmişi</h2>
                            <p className="text-sm text-gray-500">
                                Son dışa aktarım işlemleri
                            </p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                        </div>
                    ) : exportJobs.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            Henüz dışa aktarım yapılmamış
                        </div>
                    ) : (
                        exportJobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FileSpreadsheet className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            CSV Export
                                            {job.rowCount && (
                                                <span className="text-gray-500 font-normal ml-2">
                                                    ({job.rowCount} satır)
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(job.createdAt).toLocaleString("tr-TR")} •{" "}
                                            {job.createdBy.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium",
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
