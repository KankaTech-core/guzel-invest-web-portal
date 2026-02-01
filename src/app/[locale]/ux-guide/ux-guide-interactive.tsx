"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, User } from "lucide-react";
import { Button, Card, Checkbox, Input, RangeSlider } from "@/components/ui";

export default function UxGuideInteractive() {
    const t = useTranslations();
    const [range, setRange] = useState<[number, number]>([20, 80]);
    const [updates, setUpdates] = useState(true);
    const [terms, setTerms] = useState(false);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="md" className="border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("uxGuide.forms.title")}
                </h3>
                <div className="space-y-4">
                    <Input
                        label={t("uxGuide.forms.nameLabel")}
                        name="ux-name"
                        placeholder={t("uxGuide.forms.namePlaceholder")}
                        icon={<User className="w-4 h-4" />}
                    />
                    <Input
                        label={t("uxGuide.forms.emailLabel")}
                        name="ux-email"
                        placeholder={t("uxGuide.forms.emailPlaceholder")}
                        icon={<Mail className="w-4 h-4" />}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("uxGuide.forms.messageLabel")}
                        </label>
                        <textarea
                            rows={3}
                            className="input resize-none"
                            placeholder={t("uxGuide.forms.messagePlaceholder")}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button type="button">{t("common.save")}</Button>
                        <Button type="button" variant="outline">
                            {t("common.cancel")}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        {t("uxGuide.forms.hint")}
                    </p>
                </div>
            </Card>

            <Card padding="md" className="border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t("uxGuide.examples.sliderLabel")}
                    </h3>
                    <span className="text-sm text-gray-500">{range[0]} - {range[1]}</span>
                </div>
                <div className="space-y-6">
                    <RangeSlider
                        min={0}
                        max={100}
                        step={5}
                        value={range}
                        onChange={setRange}
                    />
                    <div className="space-y-3">
                        <Checkbox
                            checked={updates}
                            onChange={setUpdates}
                            label={t("uxGuide.examples.checkboxUpdates")}
                        />
                        <Checkbox
                            checked={terms}
                            onChange={setTerms}
                            label={t("uxGuide.examples.checkboxTerms")}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
