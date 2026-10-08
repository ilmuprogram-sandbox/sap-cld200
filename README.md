# Exercise 10 — Integrate with SAP Build Work Zone, Standard Edition

| | |
|---|---|
| Branch | `ex10-work-zone` |
| Sebelumnya | [`ex09-deploy-cloud-foundry`](https://github.com/ilmuprogram-sandbox/sap-cld200/tree/ex09-deploy-cloud-foundry) |
| Berikutnya | — (exercise terakhir) |
| Unit | 8 · Integrating into SAP Build Work Zone, Standard Edition |
| Durasi | 30 mnt (Instructor Guide) · **60 mnt** (tutorial) |
| Tutorial SAP | https://developers.sap.com/tutorials/integrate-with-work-zone.html |

## Tujuan

Menampilkan aplikasi Incident Management sebagai **tile di site SAP Build Work Zone, standard edition** — satu pintu masuk ke aplikasi SAP BTP.

## Perbedaan dari exercise sebelumnya

**Tidak ada perubahan kode.** Kode branch ini sama dengan `ex09-deploy-cloud-foundry`; yang berbeda hanya README ini.

```bash
git diff ex09-deploy-cloud-foundry ex10-work-zone --stat    # hanya README.md
```

Alasannya: tutorial menawarkan dua cara, dan cara yang disarankan untuk kelas (**Cara A**) seluruhnya berupa konfigurasi di BTP cockpit.
Konfigurasi aplikasi yang dibutuhkan Work Zone (`crossNavigation`, `sap.cloud.service`, HTML5 repo, destination) **sudah dibuat di Exercise 8** dan ikut ter-deploy di Exercise 9.

| | **Cara A — BTP cockpit** (disarankan) | Cara B — Common Data Model (CDM) |
|---|---|---|
| Ubah kode/MTA | Tidak | Ya — `workzone/cdm.json` + banyak perubahan `mta.yaml` |
| Redeploy | Tidak | Ya |
| Role | **Everyone** | role collection `~cdm_defaultRole` |
| Risiko di kelas | Rendah | Tinggi — contoh `mta.yaml` final di tutorial memuat modul `incident-management-app-deployer` **dua kali** |

Cara B **tidak** diimplementasikan di repo ini.

## Langkah — Cara A

**Prasyarat:** Exercise 9 sudah ter-deploy dan role collection `support (incident-management <org>-<space>)` sudah di-assign.

1. **Subscribe** — Subaccount → **Services → Service Marketplace** → **SAP Build Work Zone, standard edition** → **Create** → Plan **free** → **Create**.
2. **Role admin** — **Security → Users** → user sendiri → **Assign Role Collection** → `Launchpad_Admin` → **logout & login ulang**.
3. **Instances and Subscriptions** → **SAP Build Work Zone, standard edition** → **Channel Manager** → refresh content provider **HTML5 Apps**.
4. **Content Manager → Content Explorer** → tile **HTML5 Apps** → centang **incident-management** → **Add**.
5. **Content Manager → Create → Group** → *Incident Management Group* → assign app → **Save**.
6. **Content Manager** → role **Everyone** → **Edit** → assign app → **Save**.
7. **Site Directory → Create Site** → *Incident Management Site* → **Create**.

## Checkpoint

**Site Directory** → **Go to the site** → tile **Incident Management** → List Report tampil dengan data.

> ⏳ Belum diuji di landscape kelas — jalankan sekali di subaccount PREP sebelum kelas.

## Troubleshooting

| Gejala | Penyebab |
|---|---|
| Site Manager 403 | `Launchpad_Admin` sudah di-assign tapi belum logout/login |
| App tidak ada di HTML5 Apps | Channel Manager belum di-refresh, atau konfigurasi Exercise 8 tidak ikut ter-deploy |
| Site terbuka, tile tidak ada | App belum masuk Group, atau belum di-assign ke role **Everyone** |
| Tile terbuka, data 403 | Role collection `support (…)` (Exercise 9) belum di-assign / salah IdP |
| Tile terbuka, data 404 / kosong | `/` di depan `uri` `manifest.json` belum dihapus (Exercise 8) |
| Value help Customer 502 | Destination `API_BUSINESS_PARTNER` belum dibuat di subaccount (lihat README Exercise 9) |

## Catatan trainer

- Teks *Business Example* Exercise 10 di PDF ("add unit tests to your application") salah salin dari Exercise 6 — luruskan ke peserta.
- Kunci assessment Unit 8: 1-B, 2-B (Extensibility), 3-C (`Launchpad_Admin`).
