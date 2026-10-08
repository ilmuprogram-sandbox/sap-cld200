/*
 * ============================================================================
 *  PENGUJIAN OTOMATIS — Aplikasi Incident Management
 * ============================================================================
 *
 *  Apa ini?
 *    Daftar skenario uji yang dijalankan komputer, bukan diklik manusia.
 *    Setiap skenario meniru apa yang dilakukan pengguna di layar Fiori
 *    (membuat, mengubah, menutup, menghapus incident), lalu memeriksa apakah
 *    hasilnya sesuai aturan bisnis.
 *
 *  Cara menjalankan:   npm test
 *    Hasilnya "passed" (lulus) atau "failed" (gagal) per skenario. Satu saja
 *    gagal berarti ada aturan bisnis yang rusak dan perlu diperiksa.
 *
 *  Cara membaca:
 *    describe('...')  = KELOMPOK skenario (satu topik)
 *    it('...')        = SATU skenario uji
 *    expect(...)      = HASIL YANG DIHARAPKAN — kalau berbeda, skenario gagal
 *
 *  Kode jawaban server yang muncul di bawah:
 *    200 = berhasil              201 = berhasil dibuat / disimpan
 *    204 = berhasil dihapus      403 = ditolak, tidak punya hak akses
 *    500 = ditolak oleh aturan bisnis (lihat catatan di skenario "buka kembali")
 *
 *  Istilah:
 *    Draft   = versi "sedang diedit" yang belum disimpan, seperti dokumen yang
 *              belum di-Save. Di layar Fiori: tombol Edit membuat draft,
 *              tombol Save mengaktifkannya ("activate").
 *    Status  : N = New (baru), C = Closed (ditutup)
 *    Urgency : H = High, M = Medium, L = Low
 *
 *  Pengguna uji (lihat package.json):
 *    alice = petugas support → boleh memproses incident
 *    bob   = support + admin → juga boleh mengelola data customer
 *
 *  Data uji: setiap kali test dijalankan, sistem memakai database sementara
 *  yang diisi data contoh (4 incident, 3 customer). Data asli tidak tersentuh.
 * ============================================================================
 */

const cds = require('@sap/cds')
const test = cds.test(__dirname + '/..', '--with-mocks')
const { GET, POST, DELETE, PATCH, expect } = test

// Kecuali disebut lain, semua skenario dijalankan sebagai alice (petugas support).
test.defaults.auth = { username: 'alice', password: '' }


// ─────────────────────────────────────────────────────────────────────────────
// KELOMPOK 1 — Data dasar dapat dibaca
// Memastikan data contoh termuat dan dapat ditampilkan.
// ─────────────────────────────────────────────────────────────────────────────
describe('Test The GET Endpoints', () => {

  // Skenario: buka daftar incident.
  // Diharapkan: tampil tepat 4 incident (sesuai data contoh).
  it('Should check Processor Service', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Incidents } = processorService.entities
    expect(await SELECT.from(Incidents)).to.have.length(4)
  })

  // Skenario: buka daftar customer.
  // Diharapkan: tampil tepat 3 customer.
  it('Should check Customers', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Customers } = processorService.entities
    expect(await SELECT.from(Customers)).to.have.length(3)
  })

  // Skenario: admin (bob) membuka daftar customer beserta incident milik
  // masing-masing customer dalam satu kali tampil.
  // Diharapkan: daftarnya berhasil tampil.
  it('Test Expand Entity Endpoint', async () => {
    const { data } = await GET(`/odata/v4/admin/Customers?$select=firstName&$expand=incidents`, { auth: { username: 'bob', password: '' } })
    expect(data).to.be.an('object')
    expect(data.value).to.be.an('array')
  })
})


// ─────────────────────────────────────────────────────────────────────────────
// KELOMPOK 2 — Siklus hidup satu incident, dari dibuat sampai dihapus
// Skenario-skenario di bawah BERURUTAN dan memakai incident yang sama,
// persis seperti seorang petugas yang bekerja langkah demi langkah di layar.
// ─────────────────────────────────────────────────────────────────────────────
describe('Draft Choreography APIs', () => {
  let draftId, incidentId

  // Langkah 1 — Petugas klik "Create" dan mengisi judul berisi kata "Urgent".
  // Diharapkan: draft baru terbentuk (belum tersimpan).
  it('Create an incident ', async () => {
    const { status, data } = await POST(`/odata/v4/processor/Incidents`, {
      title: 'Urgent attention required !',
      status_code: 'N'
    })
    draftId = data.ID
    expect(status).to.equal(201)
    expect(data.IsActiveEntity).to.equal(false)   // false = masih draft
  })

  // Langkah 2 — Petugas klik "Save".
  // Diharapkan: incident tersimpan, dan karena judulnya mengandung "urgent",
  // sistem OTOMATIS menetapkan urgensi High (H). Aturan bisnis dari Exercise 3.
  it('+ Activate the draft & check Urgency code as H using custom logic', async () => {
    const { status, data } = await POST(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
    )
    expect(status).to.eql(201)
    expect(data.urgency_code).to.eql('H')
    expect(data.IsActiveEntity).to.equal(true)    // true = sudah tersimpan
  })

  // Langkah 3 — Buka kembali incident yang baru disimpan.
  // Diharapkan: statusnya masih New (N).
  it('+ Test the incident status', async () => {
    const { status, data: { status_code, ID } } = await GET(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`
    )
    incidentId = ID
    expect(status).to.eql(200)
    expect(status_code).to.eql('N')
  })

  // ── Menutup incident, lalu mencoba membukanya kembali ──
  describe('Close Incident and Open it again to check Custom logic', () => {

    // Langkah 4 — Petugas klik "Edit" pada incident itu (untuk menutupnya).
    // Diharapkan: mode edit terbuka.
    it('Should Close the Incident', async () => {
      const { status } = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
        { PreserveChanges: true }
      )
      expect(status).to.equal(201)
    })

    // Langkah 5 — Petugas mengubah status menjadi Closed (C).
    // Diharapkan: perubahan diterima (masih di draft, belum disimpan).
    it('Should patch the Incident status to Closed', async () => {
      const { status } = await PATCH(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
        { status_code: 'C' }
      )
      expect(status).to.equal(200)
    })

    // Langkah 6 — Petugas klik "Save".
    // Diharapkan: tersimpan dengan status Closed.
    it('+ Activate the draft & check Status code as C using custom logic', async () => {
      const { status, data } = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`
      )
      expect(status).to.eql(200)
      expect(data.status_code).to.eql('C')
    })

    // Langkah 7 — Buka kembali incident itu.
    // Diharapkan: statusnya benar-benar Closed.
    it('+ Test the incident status to be closed', async () => {
      const { status, data: { status_code } } = await GET(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)`
      )
      expect(status).to.eql(200)
      expect(status_code).to.eql('C')
    })

    // ── Aturan bisnis: incident yang sudah ditutup TIDAK BOLEH diubah ──
    describe('should fail to re-open closed incident', () => {

      // Langkah 8 — Petugas klik "Edit" pada incident yang sudah Closed.
      // Diharapkan: mode edit tetap bisa dibuka (penolakan terjadi saat Save).
      it('Should Open Closed Incident', async () => {
        const { status } = await POST(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
          { PreserveChanges: true }
        )
        expect(status).to.equal(201)
      })

      // Langkah 9 — Petugas mengganti status kembali ke New.
      // Diharapkan: perubahan di draft masih diterima (belum disimpan).
      it('Should re-open the Incident but fail', async () => {
        const { status } = await PATCH(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
          { status_code: 'N' }
        )
        expect(status).to.equal(200)
      })

      // Langkah 10 — Petugas klik "Save".
      // Diharapkan: DITOLAK dengan pesan "Can't modify a closed incident".
      // Ini inti aturan bisnisnya: incident yang sudah ditutup terkunci.
      // Catatan: penolakan memakai kode 500. Secara teknis kode 4xx lebih
      // tepat, karena ini bukan kerusakan server, tetapi begitulah perilaku
      // kode tutorial SAP saat ini.
      it('Should fail to activate draft trying to re-open the incident', async () => {
        const { status, data } = await POST(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`,
          {},
          { validateStatus: null }
        )
        expect(status).to.eql(500)
        expect(data.error.message).to.include(`Can't modify a closed incident`)
      })
    })
  })

  // Langkah 11 — Petugas klik "Discard" untuk membuang draft yang gagal disimpan.
  // Diharapkan: draft terhapus.
  it('- Delete the Draft', async () => {
    const { status } = await DELETE(
      `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`
    )
    expect(status).to.eql(204)
  })

  // Langkah 12 — Petugas menghapus incident (bersih-bersih data uji).
  // Diharapkan: incident terhapus.
  it('- Delete the Incident', async () => {
    const { status } = await DELETE(
      `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)`
    )
    expect(status).to.eql(204)
  })
})


// ─────────────────────────────────────────────────────────────────────────────
// KELOMPOK 3 — Aturan urgensi otomatis
// Aturan bisnis: kalau judul incident mengandung kata "urgent" (huruf besar
// maupun kecil, di posisi mana pun), urgensinya otomatis menjadi High (H),
// apa pun yang dipilih petugas. Kalau tidak ada kata itu, pilihan petugas
// dipertahankan.
// ─────────────────────────────────────────────────────────────────────────────
describe('Auto-Urgency logic (processor-service.js custom handler)', () => {

  // Alat bantu: buat incident baru lalu langsung "Save".
  const activate = async (body) => {
    const { data: draft } = await POST(`/odata/v4/processor/Incidents`, body)
    const { data: active } = await POST(
      `/odata/v4/processor/Incidents(ID=${draft.ID},IsActiveEntity=false)/ProcessorService.draftActivate`
    )
    return active
  }
  // Alat bantu: hapus incident uji setelah selesai.
  const cleanup = async (id) => {
    await DELETE(`/odata/v4/processor/Incidents(ID=${id},IsActiveEntity=true)`, { validateStatus: null })
  }

  // Skenario: judul "Routine maintenance", petugas memilih Low.
  // Diharapkan: tetap Low. Tidak ada kata "urgent", jadi sistem tidak ikut campur.
  it('does NOT change urgency_code when title has no "urgent"', async () => {
    const active = await activate({ title: 'Routine maintenance', urgency_code: 'L', status_code: 'N' })
    expect(active.urgency_code).to.equal('L')
    await cleanup(active.ID)
  })

  // Skenario: judul "URGENT: system failure" (huruf besar semua), petugas memilih Low.
  // Diharapkan: berubah jadi High. Huruf besar/kecil tidak berpengaruh.
  it('sets urgency_code=H for all-caps URGENT (case-insensitive /urgent/i)', async () => {
    const active = await activate({ title: 'URGENT: system failure', urgency_code: 'L', status_code: 'N' })
    expect(active.urgency_code).to.equal('H')
    await cleanup(active.ID)
  })

  // Skenario: kata "urgent" ada di tengah kalimat, petugas memilih Medium.
  // Diharapkan: berubah jadi High. Posisi kata tidak berpengaruh.
  it('sets urgency_code=H when "urgent" appears mid-title', async () => {
    const active = await activate({ title: 'Please treat this as urgent matter', urgency_code: 'M', status_code: 'N' })
    expect(active.urgency_code).to.equal('H')
    await cleanup(active.ID)
  })
})


// ─────────────────────────────────────────────────────────────────────────────
// KELOMPOK 4 — Hak akses
// Aturan: menu admin (kelola customer) hanya untuk pengguna ber-role admin.
// Petugas support biasa tidak boleh masuk. Aturan dari Exercise 5.
// ─────────────────────────────────────────────────────────────────────────────
describe('Authorization', () => {

  // Skenario: alice (support saja) mencoba membuka menu admin.
  // Diharapkan: DITOLAK (403 = tidak punya hak akses).
  it('rejects support-role user (alice) from AdminService with 403', async () => {
    const { status } = await GET(`/odata/v4/admin/Customers`, { validateStatus: null })
    expect(status).to.equal(403)
  })

  // Skenario: bob (admin) membuka menu admin, menambah satu customer,
  // lalu menghapusnya kembali.
  // Diharapkan: ketiga langkah berhasil.
  it('allows bob (admin role) to read and write Customers', async () => {
    const bob = { auth: { username: 'bob', password: '' } }

    // Lihat daftar customer → berhasil
    const { status: gs, data } = await GET(`/odata/v4/admin/Customers`, bob)
    expect(gs).to.equal(200)
    expect(data.value).to.be.an('array')

    // Tambah customer baru → berhasil dibuat
    const { status: cs } = await POST(
      `/odata/v4/admin/Customers`,
      { ID: 'AUTH01', firstName: 'Test', lastName: 'Admin' },
      bob
    )
    expect(cs).to.equal(201)

    // Hapus customer tadi → berhasil dihapus
    const { status: ds } = await DELETE(`/odata/v4/admin/Customers('AUTH01')`, { ...bob, validateStatus: null })
    expect(ds).to.equal(204)
  })
})
