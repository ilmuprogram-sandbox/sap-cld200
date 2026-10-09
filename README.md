# SAP CLD200 — Incident Management (solusi per exercise)

Solusi exercise kursus **SAP CLD200 — Building Side-by-Side Extensions on SAP BTP** (Collection 23):
aplikasi **Incident Management** berbasis SAP Cloud Application Programming Model (CAP, Node.js) yang dibangun
bertahap dari Exercise 1 sampai 10, mengikuti tutorial *SAP BTP Developer's Guide*.

**Setiap exercise punya satu branch.** Isi branch = kondisi proyek **di akhir exercise itu**, dan setiap branch dibangun
di atas branch sebelumnya. README di tiap branch menjelaskan exercise-nya dan **apa yang berubah dari exercise sebelumnya**.

Branch `main` berisi kode akhir (sama dengan `ex10-work-zone`) dan ringkasan ini.

## Daftar branch

| Branch | Exercise | Unit | Inti perubahan |
|---|---|---|---|
| [`ex01-create-cap-service`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex01-create-cap-service) | 1 · Create a CAP-Based Service | 2 | Proyek CAP, `db/schema.cds`, `srv/services.cds`, data CSV |
| [`ex02-fiori-elements-ui`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex02-fiori-elements-ui) | 2 · Generate a UI Using SAP Fiori Elements | 3 | App `app/incidents` (List Report + Object Page), anotasi UI, draft |
| [`ex03-custom-logic`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex03-custom-logic) | 3 · Add Custom Business Logic | 4 | `srv/services.js`: auto-urgency + tolak ubah incident Closed |
| [`ex04-local-launch-page`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex04-local-launch-page) | 4 · Add a Local Launch Page | 4 | `app/launchpage.html` (sandbox Fiori launchpad) |
| [`ex05-authorization`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex05-authorization) | 5 · Define Restrictions and Roles in CDS | 5 | `@requires` support/admin, mock user alice & bob |
| [`ex06-test-cases`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex06-test-cases) | 6 · Add Test Cases | 6 | `tests/test.js` (20 test, Jest + `cds.test`) |
| [`ex07-external-service`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex07-external-service) | 7 · Add an External Service | 6 | Business Partner API S/4HANA: import, `RemoteService`, mock data, delegasi & cache customer |
| [`ex08-production-prep`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex08-production-prep) | 8 · Preparing the Production Environment | 7 | HANA, XSUAA (`xs-security.json`), konfigurasi Work Zone |
| [`ex09-deploy-cloud-foundry`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex09-deploy-cloud-foundry) | 9 · Deploy in SAP BTP, Cloud Foundry Runtime | 7 | `mta.yaml`, perbaikan agar bisa di-build & start di production |
| [`ex10-work-zone`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex10-work-zone) | 10 · Integrate with SAP Build Work Zone | 8 | Tanpa perubahan kode — langkah konfigurasi di BTP cockpit |

## Cara memakai

```bash
git clone https://github.com/ilmuprogram-sandbox/sap-cld200.git
cd sap-cld200
git checkout ex05-authorization          # pilih exercise
npm install
cds watch                                # http://localhost:4004
```

Membandingkan dua exercise:

```bash
git diff ex04-local-launch-page ex05-authorization                    # semua perubahan
git diff ex06-test-cases ex07-external-service --stat -- . ':!*package-lock.json'
```

Di SAP Business Application Studio: dev space **Full Stack Cloud Application**, clone di `/home/user/projects`.

| Mulai dari branch | Login lokal |
|---|---|
| `ex01`–`ex04` | tidak ada |
| `ex05` dan seterusnya | `alice` (role support) atau `bob` (support + admin), password kosong |

Perintah yang berguna: `npm run watch-incidents` (app Fiori, mulai `ex02`), `/launchpage.html` (mulai `ex04`),
`npm run test` (mulai `ex06`), `cds watch --with-mocks` (mulai `ex07`), `mbt build` (mulai `ex09`).

## Cara cepat — Exercise 1–9

Sekali di awal:

```bash
git clone https://github.com/ilmuprogram-sandbox/sap-cld200.git && cd sap-cld200
```

Lalu per exercise (port default `4004`):

| Ex | Perintah | Buka / cek | Yang harus terlihat |
|---|---|---|---|
| 1 | `git checkout ex01-create-cap-service && npm install && cds watch` | `/odata/v4/processor/Incidents` | 4 incident |
| 2 | `git checkout ex02-fiori-elements-ui && npm install && cds watch` | `/incidents/webapp/index.html` → **Go** | List Report; Create / Edit / Save / Delete jalan |
| 3 | `git checkout ex03-custom-logic && cds watch` | Create incident berjudul *Urgent …*, urgency **Low** → Save | Urgency berubah jadi **High**; edit incident **Closed** ditolak |
| 4 | `git checkout ex04-local-launch-page && cds watch` | `/launchpage.html#Shell-home` | Tile **Incident-Management** |
| 5 | `git checkout ex05-authorization && cds watch` | `/odata/v4/processor/Incidents` → login `alice`, password kosong | `alice` ke `/odata/v4/admin/Customers` → **403**; `bob` → 200 |
| 6 | `git checkout ex06-test-cases && npm install && npm test` | — | `Tests: 20 passed, 20 total` |
| 7 | `git checkout ex07-external-service && npm install && cds watch --with-mocks` | Create incident → value help **Customer** | 3 customer dari mock S/4 (mis. `test@demo.com`) |
| 8 | `git checkout ex08-production-prep && npm install && (cd app/incidents && npm install) && cds build --production` | — | `build completed`; lokal tetap sama seperti ex07 |
| 9 | lihat blok di bawah | `cf apps`, `cf services` | `incident-management-srv` **started 1/1**; db-deployer `stopped` (normal) |

Exercise 9 — deploy ke SAP BTP, Cloud Foundry (landscape kelas):

```bash
git checkout ex09-deploy-cloud-foundry
npm install && (cd app/incidents && npm install)
mbt build                                                   # → mta_archives/incident-management_1.0.0.mtar
cf login --origin cld200-platform -a https://api.cf.eu10-005.hana.ondemand.com
cf target -o cld200-dNN -s DEV                              # NN = nomor user
cf deploy mta_archives/incident-management_1.0.0.mtar       # ±5 menit
cf apps && cf services
```

Lalu BTP cockpit → **Security → Users** → user sendiri (IdP **cld200**) → **Assign Role Collection** →
`support (incident-management cld200-dNN-DEV)` → **logout & login ulang**. Aplikasi dibuka lewat Work Zone (Exercise 10).

| Kalau … | Coba |
|---|---|
| Port 4004 sudah dipakai | `cds watch --port 4005` |
| Ganti user di browser (ex05+) | Jendela incognito — tidak ada logout |
| ex07: value help kosong / tersambung ke proyek lain | Hapus `~/.cds-services.json`, jalankan ulang `cds watch --with-mocks` |
| ex06: `npm ci` gagal (lock file tidak sinkron) | Pakai `npm install` |
| `cf login` berhasil tetapi `cf orgs` kosong | Endpoint salah — harus `eu10-005` |
| `cf deploy` gagal di `incident-management-db`: *There is no database available* | Instance mapping HANA belum ada untuk org itu, atau instance HANA sedang stop |
| Tile / data 403 setelah deploy | Role collection belum di-assign, salah IdP, atau belum logout/login |

## Di mana data disimpan

| Kondisi | Database |
|---|---|
| Lokal (`cds watch`, `npm run test`) — semua branch | SQLite **in-memory**, diisi ulang dari CSV setiap start |
| Setelah deploy ke Cloud Foundry (Exercise 9) | **SAP HANA Cloud** (HDI container) |

## Penyimpangan dari tutorial SAP

Tutorial SAP untuk kursus ini berlabel **OUT OF MAINTENANCE** dan beberapa langkahnya tidak lagi cocok dengan CAP 9.
Repo ini memperbaikinya; detail di README branch masing-masing.

| Branch | Masalah di tutorial | Perbaikan |
|---|---|---|
| `ex05` | bob hanya role `support` → 2 test Exercise 6 gagal | bob `support` + `admin` |
| `ex06` | `npx jest` dipanggil tanpa jest terpasang | `npm add -D jest` |
| `ex07` | Link tutorial di PDF 404 | `remote-service-extend.html` |
| `ex07` | Handler `after READ` mematikan auto-urgency → 3 test gagal | Tetap `before CREATE` |
| `ex07` | Query S/4 `address('email')` + expand → *Duplicate definition of element* (CAP 9) | Expand saja |
| `ex07` | Header test memakai user yang tidak ada | Langkah dilewati |
| `ex08` | `cds add` tidak memperbarui lock file → `npm ci` gagal | `npm install` di root |
| `ex09` | Server gagal start di production: *No credentials configured for "API_BUSINESS_PARTNER"* | `credentials.destination` di profil `[production]` |
| `ex09` | `ui5 build` gagal karena ajv 8.20.0 | `overrides` ajv `8.17.1` |
| `ex09` | Nama role collection bukan `support` | `support (incident-management <org>-<space>)` |
| `ex10` | Contoh `mta.yaml` Cara B (CDM) berisi modul duplikat | Pakai Cara A (cockpit) |

## Status verifikasi

Dibangun dan diuji pada Oktober 2026 dengan `@sap/cds` 9, `@sap/cds-dk` 9.8, Node.js 22/24, `mbt` 1.2.

| Exercise | Status |
|---|---|
| 1–8 | ✅ dijalankan dan diuji lokal (`npm run test` 20/20, checkpoint per exercise) |
| 9 | ✅ `mbt build` · ✅ `cf deploy` di landscape kelas (org `cld200-d00`, space `DEV`): srv running, tabel di HANA, OData tanpa login 401 · ⏳ akses lewat role collection belum diuji |
| 10 | ⏳ langkah cockpit belum diuji |

Versi demo aplikasi (tanpa BTP: SQLite in-memory, mock user, mock S/4) berjalan di
https://cld200.ilmuprogram.co.id/launchpage.html#Shell-home — data kembali ke awal setiap restart.

## Sumber

- Tutorial: https://developers.sap.com/group.deploy-full-stack-cap-application.html dan tutorial terkait di tiap branch
- Mission terbaru (pengganti tutorial yang out of maintenance): https://discovery-center.cloud.sap/missiondetail/4327/4608/
- `srv/external/API_BUSINESS_PARTNER.edmx` diambil dari repo SAP [`SAP-samples/cloud-cap-samples-java`](https://github.com/SAP-samples/cloud-cap-samples-java) (sama dengan unduhan dari SAP Business Accelerator Hub)
