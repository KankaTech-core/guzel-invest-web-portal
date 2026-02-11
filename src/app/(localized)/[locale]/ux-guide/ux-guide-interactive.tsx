"use client";

import { useState } from "react";
import { Building2, Mail, MapPin, User } from "lucide-react";
import { Button, Card, Checkbox, Input, RangeSlider } from "@/components/ui";

export default function UxGuideInteractive() {
    const [range, setRange] = useState<[number, number]>([150000, 650000]);
    const [buySellSupport, setBuySellSupport] = useState(true);
    const [constructionSupport, setConstructionSupport] = useState(false);
    const [taxSupport, setTaxSupport] = useState(true);
    const [citizenshipSupport, setCitizenshipSupport] = useState(false);
    const selectedSupportCount = [buySellSupport, constructionSupport, taxSupport, citizenshipSupport].filter(Boolean).length;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="md" className="border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Yatırım ve Hizmet Brifi
                </h3>
                <div className="space-y-4">
                    <Input
                        label="Ad Soyad"
                        name="ux-name"
                        placeholder="Örnek: Ahmet Demir"
                        icon={<User className="w-4 h-4" />}
                    />
                    <Input
                        label="E-posta"
                        name="ux-email"
                        placeholder="ornek@email.com"
                        icon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                        label="Hedef Lokasyon"
                        name="ux-location"
                        placeholder="Örnek: Alanya, Oba"
                        icon={<MapPin className="w-4 h-4" />}
                    />
                    <Input
                        label="Mülk Tipi Önceliği"
                        name="ux-property-type"
                        placeholder="Örnek: Arsa, daire, dükkan"
                        icon={<Building2 className="w-4 h-4" />}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kısa Brif
                        </label>
                        <textarea
                            rows={4}
                            className="input resize-none"
                            placeholder="Satın alma, inşaat veya vergi sürecindeki ihtiyacınızı kısaca yazın."
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button type="button">Danışmanlık Talebi Oluştur</Button>
                        <Button type="button" variant="outline">
                            Taslağı Temizle
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Form dili her zaman net ve karar odaklı olmalı. Açık bir süreç sorusu, genel talep sorusundan daha doğru lead toplar.
                    </p>
                </div>
            </Card>

            <Card padding="md" className="border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Yatırım Bütçesi Aralığı (EUR)
                    </h3>
                    <span className="text-sm text-gray-500">
                        {range[0].toLocaleString("tr-TR")} - {range[1].toLocaleString("tr-TR")}
                    </span>
                </div>
                <div className="space-y-6">
                    <RangeSlider
                        min={50000}
                        max={1500000}
                        step={25000}
                        value={range}
                        onChange={setRange}
                        formatLabel={(value) => `${value.toLocaleString("tr-TR")} €`}
                    />
                    <div className="space-y-3">
                        <Checkbox
                            checked={buySellSupport}
                            onChange={setBuySellSupport}
                            label="Alım-satım portföy danışmanlığı"
                        />
                        <Checkbox
                            checked={constructionSupport}
                            onChange={setConstructionSupport}
                            label="İnşaat proje takibi ve teslim süreci"
                        />
                        <Checkbox
                            checked={taxSupport}
                            onChange={setTaxSupport}
                            label="Vergi planlama ve resmi süreç desteği"
                        />
                        <Checkbox
                            checked={citizenshipSupport}
                            onChange={setCitizenshipSupport}
                            label="Vatandaşlık/ikamet uygunluk yönlendirmesi"
                        />
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Seçili Hizmet Sayısı</p>
                        <p className="text-2xl font-semibold text-gray-900">{selectedSupportCount}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Bu kart, /3 ve /8&apos;deki veri kartı mantığını form deneyimine taşır.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
