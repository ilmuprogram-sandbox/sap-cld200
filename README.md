# Exercise 4 — Add a Local Launch Page

| | |
|---|---|
| Branch | `ex04-local-launch-page` |
| Sebelumnya | [`ex03-custom-logic`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex03-custom-logic) |
| Berikutnya | [`ex05-authorization`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex05-authorization) |
| Unit | 4 · Adding Custom Business Logic |
| Durasi | 10 mnt (Instructor Guide) · 10 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/use-local-launch-page.html |

Branch ini berisi kondisi proyek **di akhir Exercise 4**.

## Tujuan

Menambahkan **launch page lokal**: sandbox SAP Fiori launchpad (header shell + tile) untuk menguji app sebelum ada SAP Build Work Zone.
Ini salinan terbatas — tanpa konfigurasi app lewat UI, tanpa role, tanpa personalisasi.

## Menjalankan branch ini

```bash
git checkout ex04-local-launch-page
npm install
cds watch
```

Buka `http://localhost:4004/launchpage.html#Shell-home`.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex03-custom-logic ex04-local-launch-page
```

| File | Status | Isi |
|---|---|---|
| `app/launchpage.html` | baru | `sap-ushell-config` dengan satu aplikasi `incidents-app` (`SAPUI5.Component=ns.incidents`, url `./incidents/webapp`), bootstrap `sandbox.js` + `sap-ui-core.js` dari `ui5.sap.com`, tema `sap_horizon` |

File ditaruh langsung di `app/`, **bukan subfolder**.

## Checkpoint (sudah diverifikasi)

- `/launchpage.html` → 200, berisi `SAPUI5.Component=ns.incidents`.
- Di browser: ganti `/ns.incidents/index.html?sap-ui-xx-viewCache=false` pada URL app dengan `/launchpage.html#Shell-home` → muncul tile **Incident-Management**.

## Catatan trainer

- **Kenapa `launchpage.html`, bukan `index.html`?** Server CAP memakai `app/index.html` (bila ada) untuk **menggantikan** halaman default yang berisi link service. Nama lain menjaga halaman default tetap ada.
- Dev space BAS harus berstatus **Running** (soal assessment Unit 4 no. 11).
- App kedua cukup ditambah satu entri di `applications`.
- Tampilan header-nya mirip SAP Launchpad; versi "asli" dengan site, role, dan group dibuat di Exercise 10 (Work Zone).
