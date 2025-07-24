const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
// const app = require("./server"); // Dihapus agar tidak double listen
const fs = require("fs");
const path = require("path");
const supertest = require("supertest");

chai.use(chaiHttp);
const request = supertest("http://localhost:3001");

// Helper untuk mendapatkan token login
async function getToken(email, password) {
  const res = await request.post("/login").send({ email, password });
  return res.body.token;
}

describe("API Backend Mahasiswa", function () {
  let dosenToken, mhsToken;

  before(async function () {
    dosenToken = await getToken("dosen@email.com", "dosen123");
    mhsToken = await getToken("rendisutendi10@gmail.com", "rendi123");
  });

  describe("GET /mahasiswa", function () {
    it("Dosen dapat melihat semua data mahasiswa", async function () {
      const res = await request
        .get("/mahasiswa")
        .set("Authorization", `Bearer ${dosenToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
    it("Mahasiswa hanya bisa melihat data sendiri", async function () {
      const res = await request
        .get("/mahasiswa")
        .set("Authorization", `Bearer ${mhsToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0].email).to.equal("rendisutendi10@gmail.com");
    });
  });

  describe("POST /mahasiswa", function () {
    it("Dosen dapat menambah mahasiswa", async function () {
      const res = await request
        .post("/mahasiswa")
        .set("Authorization", `Bearer ${dosenToken}`)
        .send({
          nama: "Test Mahasiswa",
          email: "testmhs@email.com",
          jurusan: "Teknik Mesin",
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("id");
    });
    it("Mahasiswa tidak boleh menambah mahasiswa", async function () {
      const res = await request
        .post("/mahasiswa")
        .set("Authorization", `Bearer ${mhsToken}`)
        .send({
          nama: "Test Mahasiswa",
          email: "testmhs@email.com",
          jurusan: "Teknik Mesin",
        });
      expect(res.status).to.equal(403);
    });
  });

  describe("PUT /mahasiswa/:id", function () {
    it("Mahasiswa hanya bisa edit data sendiri", async function () {
      // Ambil id mahasiswa dari data.json
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data.json"))
      );
      const mhs = data.find((d) => d.email === "rendisutendi10@gmail.com");
      const res = await request
        .put(`/mahasiswa/${mhs.id}`)
        .set("Authorization", `Bearer ${mhsToken}`)
        .send({
          nama: "Rendi Update",
          email: "rendisutendi10@gmail.com",
          jurusan: "Teknik Informatika",
        });
      expect(res.status).to.equal(200);
      expect(res.body.nama).to.equal("Rendi Update");
    });
    it("Mahasiswa tidak bisa edit data mahasiswa lain", async function () {
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data.json"))
      );
      const mhsLain = data.find((d) => d.email !== "rendisutendi10@gmail.com");
      const res = await request
        .put(`/mahasiswa/${mhsLain.id}`)
        .set("Authorization", `Bearer ${mhsToken}`)
        .send({
          nama: "Update Salah",
          email: mhsLain.email,
          jurusan: mhsLain.jurusan,
        });
      expect(res.status).to.equal(403);
    });
  });

  describe("DELETE /mahasiswa/:id", function () {
    it("Dosen dapat menghapus mahasiswa", async function () {
      // Tambah dulu mahasiswa dummy
      const tambah = await request
        .post("/mahasiswa")
        .set("Authorization", `Bearer ${dosenToken}`)
        .send({
          nama: "Hapus Dummy",
          email: "hapus@email.com",
          jurusan: "Teknik Sipil",
        });
      const id = tambah.body.id;
      const res = await request
        .delete(`/mahasiswa/${id}`)
        .set("Authorization", `Bearer ${dosenToken}`);
      expect(res.status).to.equal(200);
      expect(res.body.email).to.equal("hapus@email.com");
    });
    it("Mahasiswa tidak boleh menghapus mahasiswa", async function () {
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data.json"))
      );
      const mhs = data[0];
      const res = await request
        .delete(`/mahasiswa/${mhs.id}`)
        .set("Authorization", `Bearer ${mhsToken}`);
      expect(res.status).to.equal(403);
    });
  });

  describe("POST /login", function () {
    it("Login gagal jika password salah", async function () {
      const res = await request
        .post("/login")
        .send({ email: "dosen@email.com", password: "salah" });
      expect(res.status).to.equal(401);
    });
    it("Login gagal jika user tidak ditemukan", async function () {
      const res = await request
        .post("/login")
        .send({ email: "notfound@email.com", password: "apaaja" });
      expect(res.status).to.equal(401);
    });
  });
});
