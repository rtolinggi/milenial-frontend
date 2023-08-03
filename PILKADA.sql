CREATE TYPE "Peran" AS ENUM (
  'admin',
  'timsukses',
  'relawan',
  'saksi'
);

CREATE TYPE "JenisKelamin" AS ENUM (
  'Pr',
  'Lk'
);

CREATE TYPE "StatusKawin" AS ENUM (
  'B',
  'P',
  'S'
);

CREATE TABLE "petugas" (
  "id" UUID PRIMARY KEY,
  "id_pengguna" UUID UNIQUE NOT NULL,
  "no_nik" VARCHAR(100) NOT NULL,
  "nama_lengkap" TEXT NOT NULL,
  "jenis_kelamin" CHAR(2) NOT NULL,
  "tanggal_lahir" BIGINT NOT NULL,
  "id_kota_kabupaten" VARCHAR(50) NOT NULL,
  "id_kecamatan" VARCHAR(50) NOT NULL,
  "id_kelurahan_desa" VARCHAR(50) NOT NULL,
  "alamat_lengkap" TEXT NOT NULL,
  "telpon" VARCHAR(20) NOT NULL,
  "id_jabatan" INTEGER NOT NULL,
  "avatar" TEXT,
  "dibuat" BIGINT NOT NULL,
  "diperbarui" BIGINT NOT NULL
);

CREATE TABLE "jabatan_petugas" (
  "id" SERIAL PRIMARY KEY,
  "nama_jabatan" VARCHAR(150) NOT NULL,
  "keterangan" TEXT NOT NULL
);

CREATE TABLE "pengguna" (
  "id" UUID PRIMARY KEY,
  "nama_pengguna" VARCHAR(150) UNIQUE NOT NULL,
  "kata_sandi" VARCHAR(50) NOT NULL,
  "peran" Peran NOT NULL,
  "aktif" boolean NOT NULL,
  "token_penyegaran" VARCHAR(100),
  "dibuat" BIGINT NOT NULL,
  "diperbarui" BIGINT NOT NULL
);

CREATE TABLE "daftar_pemilih_tetap" (
  "id" BIGSERIAL PRIMARY KEY,
  "nama" VARCHAR(200) NOT NULL,
  "jenis_kelamin" CHAR(2) NOT NULL,
  "usia" INTEGER NOT NULL,
  "id_kota_kabupaten" VARCHAR(50) NOT NULL,
  "id_kecamatan" VARCHAR(50) NOT NULL,
  "id_kelurahan_desa" VARCHAR(150) NOT NULL,
  "nama_kelurahan_desa" TEXT NOT NULL,
  "rt" CHAR(3),
  "rw" CHAR(3),
  "id_tps" INTEGER,
  "keterangan" TEXT,
  "dibuat" BIGINT NOT NULL,
  "diperbarui" BIGINT NOT NULL
);

CREATE TABLE "pendukung" (
  "id" BIGINT PRIMARY KEY,
  "id_petugas" UUID NOT NULL,
  "id_daftar_pemilih_tetap" BIGINT UNIQUE NOT NULL,
  "no_nik" VARCHAR(100) NOT NULL,
  "no_kk" VARCHAR(100) NOT NULL,
  "telpon" VARCHAR(20) NOT NULL,
  "id_pekerjaan" INTEGER NOT NULL,
  "foto_nik" TEXT,
  "foto_selfie" TEXT,
  "keterangan" TEXT,
  "dibuat" BIGINT NOT NULL,
  "diperbarui" BIGINT NOT NULL
);

CREATE TABLE "tempat_pemilihan_suara" (
  "id" SERIAL PRIMARY KEY,
  "no_tps" VARCHAR(10) NOT NULL,
  "total_pemilih" INTEGER NOT NULL,
  "id_kelurahan_desa" VARCHAR(50) NOT NULL,
  "keterangan" TEXT
);

CREATE TABLE "kota_kabupaten" (
  "id" VARCHAR(50) PRIMARY KEY,
  "nama_kota_kabupaten" VARCHAR(150) NOT NULL
);

CREATE TABLE "kecamatan" (
  "id" VARCHAR(50) PRIMARY KEY,
  "id_kota_kabupaten" INTEGER NOT NULL,
  "nama_kecamatan" VARCHAR(150) NOT NULL
);

CREATE TABLE "kelurahan_desa" (
  "id" VARCHAR(50) PRIMARY KEY,
  "id_kecamatan" INTEGER NOT NULL,
  "nama_kelurahan_desa" VARCHAR(150)
);

ALTER TABLE "petugas" ADD FOREIGN KEY ("id") REFERENCES "pengguna" ("id");

ALTER TABLE "pendukung" ADD FOREIGN KEY ("id_petugas") REFERENCES "petugas" ("id");

ALTER TABLE "pendukung" ADD FOREIGN KEY ("id_daftar_pemilih_tetap") REFERENCES "daftar_pemilih_tetap" ("id");

ALTER TABLE "petugas" ADD FOREIGN KEY ("id_jabatan") REFERENCES "jabatan_petugas" ("id");

ALTER TABLE "daftar_pemilih_tetap" ADD FOREIGN KEY ("id_tps") REFERENCES "tempat_pemilihan_suara" ("id");

ALTER TABLE "kecamatan" ADD FOREIGN KEY ("id_kota_kabupaten") REFERENCES "kota_kabupaten" ("id");

ALTER TABLE "kelurahan_desa" ADD FOREIGN KEY ("id_kecamatan") REFERENCES "kecamatan" ("id");
