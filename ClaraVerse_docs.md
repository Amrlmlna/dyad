Berikut adalah mapping file, folder, dan package yang relevan dengan fitur AI Automation Agent Builder dengan n8n embed di dalam folder ClaraVerse:

1. Komponen Utama Agent Builder
   src/components/AgentBuilder/

AgentBuilderToolbar.tsx
Canvas/Canvas.tsx
ExportModal.tsx
NodeCreator/
CustomNodeLibrary.tsx
CustomNodeManager.ts
NodeCreator.tsx
Nodes/ (berisi node fungsional untuk workflow)
APIRequestNode.tsx, LLMNode.tsx, StructuredLLMNode.tsx, dll.
UIBuilder/
UIBuilder.tsx, README.md
WorkflowManager.tsx
src/contexts/AgentBuilder/AgentBuilderContext.tsx
(context untuk state management Agent Builder)

src/types/agent/

types.ts
ui-builder.ts
src/hooks/useAutonomousAgentStatus.ts
(hook status agent autonomous)

2. Integrasi n8n
   src/components/N8N.tsx
   (komponen utama integrasi n8n)
   src/components/n8n_components/
   WorkflowCard.tsx, WorkflowModal.tsx
   workflows/n8n_workflows_full.json (definisi workflow n8n)
   utils/workflowsDB.ts (database workflow n8n)
3. Service & Logic Agent
   src/services/agents/
   nodeDefinitions.ts
   simpleNodeDefinitions.ts
   src/services/agentWorkflowStorage.ts
   src/services/claraAgentService.ts
   src/services/FlowCodeGenerator.ts
4. Library & Engine
   src/lib/agent-studio/

index.ts, constants.ts
tools/NodeGenerator.ts
cli/clara-studio.ts
src/shared/FlowEngine/

FlowExecutor.ts
NodeRegistry.ts
index.ts 5. Tipe & Utilitas
src/types/agent/
src/utils/
(terkait API, tools, dan client untuk agent & workflow)
Mekanisme & Flow Fitur
Agent Builder UI:
Pengguna membangun workflow agent melalui UI visual (Canvas, NodeCreator, Nodes, UIBuilder).
Node & Workflow Registry:
Setiap node (misal LLM, API, IfElse, dll) didaftarkan dan dieksekusi oleh engine (FlowEngine, NodeRegistry, FlowExecutor).
Integrasi n8n:
Workflow n8n dapat di-embed dan dijalankan melalui komponen N8N.tsx dan database workflow (n8n_workflows_full.json).
Service Layer:
Penyimpanan, eksekusi, dan manajemen agent/workflow di-handle oleh service (claraAgentService, agentWorkflowStorage, dll).
Library & CLI:
Mendukung pembuatan, eksekusi, dan ekspor workflow agent secara programatik.
Context & State:
State agent builder dikelola melalui context (AgentBuilderContext).

Fase Kedua: Deepdive & Identifikasi Detail Fitur AI Agent Automation Builder n8n Embed di ClaraVerse

1. Folder, Subfolder, dan File yang Terlibat (Deepdive)
   Selain mapping fase pertama, berikut detail tambahan yang ditemukan:

workflows/n8n_workflows_full.json
Definisi workflow n8n yang di-embed.

sdk/

src/ClaraFlowRunner.ts, flowEngine.js, nodeExecutor.js, dll.
(Engine eksekusi workflow, SDK untuk integrasi eksternal)
agent_exported/Testing_SDK_flow_sdk.json
(Contoh workflow agent yang diekspor)
examples/, templates/, test/, tests/
(Contoh, template, dan pengujian SDK/engine)
example-flows/

research-assistant-flow.json, simple-llm-flow.json
(Contoh workflow agent)
docs/agents/

README.md, building-agents.md, custom-nodes.md, node-library.md, sdk-usage.md, deployment.md
(Dokumentasi arsitektur, tutorial, node, SDK, deployment)
src/components/n8n_components/

WorkflowCard.tsx, WorkflowModal.tsx, workflowsDB.ts, dll.
(UI dan DB workflow n8n)
src/services/agentWorkflowStorage.ts
(Penyimpanan workflow agent)

src/lib/agent-studio/

tools/NodeGenerator.ts, cli/clara-studio.ts
(Library internal untuk builder dan CLI)
src/shared/FlowEngine/
(Eksekusi dan registry node)

src/components/AgentBuilder/Nodes/
(Node fungsional, termasuk AI, API, logic, input/output, custom)

src/components/AgentBuilder/NodeCreator/
(Manajemen dan pembuatan custom node)

src/components/AgentBuilder/UIBuilder/
(UI builder untuk workflow agent)

src/contexts/AgentBuilder/AgentBuilderContext.tsx
(State management builder)

src/hooks/useAutonomousAgentStatus.ts
(Status agent autonomous)

src/types/agent/
(Tipe data agent dan UI builder)

2. Detail Mekanisme Fitur
   A. Arsitektur & Flow
   Visual Workflow Builder
   Pengguna membangun workflow AI agent secara visual (drag-and-drop node di canvas).
   Node Library
   Tersedia node bawaan (input, output, AI, API, logic, file/image/pdf, custom).
   Custom Node
   Pengguna dapat membuat node sendiri dengan eksekusi JavaScript, input/output port, dan metadata.
   n8n Embed
   Workflow n8n dapat diintegrasikan, dijalankan, dan dimanage via UI dan database internal.
   Eksekusi Workflow
   Engine (FlowEngine, ClaraFlowRunner, nodeExecutor) mengeksekusi workflow secara berurutan/parallel sesuai koneksi node.
   Context & State
   State workflow, node, dan eksekusi dikelola via context dan service.
   Export & Deployment
   Workflow dapat diekspor ke format JSON, SDK, atau API (REST, WebSocket, Webhook, Container).
   B. Node & Workflow
   Node Types
   Input/Output: Data entry dan hasil
   Data Processing: JSON parser, text combiner, file/image/pdf upload
   Logic & Control: If/Else, loop, condition
   AI & Intelligence: LLM Chat, Structured LLM, Whisper Transcription
   Custom: Node buatan user
   Node Structure
   Metadata: name, type, description, icon, category
   Input/Output: port configuration
   Execution: JavaScript function (execute(inputs, properties, context))
   Workflow Structure
   Graph node (DAG), koneksi antar node, eksekusi berurutan/parallel/conditional
   C. Integrasi n8n
   Definisi Workflow
   Workflow n8n disimpan di n8n_workflows_full.json dan dapat di-load ke canvas.
   UI & DB
   Komponen UI (WorkflowCard, WorkflowModal) dan DB (workflowsDB.ts) untuk manajemen workflow n8n.
   Eksekusi
   Workflow n8n dapat dijalankan sebagai bagian dari agent automation.
   D. SDK & Adaptasi
   ClaraFlowRunner
   SDK untuk menjalankan workflow agent di aplikasi eksternal.
   Custom Node Registration
   SDK mendukung pendaftaran node custom.
   Eksekusi Otomatis
   Input, validasi, eksekusi, dan error handling otomatis.
   Export Format
   JSON, SDK, API, Container.
   E. Dokumentasi & Best Practice
   Tutorial & Reference
   Tersedia tutorial membangun agent, referensi node, pembuatan custom node, deployment, dan integrasi SDK.
   Best Practice
   Error handling, input validation, performance, logging, dan dokumentasi node.
   Kesimpulan Fase Kedua
   Semua folder, subfolder, dan file yang terlibat sudah teridentifikasi.
   Mekanisme dan arsitektur fitur AI Agent Automation Builder n8n embed di ClaraVerse sudah dipahami secara mendalam.
   Siap untuk mengadaptasi fitur ini ke proyek lain, baik untuk level adaptasi mudah (menggunakan SDK dan node bawaan), medium (custom node dan workflow), maupun sulit (integrasi engine, UI builder, dan workflow orchestration).
