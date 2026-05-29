# @shown06/tamawaru-mcp

[![MCP-compatible](https://img.shields.io/badge/MCP-compatible-7c4dff)](https://modelcontextprotocol.io)
[![Works with Claude](https://img.shields.io/badge/Works%20with-Claude%20Desktop-d97757)](https://claude.ai)
[![Works with Cursor](https://img.shields.io/badge/Works%20with-Cursor-000000)](https://cursor.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Shown06/tamawaru-mcp?style=social)](https://github.com/Shown06/tamawaru-mcp/stargazers)


> Japanese government subsidy search MCP — 6,000+ programs (central + 47 prefectures). Free during Phase 1.

**LP**: [https://www.tamawaru.com/agents](https://www.tamawaru.com/agents) · **Setup**: see below · **Pricing & Use Cases**: on the LP

tamawaru.com の日本補助金・助成金検索を Claude Desktop / Cursor から呼ぶための MCP サーバー。Phase 1 は公開 read-only API のラッパー (API キー不要)。

## セットアップ

```json
{
  "mcpServers": {
    "tamawaru": {
      "command": "npx",
      "args": ["-y", "github:Shown06/tamawaru-mcp"]
    }
  }
}
```

## 利用可能な tool

| tool | 用途 |
|---|---|
| `search_subsidies` | キーワード / 都道府県 / 対象 (法人/個人) / 情報源で補助金を検索 |
| `get_subsidy` | 補助金 ID から詳細メタ (要件・上限額・締切) を取得 |

## Phase 2 予定

- Bearer 認証 + Agent Plan (Free / Starter $19 / Pro $59)
- `match_subsidies(business_info)` — 企業情報からマッチング
- `draft_application(subsidy_id)` — 申請書下書き生成

---

## ⭐ Star this repo if you find it useful

The MCP/Agent economy is brand new — every star helps signal that "agents calling production SaaS via MCP" is a viable pattern worth investing in.

If you ship a production MCP server too, link it back here and I'll cross-link in the README.

## Related production MCP servers (same author)

These four were shipped together as a coherent set:

- [airlogicpro-mcp](https://github.com/Shown06/airlogicpro-mcp) — App Store category opportunity scoring
- [aimieru-mcp](https://github.com/Shown06/aimieru-mcp) — Japanese AIO citation tracking
- [paperbotai-mcp](https://github.com/Shown06/paperbotai-mcp) — Multi-channel manual RAG
- [tamawaru-mcp](https://github.com/Shown06/tamawaru-mcp) — Japanese government subsidy search

All four share the same auth / billing / monitoring patterns. See the [technical writeup](https://github.com/Shown06/airlogicpro-mcp/blob/main/README.md) for production patterns (Bearer + SHA-256 hash + atomic SQL counter + Stripe Agent plan separation).

## Author

[@asab0077](https://x.com/asab0077) — solo operator running four small Japanese SaaS. MCP shipped 2026-05-29 as a single-day batch.
