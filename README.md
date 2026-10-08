# Exercise 1 — Create a CAP-Based Service

| | |
|---|---|
| Branch | `ex01-create-cap-service` |
| Sebelumnya | — (proyek baru dari `cds init`) |
| Berikutnya | [`ex02-fiori-elements-ui`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex02-fiori-elements-ui) |
| Unit | 2 · Setting Up the CAP Project |
| Durasi | 30 mnt (Instructor Guide) · 30 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/build-cap-app.html |

Branch ini berisi kondisi proyek **di akhir Exercise 1**. Ringkasan semua branch ada di branch [`main`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/main).

## Tujuan

Membuat proyek CAP Node.js `incident-management` dengan domain model, dua service OData, dan data awal dari CSV.

## Menjalankan branch ini

```bash
git clone https://github.com/ilmuprogram-sandbox/sap-cld200.git
cd sap-cld200
git checkout ex01-create-cap-service
npm install
cds watch            # http://localhost:4004
```

Di SAP Business Application Studio: dev space **Full Stack Cloud Application**, clone di `/home/user/projects`.

## Perbedaan dari exercise sebelumnya

Ini exercise pertama — semua file baru.

| File | Isi | Dari langkah |
|---|---|---|
| `package.json`, `package-lock.json`, `.gitignore`, `.vscode/tasks.json` | Kerangka proyek CAP (`@sap/cds` 9, `@cap-js/sqlite` untuk dev) | `cds init --add nodejs incident-management` + `npm install` |
| `db/schema.cds` | Entity `Incidents`, `Customers`, `Addresses`, code list `Status` & `Urgency`, type `EMailAddress` & `PhoneNumber` | ditulis manual |
| `srv/services.cds` | `ProcessorService` (Incidents, Customers `@readonly`) dan `AdminService` | ditulis manual |
| `db/data/*.csv` | 8 template CSV; 6 diisi data, `*.texts.csv` dibiarkan kosong (untuk terjemahan) | `cds add data` + isi manual |

## Langkah ringkas

1. `cd projects` → `cds init --add nodejs incident-management` → buka folder → `npm install` → `cds watch`
   (output awal *No models found…* itu normal).
2. Buat `db/schema.cds` — perhatikan `cuid`, `managed`, `CodeList`, calculated element `name`, Association vs **Composition**, `@assert.format`.
   CAP langsung membuat **SQLite in-memory**.
3. Buat `srv/services.cds` — prinsip **single-purposed services**. Service tersaji di `/odata/v4/processor` dan `/odata/v4/admin`.
4. `cds add data` → isi CSV.

## Checkpoint (sudah diverifikasi)

Di halaman `http://localhost:4004`:

| URL | Hasil |
|---|---|
| `/odata/v4/processor/Incidents` | 4 incident |
| `/odata/v4/processor/Customers?$select=firstName&$expand=incidents` | 3 customer, masing-masing dengan incident-nya |

Data tampil tanpa format JSON = normal.

## Catatan trainer

- Pakai checkpoint ini untuk demo teori Unit 2: `$metadata`, `$select`, `$expand`, `$filter`.
- Kesalahan paling umum: nama file CSV tidak mengikuti pola `<namespace>-<Entity>.csv`, dan pemisah berubah saat copy-paste.
- Database masih in-memory — data kembali ke isi CSV setiap restart. HANA baru dipakai setelah deploy (Exercise 9).
