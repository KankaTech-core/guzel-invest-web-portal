"use client";

import { FormEvent, useState } from "react";
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Plus,
    Shield,
    User,
    UserPlus,
} from "lucide-react";
import { Button, Input } from "@/components/ui";

const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Admin" },
    { value: "EDITOR", label: "Editör" },
    { value: "VIEWER", label: "Görüntüleyici" },
] as const;

type UserRole = (typeof ROLE_OPTIONS)[number]["value"];

interface UserListItem {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

interface UsersManagementProps {
    initialUsers: UserListItem[];
}

interface UserFormState {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

interface LastCreatedCredentials {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

const INITIAL_FORM_STATE: UserFormState = {
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
};

const roleMeta: Record<
    UserRole,
    { label: string; badgeClass: string; description: string }
> = {
    ADMIN: {
        label: "Admin",
        badgeClass: "bg-purple-100 text-purple-700",
        description: "Tüm işlemleri yapabilir",
    },
    EDITOR: {
        label: "Editör",
        badgeClass: "bg-blue-100 text-blue-700",
        description: "İçerik oluşturabilir ve güncelleyebilir",
    },
    VIEWER: {
        label: "Görüntüleyici",
        badgeClass: "bg-slate-100 text-slate-700",
        description: "Sadece görüntüleme yetkisi",
    },
};

export function UsersManagement({ initialUsers }: UsersManagementProps) {
    const [users, setUsers] = useState(initialUsers);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formState, setFormState] = useState<UserFormState>(INITIAL_FORM_STATE);
    const [lastCreatedCredentials, setLastCreatedCredentials] =
        useState<LastCreatedCredentials | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const handleChange = <K extends keyof UserFormState>(
        key: K,
        value: UserFormState[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);
        setIsCopied(false);

        const payload = {
            name: formState.name.trim(),
            email: formState.email.trim().toLowerCase(),
            password: formState.password.trim(),
            role: formState.role,
        };

        try {
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = (await response.json()) as {
                error?: string;
                user?: UserListItem;
            };

            const createdUser = data.user;

            if (!response.ok || !createdUser) {
                throw new Error(data.error || "Kullanıcı oluşturulamadı");
            }

            setUsers((prev) => [createdUser, ...prev]);
            setLastCreatedCredentials({
                name: payload.name,
                email: payload.email,
                password: payload.password,
                role: payload.role,
            });
            setSuccessMessage("Kullanıcı başarıyla oluşturuldu.");
            setFormState(INITIAL_FORM_STATE);
            setIsPasswordVisible(false);
            setIsCreateOpen(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Bir hata oluştu"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyCredentials = async () => {
        if (!lastCreatedCredentials) return;

        const credentialsText = [
            "Güzel Invest Admin Panel Giriş Bilgileri",
            `Ad Soyad: ${lastCreatedCredentials.name}`,
            `E-posta: ${lastCreatedCredentials.email}`,
            `Şifre: ${lastCreatedCredentials.password}`,
            `Rol: ${roleMeta[lastCreatedCredentials.role].label}`,
        ].join("\n");

        try {
            await navigator.clipboard.writeText(credentialsText);
            setIsCopied(true);
        } catch {
            setErrorMessage("Kopyalama başarısız oldu. Lütfen manuel kopyalayın.");
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
                    <p className="text-gray-500 mt-1">
                        Admin paneline erişecek kullanıcıları yönetin
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-amber-500" />
                        Sadece Admin kullanıcılar yönetebilir
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setIsCreateOpen((prev) => !prev);
                            setErrorMessage("");
                            setSuccessMessage("");
                        }}
                        className="btn btn-primary btn-md"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Kullanıcı
                    </button>
                </div>
            </div>

            {isCreateOpen && (
            <div className="max-w-4xl mx-auto grid lg:grid-cols-[minmax(0,430px),minmax(0,1fr)] gap-6 mb-8">
                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <UserPlus className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Yeni Kullanıcı Oluştur</h2>
                            <p className="text-xs text-gray-500">
                                E-posta ve şifre bilgisiyle giriş yapabilir
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="name"
                            label="Ad Soyad"
                            value={formState.name}
                            onChange={(event) => handleChange("name", event.target.value)}
                            placeholder="Örn: Ahmet Yılmaz"
                            autoComplete="name"
                            required
                        />

                        <Input
                            name="email"
                            type="email"
                            label="E-posta"
                            value={formState.email}
                            onChange={(event) => handleChange("email", event.target.value)}
                            placeholder="kullanici@sirket.com"
                            autoComplete="email"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    value={formState.password}
                                    onChange={(event) =>
                                        handleChange("password", event.target.value)
                                    }
                                    placeholder="En az 8 karakter"
                                    className="input pr-11"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label={
                                        isPasswordVisible
                                            ? "Şifreyi gizle"
                                            : "Şifreyi göster"
                                    }
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Rol
                            </label>
                            <select
                                id="role"
                                value={formState.role}
                                onChange={(event) =>
                                    handleChange("role", event.target.value as UserRole)
                                }
                                className="input"
                            >
                                {ROLE_OPTIONS.map((roleOption) => (
                                    <option key={roleOption.value} value={roleOption.value}>
                                        {roleOption.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                {roleMeta[formState.role].description}
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-sm text-emerald-700">
                                {successMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={isSubmitting}
                            icon={<Plus className="w-4 h-4" />}
                            className="w-full"
                        >
                            Kullanıcıyı Oluştur
                        </Button>
                    </form>
                </section>

                <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,104,3,0.35),_transparent_45%)]" />
                    <div className="relative">
                        <h2 className="text-lg font-semibold">Son Oluşturulan Giriş Bilgisi</h2>
                        <p className="text-slate-300 text-sm mt-1">
                            Yeni oluşturduğunuz kullanıcı bilgilerini buradan hızlıca paylaşabilirsiniz.
                        </p>

                        {lastCreatedCredentials ? (
                            <div className="mt-5 rounded-xl bg-white/10 border border-white/15 p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-slate-300">Ad Soyad</p>
                                    <p className="font-medium">{lastCreatedCredentials.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">E-posta</p>
                                    <p className="font-medium">{lastCreatedCredentials.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">Şifre</p>
                                    <p className="font-medium tracking-wide">
                                        {lastCreatedCredentials.password}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">Rol</p>
                                    <p className="font-medium">
                                        {roleMeta[lastCreatedCredentials.role].label}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={copyCredentials}
                                    className="btn btn-primary btn-sm w-full"
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Kopyalandı
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Bilgileri Kopyala
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-5 rounded-xl bg-white/10 border border-dashed border-white/20 p-6 text-sm text-slate-300">
                                Formu doldurup kullanıcı oluşturduğunuzda paylaşım için hazır
                                giriş bilgileri bu alanda görünecek.
                            </div>
                        )}
                    </div>
                </section>
            </div>
            )}

            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Kayıtlı Kullanıcılar ({users.length})
                </h2>

                {users.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                        Henüz kullanıcı bulunmuyor.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <article
                                key={user.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${roleMeta[user.role].badgeClass}`}
                                    >
                                        {roleMeta[user.role].label}
                                    </span>
                                </div>

                                <h3 className="font-bold text-gray-900 mb-1">{user.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 break-all">{user.email}</p>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        {new Intl.DateTimeFormat("tr-TR", {
                                            dateStyle: "medium",
                                        }).format(new Date(user.createdAt))}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            </div>
        </div>
    );
}
