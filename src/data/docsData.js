export const docsData = [
  {
    id: "system-architecture",
    title: "System Architecture & Product Spec",
    category: "Architecture",
    badge: "Specification",
    icon: "Cpu",
    summary: "Complete technical architecture, component stack, 10 pain-point solutions, advanced features, and product roadmap.",
    content: `# PeritiaOS: Developer-Centric Operating System Architecture Specification

> [!IMPORTANT]
> **Product Vision:** PeritiaOS is a specialized, developer-first Linux distribution engineered to eliminate development setup friction, optimize compilation and container I/O performance, provide low-overhead system observability out-of-the-box, and guarantee strict environment parity across development, testing, and production environments.

---

## 1. System Overview & Core Technical Specifications

| System Dimension | Specification / Architecture Standard |
| :--- | :--- |
| **Base Ecosystem** | Linux Kernel with custom cgroups v2, sysctl, and eBPF tuning |
| **Primary Target** | Software Engineers, Systems Programmers, DevOps/SREs |
| **Package Manager** | Custom Rust/Go binary package manager with SAT-based SemVer resolution |
| **Default Filesystem** | Btrfs (Copy-on-Write enabled, \`zstd\` compression) + \`tmpfs\` RAM disk mounts |
| **Container Engine** | Rootless Podman / Docker integrated via cgroups v2 & Fuse-OverlayFS |
| **Telemetry & Tracing** | Native eBPF probes, \`perf\`, \`strace\` wrappers (\`peritia-trace\`, \`peritia-profile\`) |
| **First-Boot Time to Code** | **< 10 minutes** (Declarative role-based profiling) |

---

## 2. Core Operating System Component Architecture

\`\`\`mermaid
flowchart TD
    subgraph Userland ["PeritiaOS Userland & CLI Surface"]
        DEC["Declarative Engine (.peritia.yaml)"]
        TOOL["Multi-Version Toolchain Engine"]
        TUI["eBPF Telemetry Dashboard TUI"]
    end

    subgraph Core ["Core Engine Layer"]
        PKG["Custom Package Manager & SAT Solver"]
        CONTAINER["Rootless Container Runtime (Podman / cgroups v2)"]
    end

    subgraph Storage ["Storage & System Core"]
        BTRFS["Btrfs Storage Layer (CoW & Instant Snapshots)"]
        KERNEL["Hardened Linux Kernel (Custom sysctl, eBPF Probes)"]
    end

    Userland --> Core
    PKG --> CONTAINER
    Core --> Storage
    BTRFS --> KERNEL

    classDef userland fill:#111726,stroke:#16db65,stroke-width:2px,color:#f8fafc;
    classDef core fill:#1b2234,stroke:#16db65,stroke-width:2px,color:#f8fafc;
    classDef storage fill:#090d16,stroke:#16db65,stroke-width:2px,color:#f8fafc;

    class DEC,TOOL,TUI userland;
    class PKG,CONTAINER core;
    class BTRFS,KERNEL storage;
\`\`\`

### 2.1 Storage & Filesystem Subsystem
* **Btrfs Copy-on-Write (CoW):** Selected to allow instantaneous subvolume snapshotting and zero-overhead container layer duplication.
* **Mount Optimizations:** Root and home partitions mounted with \`noatime,compress=zstd:1,space_cache=v2\`.
* **RAM Disk Allocation:** \`/tmp/build-cache\` mounted as \`tmpfs\` to offload compiler intermediate artifacts and test runner outputs directly to RAM.

### 2.2 Package Management Subsystem
* **Resolution Engine:** Employs a Boolean SAT / PubGrub solver to handle complex Semantic Versioning (\`SemVer\`) constraint resolution deterministically.
* **Transactional Atomicity:** All package installations, upgrades, and removals operate on transactional filesystem subvolumes. Failed installations trigger automatic rollback without leaving orphan files.
* **Parallel Fetching:** Multi-threaded parallel package downloading and local hash verification.

### 2.3 Userland & Session Supervision
* **Display & Session Manager:** Lightweight Wayland compositor integration with Wayland-native IPC protocols.
* **Process Supervisor:** Custom daemon runner to handle background services (\`systemd\` user units wrapped with minimal overhead CLI control).

---

## 3. Developer Pain Points & System-Level Solutions

| # | Industry Developer Pain Point | PeritiaOS System Solution | Underlying Technical Implementation |
|---|:--- |:--- |:--- |
| **1** | **Setup Hell:** 2+ hours lost installing compilers, shells, SSH keys, & tools. | **Declarative First-Boot Wizard:** 10-minute setup into fully populated environment. | Interactive CLI engine parses user role selection (Python, Rust, Full-Stack, DevOps) and declaratively applies system state. |
| **2** | **Compilation & I/O Lag:** Slow disk reads/writes on standard filesystems during builds. | **CoW Storage & RAM Caching:** Up to 2x faster Docker builds and test execution. | Btrfs CoW optimizations combined with automatic \`tmpfs\` RAM disk mounts for build target directories (\`target/\`, \`node_modules/.cache\`). |
| **3** | **Container Friction:** Docker permission issues, root requirement, volume latency. | **Zero-Overhead Container Architecture:** Pre-configured rootless container environment. | Out-of-the-box cgroups v2 resource quotas, Fuse-OverlayFS volume tuning, and unprivileged user namespace mapping. |
| **4** | **Complex Debugging:** Diagnostic tools (\`gdb\`, \`perf\`, \`strace\`) unconfigured or missing. | **Integrated Telemetry Wrappers:** Simple one-command tracing primitives. | Sysctl flag \`kernel.perf_event_paranoid=1\` pre-configured; \`peritia-trace\` and \`peritia-profile\` CLI wrappers provided. |
| **5** | **Environment Parity Failures:** "Works on my machine" bugs due to OS/library drift. | **Directory-Aware Runtime Isolation:** Exact runtime versions per project via \`.peritia.yaml\`. | Shell integration detects \`.peritia.yaml\` upon directory entry and dynamically modifies PATH to sandbox local toolchains. |
| **6** | **CI/CD Mismatch:** Local tests pass but break on remote CI build nodes. | **Local CI Container Mirroring:** \`peritia-ci\` runs pipeline steps locally in container specs. | Parses \`.github/workflows\` or \`.gitlab-ci.yml\` and executes jobs inside local container runtimes identical to remote runners. |
| **7** | **Opaque Resource Bottlenecks:** Unclear why disk, CPU, or memory bottlenecks slow builds. | **eBPF-Powered Developer Dashboard:** Live TUI monitoring per-process resource pressure. | eBPF probes capture CPU wait times, memory pressure stall information (PSI), and disk I/O latency per process tree. |
| **8** | **Version Conflict Hell:** Conflicting system runtimes (e.g., Python 3.8 vs 3.11). | **Isolated Toolchain Management:** Zero global toolchain pollution. | Parallel runtime binaries co-exist in isolated subdirectories; active versions linked seamlessly per-session. |
| **9** | **Over-Engineered Infrastructure:** Kubernetes overkill for local development. | **Lightweight DevOps Defaults:** Pre-configured K3s and Docker Compose stacks. | K3s service provided as an optional userland daemon with constrained CPU/RAM resource limits. |
| **10** | **Security & Secrets Overhead:** Insecure \`.env\` files, scattered SSH keys, plain text passwords. | **System Keyring & Secrets Integration:** Local HashiCorp Vault / Keyring integration. | Native \`libsecret\` integration encrypts \`.env\` files automatically and manages SSH keys securely with hardware token support. |

---

## 4. Advanced Technical Features & Architecture

### 4.1 Development Time Machine
Provides system and environment rewind capabilities tied directly to Git history:
\`\`\`bash
$ git checkout old-commit-hash
$ peritia-checkout-env old-commit-hash
# OS restores package versions and environment states from that commit timestamp
\`\`\`
* **Architecture:** Uses Git commit hooks to trigger Btrfs subvolume snapshots metadata tags. Rewinding reverts system packages to the commit epoch.

### 4.2 Distributed Team Workspace Sync
Guarantees zero setup drift across engineering teams:
\`\`\`bash
$ peritia-sync team-workspace
\`\`\`
* **Architecture:** Transmits containerized environment manifests and lockfiles across peer nodes, spinning up identical development spaces locally.

### 4.3 Automated Performance Regression Detection
Proactively detects build and package performance bottlenecks:
\`\`\`bash
$ peritia-perf-regression
[ALERT] 167% compilation slowdown detected in module 'auth-service'.
Root cause: Added dependency 'heavy-crypto' increased dependency graph depth by 4.
\`\`\`
* **Architecture:** Telemetry daemon logs historical execution times of build/test commands. Statistical anomaly detection algorithms highlight significant deviations.

### 4.4 One-Touch System Profiling
Produces actionable profiling outputs without raw tool invocation:
\`\`\`bash
$ peritia-profile python main.py
# Spawns interactive flame graph and CPU hotspot report
\`\`\`
* **Architecture:** Wraps \`perf\` and \`eBPF\` sampling profilers, converting raw binary output into interactive SVG flame graphs rendered in-browser or terminal.

### 4.5 Database Time Travel
Prevents data seeding friction during git branch switches:
\`\`\`bash
$ peritia-db-snapshot main-branch
$ git checkout bug-fix-branch
$ peritia-db-restore bug-fix-branch
\`\`\`
* **Architecture:** Database data directories are mounted on dedicated CoW volume blocks, enabling instantaneous snapshotting and point-in-time state recovery.

---

## 5. System Declarative Configuration (\`.peritia.yaml\`)

Every repository hosted on PeritiaOS can define its exact requirements declaratively:

\`\`\`yaml
version: "1.0"
project: "fintech-core-service"

toolchain:
  python: "3.11.4"
  node: "18.16.0"
  rust: "1.72.0"

services:
  postgres:
    version: "15"
    snapshot: "dev-seed-v2"
  redis:
    version: "7.0"

containers:
  engine: podman
  rootless: true

environment:
  PATH_PREPEND: "./bin"
  ENCRYPT_ENV: true
\`\`\`

---

## 6. 5-Phase Product Development Roadmap

\`\`\`mermaid
flowchart LR
    subgraph P1 ["Phase 1: Core Foundation (M1-M3)"]
        direction TB
        A1["Package Manager Core"]
        A2["Btrfs Storage Layer Tuning"]
        A3["Setup Wizard TUI"]
        A4["Rootless Podman Integration"]
    end

    subgraph P2 ["Phase 2: Toolchain & Parity (M4-M6)"]
        direction TB
        B1["Multi-Version Toolchain (.peritia.yaml)"]
        B2["RAM Disk Build Caching"]
        B3["Local CI/CD Runner (peritia-ci)"]
    end

    subgraph P3 ["Phase 3: Telemetry (M6-M8)"]
        direction TB
        C1["eBPF Resource Dashboard"]
        C2["Profiling CLI Wrappers"]
        C3["Performance Regression Detector"]
    end

    subgraph P4 ["Phase 4: Advanced Features (M8-M10)"]
        direction TB
        D1["Dev Time Machine"]
        D2["Database Snapshot Engine"]
        D3["Secrets Vault Integration"]
    end

    subgraph P5 ["Phase 5: Release v1.0 (M10-M12)"]
        direction TB
        E1["Team Collaboration Tunneling"]
        E2["Security Audit Profiles"]
        E3["Production Release v1.0"]
    end

    P1 --> P2 --> P3 --> P4 --> P5

    classDef p1 fill:#111726,stroke:#16db65,stroke-width:2px,color:#fff;
    classDef p2 fill:#1b2234,stroke:#16db65,stroke-width:2px,color:#fff;
    classDef p3 fill:#111726,stroke:#16db65,stroke-width:2px,color:#fff;
    classDef p4 fill:#1b2234,stroke:#16db65,stroke-width:2px,color:#fff;
    classDef p5 fill:#090d16,stroke:#16db65,stroke-width:2px,color:#fff;

    class A1,A2,A3,A4 p1;
    class B1,B2,B3 p2;
    class C1,C2,C3 p3;
    class D1,D2,D3 p4;
    class E1,E2,E3 p5;
\`\`\`

---

## 7. Competitive Matrix: Ubuntu vs. PeritiaOS

| Architectural Dimension | Ubuntu Desktop (Generic) | PeritiaOS (Developer-First) |
| :--- | :--- | :--- |
| **Primary Focus** | General Purpose / Consumer | Software Engineers & SREs |
| **Initial Setup Time** | 1 to 2 Hours (Manual) | **< 10 Minutes** (Automated Wizard) |
| **Default Filesystem** | EXT4 (Standard I/O) | **Btrfs CoW + \`tmpfs\` RAM Cache** |
| **Container Engine** | Requires manual installation & sudo config | **Pre-configured Rootless cgroups v2** |
| **Profiling & Tracing** | Requires manual install of \`gdb\`/\`perf\` | **Native One-Line CLI Wrappers** |
| **Toolchain Management** | Global system packages / external version managers | **Directory-Aware \`.peritia.yaml\` Isolation** |
| **Observability** | Standard System Monitor (\`gnome-system-monitor\`) | **eBPF Process Pressure TUI Dashboard** |

---

## 8. Strategic Product Value Proposition

> *"PeritiaOS is a Linux distribution custom-built for software engineers who are tired of setup friction, slow builds, and environment drift. By optimizing filesystem storage for container I/O, building low-overhead eBPF observability directly into the userland, and automating dev-to-prod parity, PeritiaOS turns your operating system into an active productivity multiplier."*
`
  },
  {
    id: "bootcamp-curriculum",
    title: "12-Month Bootcamp & Reflections",
    category: "Learning",
    badge: "Curriculum",
    icon: "GraduationCap",
    summary: "Month-by-month engineering bootcamp roadmap, teachable moments, ADR templates, and post-mortems.",
    content: `# PeritiaOS Engineering Bootcamp: Curriculum & Learning Reflections

> [!NOTE]
> **Pedagogical Philosophy:** Building PeritiaOS serves as an intensive 12-month software engineering bootcamp. True engineering mastery is acquired not by reading abstract textbooks, but by encountering real systems failures, diagnosing root causes, applying architectural patterns in context, and documenting key learnings.

---

## 1. The Problem-Driven Learning Paradigm

\`\`\`mermaid
flowchart TD
    subgraph Trad ["Traditional Curriculum-Driven Approach"]
        direction TB
        T1["1. Read theory about SAT solvers"] --> T2["2. Forget theory due to lack of practical application"] --> T3["3. Face real production problems years later unprepared"]
    end

    subgraph Peritia ["PeritiaOS Problem-Driven Bootcamp"]
        direction TB
        P1["1. Build naive package solver"] --> P2["2. Encounter dependency cycle & infinite loop failure"] --> P3["3. Research SAT algorithms to solve real failure"] --> P4["4. Implement PubGrub solver & achieve systems mastery"]
    end

    classDef trad fill:#111726,stroke:#64748b,stroke-width:1.5px,color:#94a3b8;
    classDef peritia fill:#1b2234,stroke:#16db65,stroke-width:2px,color:#f8fafc;

    class T1,T2,T3 trad;
    class P1,P2,P3,P4 peritia;
\`\`\`

---

## 2. 12-Month Systems Engineering Bootcamp Roadmap

### Month 1–2: Linux Fundamentals & Project Setup

* **What You Build:** Core FHS directory hierarchy, Git branching workflow, initial repository structure, build manifest specs.
* **What You Learn:** Linux boot architecture (\`systemd\`, \`init\`, PID 1), POSIX standards, trade-offs between source vs binary package management, git branching for OS releases.
* **Teachable Moment:** Rather than following basic Linux tutorials, investigate why \`systemd\` replaced SysVinit, how PID 1 handles process reaping, and how socket activation works.
* **Engineering Insight:** Understanding process initialization and operating system lifecycle management.

---

### Month 2–3: Package Manager Architecture & Algorithmic Design

* **What You Build:** Package manager core (Rust/Go), dependency graph solver, package spec parser, CLI runner, integration test suite.
* **What You Learn:** Directed Acyclic Graphs (DAGs), NP-completeness of SAT solvers/dependency resolution (PubGrub algorithm), SemVer parsing, transactional atomicity.
* **Teachable Moment:** A naive recursive solver hits an infinite loop when encountering circular dependencies. Optimizing the solver teaches why algorithmic complexity matters at scale.
* **Engineering Insight:** Graph theory application (Tarjan's algorithm, Topological Sort) and atomic filesystem state rollbacks.

---

### Month 3–4: Desktop Environment & User Session Integration

* **What You Build:** Window manager configuration (Wayland compositor or X11 WM), display manager integration, user session startup scripts, process supervisor.
* **What You Learn:** Event-driven architecture, non-blocking I/O loops (\`epoll\`/\`kqueue\`), Inter-Process Communication (IPC via Unix Domain Sockets & D-Bus), X11 vs. Wayland security boundaries.
* **Teachable Moment:** Debugging a background service that fails on startup due to missing D-Bus socket connections teaches system-level log tracing (\`journalctl\`, \`dmesg\`).
* **Engineering Insight:** Asynchronous event loops, signal handling (\`SIGTERM\`, \`SIGKILL\`), and process state machines.

---

### Month 4–5: Installer & Build Automation

* **What You Build:** Interactive TUI/GUI installer, automated ISO image generation scripts, reproducible build environment.
* **What You Learn:** Declarative OS installation, disk partitioning (\`parted\`/\`sfdisk\`), filesystem selection (Btrfs, EXT4), build script idempotency, pipeline profiling.
* **Teachable Moment:** ISO compilation taking 25 minutes hinders iteration. Profiling script bottlenecks leads to caching intermediate outputs, cutting build times down to 5 minutes.
* **Engineering Insight:** Build profiling, artifact caching, and reproducible artifact engineering.

---

### Month 5–6: Testing & Quality Assurance Infrastructure

* **What You Build:** Unit test suite for dependency resolution, QEMU/KVM automated virtual machine integration tests, regression test runner.
* **What You Learn:** Test pyramid mechanics (unit vs. integration vs. end-to-end), code coverage metrics, virtualization tooling (\`qemu-img\`, \`virsh\`), hermetic test environments.
* **Teachable Moment:** A package manager bug slips past unit tests and corrupts root partitions. Writing a QEMU-based integration test catches file-collision bugs before release.
* **Engineering Insight:** Automated VM integration testing, edge-case validation, and non-regression guarantees.

---

### Month 6–7: CI/CD Pipeline & Release Automation

* **What You Build:** GitHub Actions / GitLab CI workflows, automated ISO generation on git push, nightly artifact builds, release packaging.
* **What You Learn:** Pipeline design, failure handling, build artifact storage strategies, build vs test environment separation, CI caching mechanisms.
* **Teachable Moment:** Pipeline fails due to non-deterministic external network downloads during build. Fixing it requires mirroring dependencies and building hermetic lockfiles.
* **Engineering Insight:** Continuous integration resilience, build determinism, and release engineering.

---

### Month 7–8: Security Hardening & Permission Models

* **What You Build:** User permission model, Mandatory Access Control (AppArmor/SELinux) profiles, hardened SSH configuration, security audit logging (\`auditd\`).
* **What You Learn:** Principle of Least Privilege, Threat Modeling, DAC vs. MAC permissions, privilege escalation vectors, security auditing metrics.
* **Teachable Moment:** Discovering a permission misconfiguration in \`/etc\` that permits unprivileged write access teaches defense-in-depth security principles.
* **Engineering Insight:** Defensive engineering, access control validation, and security auditing.

---

### Month 8–9: Monitoring & System Observability Stack

* **What You Build:** Real-time metrics dashboard (htop/journalctl integration), eBPF profiling wrappers (\`peritia-trace\`), kernel tracing tools.
* **What You Learn:** Observability vs. Monitoring, Golden Signals (Latency, Traffic, Errors, Saturation), eBPF probes (\`kprobes\`/\`uprobes\`), flame graph analysis.
* **Teachable Moment:** A user reports system sluggishness. Using eBPF probes reveals high I/O wait times in a background indexer, transforming blind debugging into structured diagnosis.
* **Engineering Insight:** Telemetry-driven optimization, low-overhead kernel tracing, and root-cause identification.

---

### Month 9–10: Refactoring & Code Quality Audit

* **What You Build:** System-wide code audit, modularization of monolithic scripts into structured packages, static analysis rules enforcement.
* **What You Learn:** Recognizing code smells, design patterns (Strategy, Factory, Adapter), technical debt management, cyclomatic complexity metrics.
* **Teachable Moment:** Attempting to refactor the core package solver breaks several features. Learning why refactoring requires robust unit and integration test coverage.
* **Engineering Insight:** Software design principles, refactoring patterns, and maintainability.

---

### Month 10–11: Documentation & Knowledge Architecture

* **What You Build:** Architecture Decision Records (ADRs), Developer Documentation, End-User Handbook, API reference docs, automated changelog generator.
* **What You Learn:** Writing clarity, audience segregation (User vs Developer docs), decision documentation rationale, onboarding knowledge transfer.
* **Teachable Moment:** Writing documentation for a peer developer who still gets confused during setup forces a complete rewrite for true clarity.
* **Engineering Insight:** Communication as an engineering discipline, self-documenting architectures.

---

### Month 11–12: Production Release & Post-Launch Iteration

* **What You Build:** Semantic versioning automation, GPG artifact signing, release channels (alpha/beta/stable), issue triage process.
* **What You Learn:** Semantic Versioning (SemVer), rollback safety procedures, handling community bug reports, feedback-driven iteration.
* **Teachable Moment:** Shipping v1.0 and receiving real bug reports for hardware edge cases teaches humility and highlights differences between VM testing and bare-metal reality.
* **Engineering Insight:** Release engineering discipline, production support, and iterative software lifecycle.

---

## 3. Learning Maximization Framework

### 3.1 Capturing Architecture Decision Records (ADRs)
Every major decision must be recorded using a standardized markdown format:

\`\`\`markdown
## ADR-007: Adoption of Btrfs over EXT4 for System Subvolumes

* **Context:** We need a filesystem that supports fast container layer creation and instant system snapshots.
* **Options:**
  - Option A (EXT4): Highly stable, traditional, but lacks native CoW and instant snapshotting.
  - Option B (Btrfs): Native Copy-on-Write (CoW), instant subvolume snapshots, \`zstd\` compression.
  - Option C (ZFS): Powerful, but licensing incompatibilities with Linux kernel tree.
* **Decision:** We chose Option B (Btrfs).
* **Trade-offs:**
  - *Gained:* 2x faster container builds, instant dev environment snapshots.
  - *Sacrificed:* Higher CPU utilization under heavy random write workloads (mitigated via zstd compression).
* **Lessons Learned:** File system selection directly impacts container I/O performance.
\`\`\`

### 3.2 Blameless Incident Post-Mortems
When system failures occur, document them to train root-cause diagnostic skills:

\`\`\`markdown
## Incident: ISO Build Crash via Out-of-Memory (OOM)

* **What Happened:** The ISO build script crashed at minute 18 with exit code 137.
* **Root Cause:** Parallel package compression spawned N threads equal to CPU cores, exceeding total available host RAM.
* **Why We Missed It:** Build script was tested on a high-spec machine with 64GB RAM; CI runner only had 8GB RAM.
* **How We Fixed It:** Added memory-aware concurrency caps (\`min(CPU_CORES, RAM_GB / 2)\`).
* **Prevention:** Added low-RAM resource limit tests in integration pipelines.
* **Lessons Learned:** Always constrain resource allocation dynamically based on runtime host capacity.
\`\`\`

### 3.3 The 5-Whys Diagnostic Method
\`\`\`
Level 1: Why did dependency resolution fail?
 └── Answer: The solver entered an infinite recursion loop.

Level 2: Why did it enter an infinite recursion loop?
 └── Answer: Package A depends on Package B, which depends on Package A (circular dependency).

Level 3: Why didn't the solver detect the cycle?
 └── Answer: The graph traversal algorithm lacked a visited-node set.

Level 4: Why was the visited-node set omitted?
 └── Answer: The initial design assumed all dependency trees were strictly acyclic.

Level 5: Why did we assume dependency trees were acyclic?
 └── Answer: We didn't research real-world package repository edge cases before writing code.
\`\`\`

---

## 4. Senior Engineering Portfolio Matrix

Upon completing PeritiaOS, your project portfolio translates directly into verifiable senior engineering skills:

| Acquired Engineering Skill | Portfolio Artifact / Concrete Evidence | Senior Interview Demonstration Narrative |
| :--- | :--- | :--- |
| **Requirements Thinking** | Feature specs & project roadmap | *"I defined functional requirements by analyzing pain points in developer workflows."* |
| **Architecture Design** | Library of 15+ Architecture Decision Records (ADRs) | *"Here are the exact trade-offs I evaluated when selecting our package manager solver."* |
| **Algorithmic Mastery** | SAT-based PubGrub Dependency Solver in Rust | *"Implemented graph traversal algorithms to solve NP-complete dependency constraints."* |
| **Testing Discipline** | >80% code coverage + QEMU integration tests | *"Built hermetic VM-based integration tests to verify system boot stability before release."* |
| **Performance Optimization** | ISO build speed cut from 25m to 5m | *"Profiled I/O bottlenecks and leveraged Btrfs CoW + RAM disks to accelerate builds by 80%."* |
| **Observability Design** | eBPF process telemetry & profiling tools | *"Integrated eBPF probes to give developers visibility into kernel-level I/O bottlenecks."* |
| **Security Mindset** | Hardened AppArmor/SELinux & PAM profiles | *"Enforced Principle of Least Privilege across system daemons and userland tools."* |
| **Release Engineering** | Automated SemVer release pipeline & GPG signing | *"Built end-to-end CI/CD pipelines producing signed ISO artifacts on every tag."* |

---

## 5. The Practical Growth Path

\`\`\`
  1. Build Feature (Execute monthly roadmap plan)
  2. Hit Problem (System breakage, performance bottleneck, or edge case bug)
  3. Solve Problem (Apply CS principles, algorithms, or kernel configurations)
  4. Document Solution (Write ADRs, Post-Mortems, and documentation)
  5. Repeat 12 Times (Knowledge compounds into senior systems engineering maturity)
\`\`\`
`
  },
  {
    id: "prerequisites-guide",
    title: "Prerequisites & Fundamentals Guide",
    category: "Preparation",
    badge: "Guide",
    icon: "BookOpen",
    summary: "Systems programming languages, Linux OS concepts, CS graph algorithms, container primitives, and 4-week prep schedule.",
    content: `# PeritiaOS Engineering Bootcamp: Prerequisites & Fundamentals Guide

> [!TIP]
> **Prerequisite Mindset:** You do **not** need to be an expert in all of these areas before starting. Building PeritiaOS is designed to teach you these concepts as you go. However, having foundational comfort in the **Core Minimums** will prevent early overwhelm and keep your iteration speed high.

---

## 1. Prerequisites Knowledge Map

\`\`\`
                          ┌────────────────────────────────────────┐
                          │         PeritiaOS Prerequisites        │
                          └───────────────────┬────────────────────┘
                                              │
     ┌──────────────────────┬─────────────────┴──────┬──────────────────────┐
     ▼                      ▼                        ▼                      ▼
┌───────────┐        ┌─────────────┐          ┌─────────────┐        ┌─────────────┐
│ Systems   │        │ Linux OS    │          │ CS          │        │ Dev Tools   │
│ Languages │        │ Fundamentals│          │ Algorithms  │        │ & Storage   │
└───────────┘        └─────────────┘          └─────────────┘        └─────────────┘
  • Rust / Go          • Kernel & Syscalls      • DAGs & Graphs        • Git Hooks
  • Bash / POSIX       • Init & systemd         • SAT Resolution       • Btrfs / CoW
  • C (Reading)        • Namespaces & cgroups   • Event Loops          • QEMU / KVM
\`\`\`

---

## 2. Detailed Technical Fundamentals Breakdown

### Tier 1: Systems Programming & Scripting Languages

#### 1. Rust or Go (Primary Language for Package Manager & Tools)
* **What to know:**
  * **Rust:** Ownership, borrowing, lifetimes, \`Result\`/\`Option\` error handling, pattern matching, structs, traits, and module system.
  * **Go (Alternative):** Structs, interfaces, goroutines, channels, error handling patterns, CLI packages (\`cobra\`).
* **Why it's needed:** The package manager, configuration engine, and CLI diagnostic wrappers (\`peritia-trace\`) require high performance, safety, and compiled binary distribution.

#### 2. Advanced Bash & POSIX Shell Scripting
* **What to know:** POSIX standard compliance, subshells, environment variables, traps/signals (\`SIGINT\`, \`SIGTERM\`), exit codes, \`stdin\`/\`stdout\`/\`stderr\` redirection, pipes, string manipulation, arrays, \`jq\` for JSON parsing.
* **Why it's needed:** ISO build automation, userland initialization scripts, and system installer glue rely heavily on shell automation.

#### 3. C & Systems Programming (Reading Level)
* **What to know:** Pointers, memory layout (Stack vs Heap), header files (\`.h\`), basic POSIX system call APIs (\`fork\`, \`exec\`, \`open\`, \`read\`, \`write\`, \`socket\`).
* **Why it's needed:** Reading Linux kernel documentation, writing or understanding eBPF probes, and interfacing with system C libraries (like \`libsecret\` or \`PAM\`).

---

### Tier 2: Linux OS Architecture & Systems Primitives

#### 1. Linux Directory Hierarchy (FHS) & File Management
* **What to know:** Filesystem Hierarchy Standard (\`/etc\`, \`/var\`, \`/usr\`, \`/tmp\`, \`/dev\`, \`/proc\`, \`/sys\`, \`/run\`).
* **Why it's needed:** You must know where system configurations, runtime sockets, virtual kernel files, and user binaries reside when packaging software.

#### 2. Process Management & Boot Lifecycle
* **What to know:** Process IDs (PIDs), PID 1 (Init), process creation (\`fork\`/\`exec\`), zombie processes, \`systemd\` target units, system services vs user services, \`journalctl\` log inspection.
* **Why it's needed:** Months 1–4 require configuring the boot flow, display manager, and background daemon supervisor.

#### 3. Permissions, Capabilities, & Security
* **What to know:** POSIX permissions (\`chmod\`, \`chown\`), SUID/SGID bits, Linux capabilities (\`CAP_SYS_ADMIN\`, \`CAP_NET_BIND_SERVICE\`), basic \`sudo\` rules (\`/etc/sudoers\`).
* **Why it's needed:** Month 7 security hardening and rootless container permission mappings require strict privilege controls.

---

### Tier 3: Storage, Filesystems, & Virtualization

#### 1. Filesystem Concepts (EXT4 vs Btrfs)
* **What to know:** Inodes, blocks, Copy-on-Write (CoW), subvolumes, snapshots, compression flags (\`zstd\`), RAM disks (\`tmpfs\`).
* **Why it's needed:** PeritiaOS relies on Btrfs subvolume snapshots for the **Dev Time Machine** and \`tmpfs\` mounts for high-speed compilation caches.

#### 2. Virtualization & ISO Tools (QEMU / KVM)
* **What to know:** Running virtual machines from terminal (\`qemu-system-x86_64\`), raw image creation (\`qemu-img\`), loopback mounts (\`losetup\`), ISO generation tools (\`mkarchiso\` or \`live-build\`).
* **Why it's needed:** You will test your custom OS inside QEMU VMs during ISO generation and integration testing (Months 4–6).

---

### Tier 4: Computer Science Algorithms & Data Structures

#### 1. Graph Theory & Dependency Resolution
* **What to know:** Directed Acyclic Graphs (DAGs), Topological Sorting (Kahn's Algorithm), Tarjan's Strongly Connected Components algorithm for cycle detection.
* **Why it's needed:** Designing the package manager's dependency solver in Month 2 requires resolving dependency trees and stopping circular reference deadlocks.

#### 2. Semantic Versioning (SemVer) Matching Logic
* **What to know:** Parsing version specs (\`^1.2.0\`, \`>=2.0.0, <3.0.0\`), constraint resolution logic.
* **Why it's needed:** Package resolution requires verifying compatibility across hundreds of library versions.

#### 3. Event Loops & Asynchronous I/O Concepts
* **What to know:** Synchronous vs. Asynchronous execution, non-blocking I/O, \`epoll\`/\`kqueue\` system calls, Unix Domain Sockets (\`.sock\`).
* **Why it's needed:** Inter-process communication (D-Bus, Wayland event loops) relies on asynchronous event handling.

---

### Tier 5: Container Primitives (Linux Kernel Features)

#### 1. Linux Namespaces (Process Isolation)
* **What to know:** The 6 core namespaces: Mount (\`mnt\`), Process (\`pid\`), Network (\`net\`), User (\`user\`), IPC (\`ipc\`), UTS (\`uts\`).
* **Why it's needed:** Understanding how Docker/Podman isolate processes on Linux without hypervisors.

#### 2. Control Groups v2 (cgroups v2)
* **What to know:** Resource limiting for CPU, Memory, Disk I/O, and Pressure Stall Information (PSI).
* **Why it's needed:** PeritiaOS optimizes container performance and resource monitoring using cgroups v2.

---

## 3. Self-Assessment Readiness Checklist

Evaluate your current baseline before day 1:

| Fundamental Area | Minimal Viable Baseline (Ready to Start) | Ideal Target (Smooth Sailing) |
| :--- | :--- | :--- |
| **Linux CLI Comfort** | Navigating files, editing with Vim/Nano, grep/sed basics | Piping, writing shell functions, regex, process signals |
| **Systems Language** | Basic syntax in Rust, Go, or C++ | Intermediate Rust/Go (traits, channels, async) |
| **Git Proficiency** | \`git add\`, \`commit\`, \`push\`, \`pull\` | Rebase, submodules, git hooks, interactive rebase |
| **Operating System Theory** | Understands CPU, RAM, Disk, Process concepts | Understands syscalls, PID 1, file descriptors, virtual memory |
| **Algorithms** | Arrays, HashMaps, Trees, Basic Recursion | Graphs (DAGs), Topological Sort, BFS/DFS |

---

## 4. Recommended 4-Week Pre-Bootcamp Prep Schedule

If you want to prepare before launching Month 1 of PeritiaOS, follow this 4-week warm-up plan:

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        4-Week Ramp-Up Timeline                         │
├───────────────────┬────────────────────┬───────────────────────────────┤
│ Week 1: Linux CLI │ Week 2: Systems    │ Week 3: Graph Algorithms      │
│ & Shell Mastery   │ Language (Rust/Go) │ & Package Spec                │
├───────────────────┴────────────────────┴───────────────────────────────┤
│ Week 4: Container Primitives & QEMU Basics                             │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

* **Week 1 (Linux & Shell):**
  * Read: *The Linux Command Line* (William Shotts) or Arch Wiki basics.
  * Practice: Write a shell script that parses system specs (\`/proc/cpuinfo\`, \`/proc/meminfo\`) and outputs formatted JSON.
* **Week 2 (Systems Language):**
  * Learn: Rust (*The Rust Programming Language Book*, Ch. 1–10) OR Go (*Effective Go*).
  * Practice: Write a small CLI tool that reads a directory recursively and calculates total disk usage per extension.
* **Week 3 (Graph Algorithms):**
  * Learn: Directed Acyclic Graphs (DAGs) and Topological Sort.
  * Practice: Write a graph data structure in Rust/Go that sorts a list of tasks with dependencies and throws an error if a cycle exists.
* **Week 4 (Container Primitives & Virtualization):**
  * Learn: Basics of Linux Namespaces and cgroups v2.
  * Practice: Install QEMU, create a VM from command line using \`qemu-system-x86_64\`, and inspect running processes with \`ps aux\` and \`journalctl\`.

---

> [!NOTE]
> **Summary:** The single most important prerequisite is **curiosity and comfort with command-line debugging**. Everything else—from Btrfs subvolumes to SAT solvers—will be learned contextually while building the OS.
`
  }
];

export const monthMilestones = [
  { id: 1, title: "Month 1–2: Linux Fundamentals & Setup", desc: "Build FHS directory tree, Git workflow, systemd boot flow research." },
  { id: 2, title: "Month 2–3: Package Manager Architecture", desc: "Build Rust/Go SAT dependency graph solver and transactional atomicity engine." },
  { id: 3, title: "Month 3–4: Desktop & User Session Integration", desc: "Configure Wayland compositor, IPC sockets, and daemon runner supervisor." },
  { id: 4, title: "Month 4–5: Installer & Build Automation", desc: "Create interactive installer and optimize live ISO build caching to 5 mins." },
  { id: 5, title: "Month 5–6: Testing & QA Infrastructure", desc: "Automate QEMU integration tests and dependency resolution unit test suite." },
  { id: 6, title: "Month 6–7: CI/CD Pipeline & Release Engineering", desc: "Build GitHub Actions ISO generator, lockfile mirroring, and GPG signing." },
  { id: 7, title: "Month 7–8: Security Hardening & MAC Profiles", desc: "AppArmor/SELinux profiles, hardened SSH config, and security audit logging." },
  { id: 8, title: "Month 8–9: Monitoring & System Observability", desc: "Develop eBPF telemetry probes and custom CLI wrappers (peritia-trace)." },
  { id: 9, title: "Month 9–10: Refactoring & Code Quality Audit", desc: "System-wide code audit, static analysis rules enforcement, and pattern refactoring." },
  { id: 10, title: "Month 10–11: Documentation Architecture", desc: "Write ADRs, Developer Guides, User Handbook, and automated changelogs." },
  { id: 11, title: "Month 11–12: Production Release v1.0", desc: "Release channels, community issue triage, hotfix procedure, and retrospective." }
];

export const prerequisiteItems = [
  { id: "lang", label: "Systems Language Basics (Rust or Go syntax, structs, channels, error handling)" },
  { id: "shell", label: "POSIX Shell & Scripting (Pipes, signals, subshells, environment variables, jq)" },
  { id: "linux-fhs", label: "Linux Directory Structure (/etc, /proc, /sys, /var, /usr, /run)" },
  { id: "boot-init", label: "Process Lifecycle & Init Systems (PID 1, fork/exec, systemd targets, journalctl)" },
  { id: "btrfs-cow", label: "Storage Mechanics (Copy-on-Write, Btrfs subvolumes, RAM disk tmpfs mounts)" },
  { id: "graphs", label: "Graph Algorithms (Directed Acyclic Graphs, Topological Sort, Tarjan's SCC)" },
  { id: "containers", label: "Linux Kernel Container Primitives (Namespaces, cgroups v2, PSI metrics)" },
  { id: "vm-qemu", label: "Virtualization & CLI Tools (QEMU/KVM VM testing, loopback devices, ISO tools)" }
];
