# @tamawaru/mcp-server

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
