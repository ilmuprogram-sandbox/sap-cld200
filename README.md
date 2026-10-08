# Exercise 7 — Add an External Service (Business Partner API)

| | |
|---|---|
| Branch | `ex07-external-service` |
| Sebelumnya | [`ex06-test-cases`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex06-test-cases) |
| Berikutnya | [`ex08-production-prep`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex08-production-prep) |
| Unit | 6 · Consuming External Services |
| Durasi | 20 mnt (Instructor Guide) · **60 mnt** (2 tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/remote-service-extend.html + https://developers.sap.com/tutorials/remote-service-run-dev-test.html |

> ⚠️ Link di PDF exercise SAP (`remote-service-extend-cf.html`) **404**. Pakai link di atas.

Branch ini berisi kondisi proyek **di akhir Exercise 7**.

## Tujuan

Mengimpor **Business Partner API** SAP S/4HANA Cloud, mengambil daftar customer dari API itu (value help), menyimpan (cache) customer terpilih ke tabel lokal, dan menguji semuanya dengan **mock server lokal** — tanpa sistem S/4 sungguhan.

## Menjalankan branch ini

```bash
git checkout ex07-external-service
npm install
cds watch --with-mocks          # mock S/4 di proses yang sama
```

Atau seperti tutorial, dua terminal: `cds mock API_BUSINESS_PARTNER` lalu `cds watch`
(bila tidak terhubung, hapus `~/.cds-services.json`).

Buka `/launchpage.html` → tile Incident Management → login `alice` → **Create** → value help **Customer**.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex06-test-cases ex07-external-service --stat -- . ':!package-lock.json'
```

| File | Status | Isi |
|---|---|---|
| `srv/external/API_BUSINESS_PARTNER.edmx` | baru | Definisi API (OData V2). `cds import` memindahkannya ke sini dari root proyek |
| `srv/external/API_BUSINESS_PARTNER.cds` | baru | Hasil `cds import … --as cds`, dengan 3 association diubah menjadi **Composition** (`to_BusinessPartnerAddress`, `to_EmailAddress`, `to_PhoneNumber`) |
| `srv/remote.cds` | baru | `RemoteService` — proyeksi `BusinessPartner`, `BusinessPartnerAddress`, `EmailAddress`, `PhoneNumber` |
| `srv/external/data/*.csv` | baru | Data mock S/4 (pemisah **titik koma**), ID sama dengan customer lokal |
| `srv/services.js` | diubah | `init()` jadi `async`; handler baru `on READ Customers` → `onCustomerRead` (delegasi ke S/4) dan `on CREATE/UPDATE Incidents` → `onCustomerCache` (UPSERT ke `Customers`) |
| `package.json` | diubah | Library `@sap-cloud-sdk/*@3`; `cds.requires.API_BUSINESS_PARTNER` (`kind: odata-v2`) dari `cds import` |

## Checkpoint (sudah diverifikasi)

- Value help Customer: 3 customer dari mock S/4, dengan e-mail dari S/4 (mis. `test@demo.com`).
- Buat incident untuk customer `1004161` → data customer lokal ter-update dengan e-mail/telepon dari S/4.
- `npm run test` → 20/20 passed.

## ⚠️ Penyimpangan dari tutorial

| # | Tutorial | Branch ini | Alasan |
|---|---|---|---|
| 1 | Langkah 9.2 mengganti `before CREATE` menjadi `after READ … changeUrgencyDueToSubject` | **Tetap `before CREATE`** | Versi tutorial mematikan auto-urgency: **3 test gagal** (terbukti) |
| 2 | `onCustomerRead` ditampilkan dua versi | Satu versi (yang terakhir) | Hindari method ganda |
| 3 | Query S/4 memilih `address('email')` / `address('email','phoneNumber')` **dan** meng-expand elemen yang sama | Baris select itu dihapus, expand saja | CAP 9 menolak: *Duplicate definition of element "to_EmailAddress"* → value help error & aktivasi incident 500 |
| 4 | Langkah 10 mengganti header `tests/test.js` (user `incident.support@tester.sap.com`) | Tidak diterapkan | User itu tidak ada di mock user → test 401 |
| 5 | EDMX diunduh dari api.sap.com | Diambil dari repo SAP `SAP-samples/cloud-cap-samples-java` | Unduhan api.sap.com wajib login; isinya API yang sama |

## Catatan trainer

- Tutorial versi sekarang **sepenuhnya lokal dengan `cds mock`** — tidak memakai API key sandbox. Soal assessment Unit 6 (API key, `.env`) berasal dari versi lama yang memanggil `sandbox.api.sap.com`.
- Siapkan file EDMX di share kelas — peserta tanpa akun SAP tidak bisa mengunduhnya.
- **Penting untuk Exercise 9:** setelah exercise ini, server CAP **gagal start di production** tanpa konfigurasi destination. Perbaikannya ada di branch `ex09-deploy-cloud-foundry`.
