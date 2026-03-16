import assert from "node:assert/strict";
import test from "node:test";

import {
    buildTelegramContactSubmissionMessage,
    sendTelegramContactSubmissionNotification,
    type TelegramContactSubmission,
} from "./telegram-contact-submission";

const baseSubmission: TelegramContactSubmission = {
    id: "submission-123",
    sku: "GI-ALN-001",
    name: "Can",
    surname: "Altuntas",
    email: "can@example.com",
    phone: "+905551112233",
    message: "Merhaba, bu ilan icin detayli bilgi almak istiyorum.",
    locale: "tr",
    source: "listing-form",
    projectSlug: "alanya-luxury-flat",
    projectTitle: "Alanya Luxury Flat",
    createdAt: new Date("2026-03-16T10:00:00.000Z"),
};

test("buildTelegramContactSubmissionMessage formats submission details for Telegram", () => {
    const message = buildTelegramContactSubmissionMessage(baseSubmission, {
        adminBaseUrl: "https://admin.example.com",
    });

    assert.match(message, /Yeni form bildirimi/);
    assert.match(message, /Tip: Ilan Formu/);
    assert.match(message, /Ilan \/ Proje: Alanya Luxury Flat/);
    assert.match(message, /SKU: GI-ALN-001/);
    assert.match(message, /Slug \/ URL: alanya-luxury-flat/);
    assert.match(message, /Kayit No: submission-123/);
    assert.match(
        message,
        /Admin: https:\/\/admin\.example\.com\/admin\/formlar\/submission-123/
    );
});

test("sendTelegramContactSubmissionNotification skips and warns when Telegram env is missing", async () => {
    const warnings: unknown[] = [];
    let fetchCalled = false;

    const result = await sendTelegramContactSubmissionNotification(baseSubmission, {
        botToken: "",
        chatId: "",
        fetchImpl: async () => {
            fetchCalled = true;
            return new Response();
        },
        logger: {
            info: () => undefined,
            warn: (...args: unknown[]) => warnings.push(args),
            error: () => undefined,
        },
    });

    assert.equal(result, "skipped");
    assert.equal(fetchCalled, false);
    assert.equal(warnings.length, 1);
});

test("sendTelegramContactSubmissionNotification posts to Telegram and logs success", async () => {
    const infos: unknown[] = [];
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];

    const result = await sendTelegramContactSubmissionNotification(baseSubmission, {
        botToken: "bot-token",
        chatId: "-1001234567890",
        fetchImpl: async (url, init) => {
            fetchCalls.push({ url: String(url), init });
            return new Response(JSON.stringify({ ok: true, result: { message_id: 42 } }), {
                status: 200,
                headers: {
                    "content-type": "application/json",
                },
            });
        },
        logger: {
            info: (...args: unknown[]) => infos.push(args),
            warn: () => undefined,
            error: () => undefined,
        },
        adminBaseUrl: "https://admin.example.com",
    });

    assert.equal(result, "sent");
    assert.equal(fetchCalls.length, 1);
    assert.equal(
        fetchCalls[0]?.url,
        "https://api.telegram.org/botbot-token/sendMessage"
    );

    const body = JSON.parse(String(fetchCalls[0]?.init?.body)) as {
        chat_id: string;
        text: string;
    };

    assert.equal(body.chat_id, "-1001234567890");
    assert.match(body.text, /Yeni form bildirimi/);
    assert.match(body.text, /SKU: GI-ALN-001/);
    assert.match(body.text, /Admin: https:\/\/admin\.example\.com\/admin\/formlar\/submission-123/);
    assert.equal(infos.length, 1);
});

test("sendTelegramContactSubmissionNotification logs failure details without throwing", async () => {
    const errors: unknown[] = [];

    const result = await sendTelegramContactSubmissionNotification(baseSubmission, {
        botToken: "bot-token",
        chatId: "-1001234567890",
        fetchImpl: async () =>
            new Response(JSON.stringify({ ok: false, description: "chat not found" }), {
                status: 400,
                headers: {
                    "content-type": "application/json",
                },
            }),
        logger: {
            info: () => undefined,
            warn: () => undefined,
            error: (...args: unknown[]) => errors.push(args),
        },
    });

    assert.equal(result, "failed");
    assert.equal(errors.length, 1);
});
