---
name: headroom
description: Context compression, token reduction, and memory optimization for LLM agents. Use when optimizing context window usage, compressing large tool outputs/logs/JSON data, using headroom CLI or MCP tools (headroom_compress, headroom_retrieve), or running session failure learning.
---

# Headroom â€” Context & Token Optimization

Headroom is an intelligent context compression layer for AI agents. It compresses tool outputs, build logs, file diffs, and large JSON payloads before they hit the model context, delivering identical semantic accuracy with 60â€“95% fewer tokens.

## Core Capabilities

1. **SmartCrusher (JSON & Structured Data)**: Statistical compression of JSON arrays and large API responses (70â€“90% reduction).
2. **Code Compression**: AST-aware compression (via tree-sitter) preserving type signatures, exports, and critical logic while pruning internal verbosity.
3. **Log & Diff Compression**: Retains error traces, exception stacks, and fatal lines byte-for-byte while stripping repetitive polling or boilerplate.
4. **CCR (Compress-Cache-Retrieve)**: Compression is reversible. Original outputs are cached locally and retrieved on demand via headroom_retrieve.
5. **Cross-Agent Memory & Session Learning**: headroom learn analyzes past command outputs and failed sessions, writing persistent corrections directly to GEMINI.md and AGENTS.md.

## Quick Start CLI

\\\ash
# Verify installation
headroom --version

# Run local proxy on port 8787
headroom proxy --port 8787

# Wrap an agent session
headroom wrap gemini

# Mine failed sessions and write permanent corrections to AGENTS.md / GEMINI.md
headroom learn
\\\

## MCP Integration

Headroom provides three primary MCP tools:
- \headroom_compress\: Compresses raw text, logs, or structured payloads.
- \headroom_retrieve\: Fetches cached original uncompressed content using a chunk ID.
- \headroom_stats\: Displays cumulative token savings and cache hit ratios.

## Usage Protocol

1. **High-Volume Tool Outputs**: When reading massive logs or database dumps, use Headroom compression or focus on target lines rather than dumping megabytes into the context.
2. **On-Demand Expansion**: When a compressed summary points to a critical error, retrieve the full verbatim snippet for precise line edits.
3. **Session Failure Learning**: Whenever a complex workflow fails and gets resolved, run or recommend \headroom learn\ to record persistent instructions for future runs.