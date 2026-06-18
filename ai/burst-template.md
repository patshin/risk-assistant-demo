# Codex Burst Prompt

请执行一个 Codex Burst。

先阅读：
- `AGENTS.md`
- `ai/memory.md`
- `ai/decisions.md`
- 与当前任务相关的文件

任务：
[写清楚本次只做什么]

范围：
[允许修改的文件或目录]

约束：
- 只做当前任务
- 不重构无关代码
- 不引入新依赖，除非先说明理由
- 如果需要修改超过 3 个文件，先停下说明原因
- 保持当前项目 UI 风格
- 保持 TypeScript / lint 通过

验收：
- [写清楚成功标准]
- 运行相关检查命令
- 总结改动文件
- 总结测试结果
- 告诉我 `ai/memory.md` / `ai/tasks.md` / `ai/decisions.md` / `ai/daily-log.md` 是否需要更新

执行方式：
1. 先给计划，不要直接修改代码
2. 等我确认后再改
3. 改完运行检查
4. 最后输出 compact 总结
