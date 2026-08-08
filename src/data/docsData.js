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
  }
];
