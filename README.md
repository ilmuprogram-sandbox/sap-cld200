# Exercise 8 — Preparing the Production Environment

| | |
|---|---|
| Branch | `ex08-production-prep` |
| Sebelumnya | [`ex07-external-service`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex07-external-service) |
| Berikutnya | [`ex09-deploy-cloud-foundry`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex09-deploy-cloud-foundry) |
| Unit | 7 · Deploying the Application |
| Durasi | 30 mnt (Instructor Guide) · 20 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/prep-for-prod.html |

Branch ini berisi kondisi proyek **di akhir Exercise 8**.

## Tujuan

Menyiapkan konfigurasi **production**: SQLite in-memory → **SAP HANA Cloud**, mock auth → **XSUAA**, plus konfigurasi **SAP Build Work Zone** (HTML5 repo, destination, inbound navigation).
Belum ada yang di-deploy — perilaku lokal (`cds watch`) **tidak berubah**.

## Menjalankan branch ini

```bash
git checkout ex08-production-prep
npm install
(cd app/incidents && npm install)
cds build --production        # checkpoint exercise ini
cds watch --with-mocks        # lokal tetap sama seperti Exercise 7
```

## Perbedaan dari exercise sebelumnya

```bash
git diff ex07-external-service ex08-production-prep --stat -- . ':!*package-lock.json'
```

| File | Status | Isi | Dari |
|---|---|---|---|
| `package.json` | diubah | `@cap-js/hana`, `@sap/xssec`; `"[production]": { "db": "hana", "auth": "xsuaa" }`; `"destinations"`, `"html5-repo"`, `"workzone": true` | `cds add hana/xsuaa --for production`, `cds add workzone-standard` |
| `xs-security.json` | baru | Scope `$XSAPPNAME.support` & `$XSAPPNAME.admin` + role-template `support` & `admin` — diturunkan dari `@requires` Exercise 5 | `cds add xsuaa` |
| `db/undeploy.json` | baru | Daftar artefak HANA yang boleh dihapus saat redeploy | `cds add hana` |
| `app/incidents/xs-app.json` | baru | Route `^/?odata/(.*)$` → destination `srv-api` (XSUAA), sisanya → `html5-apps-repo-rt` | `cds add workzone-standard` |
| `app/incidents/ui5.yaml` | diubah | Custom task `ui5-task-zipper` (archive `incidents`, ikut `xs-app.json`) | `cds add workzone-standard` |
| `app/incidents/package.json` | diubah | devDependency `ui5-task-zipper`; script `build`, `start` | `cds add workzone-standard` |
| `app/incidents/webapp/manifest.json` | diubah | `crossNavigation.inbounds.incidents-display` (`incidents`/`display`), `"sap.cloud": { "service": "incidentmanagement.service" }`, **`uri` tanpa `/` di depan** | generator + edit manual |
| `package-lock.json`, `app/incidents/package-lock.json` | diubah/baru | Sinkron dengan dependensi baru | `npm install` |

## Checkpoint (sudah diverifikasi)

- `cds build --production` → `build completed`.
- `npm run test` → 20/20 passed (perilaku lokal tidak berubah).

## ⚠️ Penyimpangan / perbedaan dari tutorial

| Tutorial | Branch ini | Alasan |
|---|---|---|
| Hanya `npm install` di `app/incidents` | Juga **`npm install` di root** | `cds add hana/xsuaa` tidak memperbarui `package-lock.json` → `npm ci` di `mbt build` / `cds up` **gagal** |
| Destination di `xs-app.json` bernama `incident-management-srv-api` | `srv-api` | Hasil generator CAP 9 — ikuti yang di-generate |
| File `ui5-deploy.yaml` | Tidak ada; zipper di `ui5.yaml` | Hasil generator versi baru |

## Catatan trainer

- Konfigurasi untuk Work Zone (inbound navigation, `sap.cloud.service`) **dibuat di exercise ini**, bukan di Exercise 10. Bila tile tidak muncul di Exercise 10, periksa file-file di atas.
- Lupa menghapus `/` di depan `uri` → setelah deploy app terbuka tetapi data **kosong / 404**.
- Di lokal, CAP 9 me-redirect (308) URL OData relatif ke root, jadi preview lokal tetap jalan.
- Cek konfigurasi efektif: `cds env requires -4 production`.
