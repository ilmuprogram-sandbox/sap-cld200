# Exercise 6 — Add Test Cases

| | |
|---|---|
| Branch | `ex06-test-cases` |
| Sebelumnya | [`ex05-authorization`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex05-authorization) |
| Berikutnya | [`ex07-external-service`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex07-external-service) |
| Unit | 6 · Consuming External Services |
| Durasi | 30 mnt (Instructor Guide) · 30 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/add-test-cases.html |

Branch ini berisi kondisi proyek **di akhir Exercise 6**.

## Tujuan

Menambahkan test otomatis dengan `cds.test` + Jest untuk endpoint OData, alur draft, custom logic (Exercise 3), dan otorisasi (Exercise 5).

## Menjalankan branch ini

```bash
git checkout ex06-test-cases
npm install
npm run test
```

Hasil yang diharapkan: `Tests: 20 passed, 20 total`.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex05-authorization ex06-test-cases -- . ':!package-lock.json'
```

| File | Status | Isi |
|---|---|---|
| `tests/test.js` | baru | 20 test dalam 4 kelompok (lihat tabel di bawah) |
| `package.json` | diubah | devDependency `@cap-js/cds-test` **dan `jest`**; script `"test": "npx jest tests/test.js"` |
| `package-lock.json` | diubah | Dependensi test |

| Kelompok test | Yang diuji | User |
|---|---|---|
| Test The GET Endpoints | Incidents = 4, Customers = 3, `$expand` di AdminService | alice, bob |
| Draft Choreography APIs | Buat draft → aktivasi (urgency jadi H) → `draftEdit` → status C → buka ulang **gagal** (*Can't modify a closed incident*) → hapus | alice |
| Auto-Urgency logic | Judul tanpa "urgent" tidak berubah; "URGENT" dan "…urgent…" → H | alice |
| Authorization | alice → AdminService 403; bob baca/tulis Customers | alice, bob |

## ⚠️ Penyimpangan dari tutorial

| Tutorial | Branch ini | Alasan |
|---|---|---|
| `npm add -D @cap-js/cds-test` | `npm add -D @cap-js/cds-test jest` | Script tutorial memanggil `npx jest`, tetapi jest tidak pernah dipasang |
| bob hanya `support` (Exercise 5) | bob `support` + `admin` | Tanpa ini **2 test gagal 403** (terbukti) |
| Contoh output: 15 test | 20 test | Contoh output di tutorial sudah usang; patokannya semua *passed* |

## Catatan trainer

- Test ini sekaligus "kunci jawaban" Exercise 3 dan 5: bila Auto-Urgency gagal → cek `srv/services.js`; bila Authorization gagal → cek role bob.
- Teori Unit 6 memakai **Mocha + Chai**; exercise memakai **Jest** + `expect` dari `cds.test` (gaya Chai). Konsepnya sama, runner-nya berbeda.
- Assessment Unit 6 no. 4: file yang dipakai `test.js` (di folder `tests`), bukan `test_main.js`.
