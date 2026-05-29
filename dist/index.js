#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const BASE_URL = (process.env.TAMAWARU_BASE_URL ?? "https://www.tamawaru.com").replace(/\/$/, "");
// Phase 1 は公開 read-only API のラッパー (Bearer 認証は Phase 2)。
const TOOLS = [
    {
        name: "search_subsidies",
        description: "日本の補助金・助成金を検索する。エージェントが「うちの業種で取れる補助金は？」「東京都の補助金は？」と聞いたときに呼ぶ。tamawaru.com のクロール済データ (中央省庁 + 全都道府県) から返す。",
        inputSchema: {
            type: "object",
            properties: {
                keyword: { type: "string", description: "タイトル/キャッチに含むキーワード (任意)" },
                area: { type: "string", description: "都道府県名 例: 東京都 / 沖縄県 (任意)" },
                audience: { type: "string", enum: ["corporate", "individual"], description: "対象 (任意)" },
                source: { type: "string", description: "情報源 例: minister / pref-okinawa (任意)" },
                limit: { type: "number", default: 20, description: "件数 (最大 100)" },
            },
        },
    },
    {
        name: "get_subsidy",
        description: "補助金 ID を渡して詳細メタ (要件・上限額・締切・問い合わせ先) を取得する。",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string", description: "tamawaru の制度 ID (UUID または source-id)" },
            },
            required: ["id"],
        },
    },
];
const server = new Server({ name: "tamawaru-mcp", version: "0.1.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args = {} } = req.params;
    const a = args;
    if (name === "search_subsidies") {
        const keyword = a.keyword ? String(a.keyword) : undefined;
        const area = a.area ? String(a.area) : undefined;
        const audience = a.audience ? String(a.audience) : undefined;
        const source = a.source ? String(a.source) : undefined;
        const limit = Math.min(100, typeof a.limit === "number" ? a.limit : 20);
        const qs = new URLSearchParams({ limit: String(limit) });
        if (area)
            qs.set("area", area);
        if (audience)
            qs.set("audience", audience);
        if (source)
            qs.set("source", source);
        const res = await fetch(`${BASE_URL}/api/programs/recent?${qs}`);
        const body = (await res.json().catch(() => ({})));
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        let items = body.items ?? [];
        if (keyword) {
            const k = keyword.toLowerCase();
            items = items.filter((row) => {
                const t = String((row.title ?? "")).toLowerCase();
                const c = String((row.catch_phrase ?? "")).toLowerCase();
                return t.includes(k) || c.includes(k);
            });
        }
        return { content: [{ type: "text", text: JSON.stringify({ items, count: items.length }, null, 2) }] };
    }
    if (name === "get_subsidy") {
        const id = String(a.id ?? "");
        if (!id)
            throw new Error("id is required");
        const res = await fetch(`${BASE_URL}/api/programs/${encodeURIComponent(id)}`);
        const body = await res.json().catch(() => ({}));
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        return { content: [{ type: "text", text: JSON.stringify(body, null, 2) }] };
    }
    throw new Error(`Unknown tool: ${name}`);
});
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[tamawaru-mcp] ready");
