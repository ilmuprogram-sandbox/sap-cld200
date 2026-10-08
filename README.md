# Exercise 5 — Define Restrictions and Roles in CDS

| | |
|---|---|
| Branch | `ex05-authorization` |
| Sebelumnya | [`ex04-local-launch-page`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex04-local-launch-page) |
| Berikutnya | [`ex06-test-cases`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex06-test-cases) |
| Unit | 5 · Understanding Authorization and Trust Management |
| Durasi | 20 mnt (Instructor Guide) · 20 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/add-authorization.html |

Branch ini berisi kondisi proyek **di akhir Exercise 5**.

## Tujuan

Melindungi service dengan role CAP dan menambahkan **mock user** untuk uji lokal.

| Role | Hak |
|---|---|
| `support` | `ProcessorService` — memproses incident, melihat customer |
| `admin` | `AdminService` — aktivitas admin |

## Menjalankan branch ini

```bash
git checkout ex05-authorization
npm install
npm run watch-incidents
```

Popup login browser muncul → user **`alice`** atau **`bob`**, password **kosong**.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex04-local-launch-page ex05-authorization
```

| File | Status | Isi |
|---|---|---|
| `srv/services.cds` | diubah | `annotate ProcessorService with @(requires: 'support');` dan `annotate AdminService with @(requires: 'admin');` |
| `package.json` | diubah | `cds.requires["[development]"].auth`: `kind: mocked`, user `alice` (`support`) dan `bob` (`support`, **`admin`**) |

## Checkpoint (sudah diverifikasi)

| Akses | Hasil |
|---|---|
| `/odata/v4/processor/Incidents` tanpa login | **401** |
| alice → `ProcessorService` | **200** |
| alice → `/odata/v4/admin/Customers` | **403** |
| bob → `/odata/v4/admin/Customers` | **200** |

## ⚠️ Penyimpangan dari tutorial

| Tutorial | Branch ini | Alasan |
|---|---|---|
| `"bob": { "roles": ["support"] }` | `"bob": { "roles": ["support", "admin"] }` | Test Exercise 6 mengharapkan bob punya role `admin`. Dengan konfigurasi tutorial, **2 dari 20 test gagal (403)** — sudah dibuktikan. |

Teks tutorial juga menyebut "you define a `password`", padahal user tidak diberi password — login dengan password kosong.

## Catatan trainer

- **Tidak ada logout.** Tutup semua jendela browser atau pakai incognito untuk ganti user. Chrome: `chrome://restart`.
- Role CAP (`support`, `admin`) **bukan** role/scope Cloud Foundry. Di Exercise 8 keduanya diterjemahkan ke `xs-security.json`, di Exercise 9 menjadi role collection — benang merah teori Unit 5.
