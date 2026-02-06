"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        alert("Mesajınız gönderildi!");
    };

    return (
        <main className="pt-24 pb-20 bg-white">
            {/* Header */}
            <section className="bg-gray-50 py-16">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        İletişime Geçin
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Sorularınız için bize ulaşın. Uzman ekibimiz en kısa sürede size
                        dönüş yapacaktır.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Adres</h3>
                                <p className="text-gray-500">
                                    Kestel Mah. Sahil Cad. No:123
                                    <br />
                                    Alanya / Antalya
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Telefon</h3>
                                <p className="text-gray-500">
                                    <a href="tel:+902421234567" className="hover:text-orange-500 transition-colors">
                                        +90 242 123 45 67
                                    </a>
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">E-posta</h3>
                                <p className="text-gray-500">
                                    <a
                                        href="mailto:info@guzelinvest.com"
                                        className="hover:text-orange-500 transition-colors"
                                    >
                                        info@guzelinvest.com
                                    </a>
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Çalışma Saatleri</h3>
                                <p className="text-gray-500">
                                    Pazartesi - Cumartesi
                                    <br />
                                    09:00 - 18:00
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Bize Mesaj Gönderin
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Adınız Soyadınız"
                                            name="name"
                                            placeholder="Adınızı girin"
                                            required
                                        />
                                        <Input
                                            label="E-posta Adresiniz"
                                            name="email"
                                            type="email"
                                            placeholder="ornek@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Telefon Numaranız"
                                            name="phone"
                                            type="tel"
                                            placeholder="+90 5XX XXX XX XX"
                                        />
                                        <Input
                                            label="Konu"
                                            name="subject"
                                            placeholder="Mesaj konusu"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mesajınız
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={5}
                                            className="input resize-none"
                                            placeholder="Mesajınızı buraya yazın..."
                                            required
                                        ></textarea>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        loading={loading}
                                        icon={<Send className="w-4 h-4" />}
                                        className="w-full md:w-auto"
                                    >
                                        Mesaj Gönder
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="bg-gray-100 h-96 flex items-center justify-center">
                <p className="text-gray-400">Harita buraya eklenecek</p>
            </section>
        </main>
    );
}
