# Exercise 3 — Add Custom Business Logic

| | |
|---|---|
| Branch | `ex03-custom-logic` |
| Sebelumnya | [`ex02-fiori-elements-ui`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex02-fiori-elements-ui) |
| Berikutnya | [`ex04-local-launch-page`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex04-local-launch-page) |
| Unit | 4 · Adding Custom Business Logic |
| Durasi | 10 mnt (Instructor Guide) · 10 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/add-custom-logic.html |

Branch ini berisi kondisi proyek **di akhir Exercise 3**.

## Tujuan

Menambahkan event handler untuk `ProcessorService`:
- **Auto-urgency** — judul yang mengandung kata "urgent" (huruf besar/kecil) otomatis mendapat urgency **High**.
- **Validasi** — incident yang sudah **Closed** tidak boleh diubah.

## Menjalankan branch ini

```bash
git checkout ex03-custom-logic
npm install
npm run watch-incidents
```

## Perbedaan dari exercise sebelumnya

```bash
git diff ex02-fiori-elements-ui ex03-custom-logic
```

| File | Status | Isi |
|---|---|---|
| `srv/services.js` | baru | Class `ProcessorService extends cds.ApplicationService` dengan `before('CREATE')` → `changeUrgencyDueToSubject` dan `before('UPDATE')` → `onUpdate` (`req.reject` bila status `C`) |

Hanya satu file. Nama `services.js` **sama dengan** `services.cds`, sehingga CAP otomatis menjadikannya implementasi service (teori Unit 4, opsi 1).

## Checkpoint (sudah diverifikasi)

| Uji | Hasil |
|---|---|
| Buat incident berjudul "This is URGENT please", urgency **Medium**, lalu simpan | urgency menjadi **H (High)** |
| Edit incident *Inverter not functional* (status Closed) → simpan | ditolak: *Can't modify a closed incident!* |

## Bug tutorial

Bagian *Understand the custom code* di tutorial menjelaskan handler **after READ** yang mengubah hasil baca.
Itu **tidak cocok** dengan kode yang ditulis (handler **before CREATE** dan **before UPDATE**). Jelaskan ke peserta sesuai kodenya.

## Catatan trainer

- Kaitkan dengan fase event `before` / `on` / `after`: `before` dipakai untuk enrichment dan validasi.
- `req.reject` mengirim error ke client. `req.subject` adalah entitas yang sedang diubah.
- Logika ini nanti diuji otomatis di Exercise 6 (test *Auto-Urgency* dan *Close Incident…*).
