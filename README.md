# Exercise 9 — Deploy in SAP BTP, Cloud Foundry Runtime

| | |
|---|---|
| Branch | `ex09-deploy-cloud-foundry` |
| Sebelumnya | [`ex08-production-prep`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex08-production-prep) |
| Berikutnya | [`ex10-work-zone`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex10-work-zone) |
| Unit | 7 · Deploying the Application |
| Durasi | 40 mnt (Instructor Guide) · **60 mnt** (2 tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/deploy-to-cf.html + https://developers.sap.com/tutorials/user-role-assignment.html |

Branch ini berisi kondisi proyek **di akhir Exercise 9**: siap di-deploy sebagai MTA ke Cloud Foundry.

## Tujuan

Deploy aplikasi sebagai **Multitarget Application (MTA)** ke SAP BTP, Cloud Foundry runtime, lalu memberi role ke user.
Di sinilah **SAP HANA Cloud** (HDI container) dan **XSUAA** benar-benar dipakai untuk pertama kali.

## Menjalankan branch ini

```bash
git checkout ex09-deploy-cloud-foundry
npm install
(cd app/incidents && npm install)
mbt build                                   # → mta_archives/incident-management_1.0.0.mtar

# landscape kelas CLD200 (origin wajib):
cf login --origin cld200-platform -a <API-ENDPOINT>
cf target -o <ORG> -s <SPACE>
cf deploy mta_archives/incident-management_1.0.0.mtar
cf services && cf apps
```

`cds up` (perintah di tutorial) = `cds add mta` + `mbt build` + `cf deploy` dalam satu langkah.

Lalu di BTP cockpit: **Security → Users** → user sendiri → **Assign Role Collection** → `support (incident-management <org>-<space>)` → **logout & login ulang**.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex08-production-prep ex09-deploy-cloud-foundry --stat -- . ':!*package-lock.json'
```

| File | Status | Isi |
|---|---|---|
| `mta.yaml` | baru | Modul `incident-management-srv` (Node.js), `-db-deployer` (HDI), `-app-deployer` + `incidentmanagementincidents` (HTML5), `-destinations`; resource XSUAA (dengan **role-collections**), HDI container `hdi-shared`, destination, html5-repo `app-host` — hasil `cds add mta` |
| `package.json` | diubah | devDependency `@sap/cds-dk` (dari `cds add mta`); **`[production].API_BUSINESS_PARTNER.credentials.destination`** |
| `app/incidents/package.json` | diubah | **`overrides`: `@ui5/project` → `ajv 8.17.1`** |
| `.gitignore` | diubah | `dist/` (output build UI5) |
| `package-lock.json`, `app/incidents/package-lock.json` | diubah | Sinkron |

## Checkpoint

| Uji | Status |
|---|---|
| `mbt build` → MTAR 5 modul (~8 MB) | ✅ diverifikasi |
| `cf deploy`, `cf services`, `cf apps` | ⏳ **belum diuji** di landscape kelas — jalankan sekali di subaccount PREP |
| Role collection ter-assign, app terbuka lewat Work Zone (Exercise 10) | ⏳ belum diuji |

Setelah deploy yang terbentuk di Cloud Foundry: app `incident-management-srv` dan `incident-management-db-deployer`; service instance HDI container, XSUAA, destination, html5-repo.

## ⚠️ Penyimpangan dari tutorial

| Masalah | Perbaikan di branch ini | Status |
|---|---|---|
| Setelah Exercise 7, server CAP **gagal start** di production: `No credentials configured for "API_BUSINESS_PARTNER"` → app crash setelah deploy | `[production].API_BUSINESS_PARTNER.credentials`: `destination: API_BUSINESS_PARTNER`, `path: /sap/opu/odata/sap/API_BUSINESS_PARTNER` | Diverifikasi lewat simulasi profil production lokal |
| `ui5 build` (modul `incidentmanagementincidents`) gagal: *Error compiling schema … Unexpected token ':'* karena **ajv 8.20.0** | `overrides` ajv `8.17.1` di `app/incidents/package.json` | Diverifikasi (Node 22 & 24) |
| `cds add mta` menambah `@sap/cds-dk` tanpa memperbarui lock → `npm ci` gagal | `npm install` di root sebelum `mbt build` / `cds up` | Diverifikasi |
| Tutorial: role collection bernama `support` / `admin` | Nama sebenarnya `support (incident-management <org>-<space>)` dan `admin (…)` | Dari `mta.yaml` yang di-generate |

Dengan perbaikan pertama, server start normal. Value help **Customer** akan menjawab **502** sampai destination `API_BUSINESS_PARTNER` dibuat di subaccount
(mis. ke `https://sandbox.api.sap.com/s4hanacloud` dengan header `APIKey` dari api.sap.com — di sinilah API key dari soal assessment Unit 6 dipakai).

## Catatan trainer

- `cf login` di landscape CLD200 **wajib** `--origin cld200-platform`.
- Instance HANA Cloud harus sudah di-share dari subaccount trainer (Instance Mapping) dan berstatus **Running** — bila tidak, pembuatan HDI container gagal.
- Saat assign role collection, pilih user dengan **identity provider yang sama** dengan yang dipakai login (IdP `cld200`). Salah IdP = role "ter-assign" tetapi tetap 403.
- Deploy paling lama di kursus (bisa > 10 menit) — mulai sebelum istirahat.
