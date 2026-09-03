# 多张图片如何扩展

1. 复制 `src/data/sheets/01.json` 为 `02.json` / `03.json` …
2. 按图片**从上到下、从左到右的原顺序**逐行填入 `categories[].words[]`，保持 `{ en, ar }` 顺序不变（切勿按字母排序）。
3. 保存后首页顶部会自动出现 Sheet 选择器（基于 `import.meta.glob` 自动发现 `src/data/sheets/*.json`）。
4. 也可一次性把所有表合并到 `src/data/vocab.json`，但推荐用 `sheets/` 分文件便于维护。
5. 若图片很多，可用脚本批量转换：每张图一个 JSON，id 递增即可。

`_template.json` 仅为模板，不会被加载（以下划线开头会被过滤）。
