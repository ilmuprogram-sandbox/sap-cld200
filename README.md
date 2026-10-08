# Exercise 2 — Generate a User Interface Using SAP Fiori Elements

| | |
|---|---|
| Branch | `ex02-fiori-elements-ui` |
| Sebelumnya | [`ex01-create-cap-service`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex01-create-cap-service) |
| Berikutnya | [`ex03-custom-logic`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex03-custom-logic) |
| Unit | 3 · Serving User Interfaces in CAP |
| Durasi | 30 mnt (Instructor Guide) · 30 mnt (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/add-fiori-elements-uis.html |

Branch ini berisi kondisi proyek **di akhir Exercise 2**.

## Tujuan

Membuat app Fiori Elements **List Report + Object Page** untuk `Incidents`, mengaturnya dengan **Page Map / page editor**, dan mengaktifkan **draft**.

## Menjalankan branch ini

```bash
git checkout ex02-fiori-elements-ui
npm install
npm run watch-incidents     # membuka app Fiori di browser
```

Atau `cds watch` lalu buka `/incidents/webapp/index.html`.

## Perbedaan dari exercise sebelumnya

```bash
git diff ex01-create-cap-service ex02-fiori-elements-ui --stat
```

| File | Status | Isi |
|---|---|---|
| `app/incidents/**` | baru | App Fiori (`ns.incidents`) dari **Fiori: Open Application Generator** — `webapp/manifest.json`, `Component.js`, `index.html`, `i18n`, `ui5.yaml`, test OPA bawaan |
| `app/incidents/annotations.cds` | baru | **Hasil Page Map**: filter `status_code`/`urgency_code`, kolom Title·Customer·Status·Urgency, criticality status, header (title, customer name, ikon `sap-icon://alert`), section Overview → General Information + Details, section Conversation, value help Status/Urgency/Customer |
| `_i18n/i18n.properties` | baru | Kunci teks label (hasil tombol **Globe** di page editor) |
| `app/services.cds` | baru | `using from './incidents/annotations'` — dibuat generator |
| `app/incidents/webapp/manifest.json` | baru | Selain hasil generator: `initialLoad: Enabled` (List Report) dan tabel Conversation `ResponsiveTable` + `creationMode: Inline` |
| `srv/services.cds` | diubah | `annotate ProcessorService.Incidents with @odata.draft.enabled;` |
| `package.json` | diubah | script `watch-incidents` |

> Di BAS, isi `annotations.cds` dan pengaturan `manifest.json` dihasilkan dengan **mengklik** page editor.
> Di branch ini hasil akhirnya ditulis langsung — isinya setara dengan langkah klik di tutorial.

## Langkah ringkas

1. Command Palette → **Fiori: Open Application Generator** → **List Report Page** → *Use a Local CAP Project* → `ProcessorService` → Main Entity **Incidents**, tabel **Responsive** → Module `incidents`, Title `Incident-Management`, Namespace `ns`.
2. Hentikan `cds watch` yang masih jalan, lalu **Preview Application** → script `watch-incidents`.
3. **List Report** di page editor: filter field, kolom, label i18n (Globe), value help, Initial Load, criticality.
4. **Object Page**: header, section Overview/Details, field Customer dengan value help (name, email), section Conversation.
5. Tambah `@odata.draft.enabled` di `srv/services.cds`.

## Checkpoint (sudah diverifikasi)

- `/incidents/webapp/index.html` → 200; `$metadata` memuat `UI.SelectionFields`, `UI.LineItem`, `UI.HeaderInfo`, `Criticality`.
- Buat incident baru, kosongkan Customer/Status/Urgency, kembali ke list → **draft** tersimpan dan bisa dilanjutkan.

> Tampilan visual belum diverifikasi di browser oleh penyusun branch ini — cek sekali sebelum kelas.

## Catatan trainer

- **Pewarnaan status (criticality) dikerjakan di exercise ini**, bukan di Exercise 3 seperti tersirat di teks *Result* PDF.
- Error `SyntaxError: Unexpected token / in JSON at position 4` → hapus komentar di `.vscode/launch.json`.
- Port 4004 bentrok → hentikan `cds watch` sebelum `watch-incidents`.
- Tunjukkan `annotations.cds` ke peserta: Page Map hanya menulis anotasi, UI-nya *metadata-driven*.
