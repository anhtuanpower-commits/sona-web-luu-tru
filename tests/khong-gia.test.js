// D-045: web SONA không hiện giá ở bất kỳ đâu (dữ liệu JSON, trang chủ, trang SEO tự tạo, mã QR có số tiền).
// Kiểm thử này quét toàn bộ tệp phục vụ ra web (trừ app khách đã giao trong app/ và bài Học AI)
// và dữ liệu thật trong kho; có chuỗi giá là báo đỏ.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { timGia, timGiaTrongDuLieu, boGia } from "../admin/khong-gia.js";
import { checkProduct, checkPage, checkSite } from "../admin/kiem-tra.js";
import { build } from "../scripts/tao-trang-seo.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = f => JSON.parse(readFileSync(join(ROOT, f), "utf8"));
const real = { site: read("site.json"), products: read("products.json"), posts: read("posts.json"), pages: existsSync(join(ROOT, "pages.json")) ? read("pages.json") : [] };
const indexHtml = readFileSync(join(ROOT, "index.html"), "utf8");

test("luật nhận ra chuỗi giá, không bắt nhầm chữ thường", () => {
  for (const s of ["390.000đ", "49.000 đ", "1.990.000 VNĐ", "2,99 triệu", "390k", "500 nghìn", "1.490.000₫", "giá 2.990.000", "100.000 đồng"])
    assert.ok(timGia(s).length, "không nhận ra: " + s);
  for (const s of ["3 điều", "300 khách", "8h–20h", "K80, K58, A5", "v1.4.0", "spa 1–3 người", "12 tuần", "36 bài", "Zalo 0965292875"])
    assert.deepEqual(timGia(s), [], "bắt nhầm: " + s);
  assert.equal(boGia("App 390.000đ trả một lần"), "App trả một lần");
});
test("dữ liệu sản phẩm, cấu hình, trang không còn giá hay trường giá", () => {
  assert.deepEqual(timGiaTrongDuLieu(real.products), []);
  assert.deepEqual(timGiaTrongDuLieu(real.pages), []);
  assert.deepEqual(timGiaTrongDuLieu(real.site, { bo_qua: ["thanh_toan", "zalo", "hotline"] }), []);
});
test("Admin và kiểm tra dữ liệu chặn sản phẩm, trang, cấu hình có giá", () => {
  const p = { slug: "x", ten: "X", phu_de: "Chỉ 390.000đ", loi_ich: ["a"] };
  assert.ok(checkProduct(p).some(i => i.loi && /D-045/.test(i.msg)));
  assert.ok(checkProduct({ ...p, phu_de: "ok", goi: [{ ten: "G", so_tien: 1 }] }).some(i => i.loi && i.truong === "goi"));
  assert.ok(checkProduct({ ...p, phu_de: "ok", cau_hoi: [{ hoi: "Giá?", dap: "2,99 triệu" }] }).some(i => i.loi));
  assert.ok(checkPage({ slug: "p", tieu_de: "P", noi_dung: "Gói 1.990.000 VNĐ" }).some(i => i.loi));
  assert.ok(checkSite({ ten_web: "S", trang_chu: { mo_ta: "Chỉ từ 490k" } }).some(i => i.loi));
});
test("trang SEO tự tạo không sinh giá, kể cả khi dữ liệu cũ còn giá", () => {
  const files = build({ ...real, indexHtml });
  const head = c => (c.match(/<!--seo:dau-->[\s\S]*?<!--seo:cuoi-->/) || [""])[0];
  for (const [f, c] of Object.entries(files)) assert.deepEqual(timGia(f.endsWith(".html") ? head(c) : c), [], f);
  const cu = build({ ...real, products: [{ slug: "cu", ten: "App cũ 390.000đ", phu_de: "Trả một lần 390.000đ" }], indexHtml });
  assert.deepEqual(timGia(head(cu["sp/cu/index.html"])), []);
});
test("mọi tệp phục vụ ra web (trừ app khách đã giao và bài Học AI) không có giá, không có luồng VietQR", () => {
  const skip = /^(\.git|node_modules|app|tests|\.github)(\/|$)|\.md$|^posts\.json$|^package/;
  const hits = [];
  const walk = d => readdirSync(d).forEach(n => {
    const p = join(d, n), r = relative(ROOT, p).split("\\").join("/");
    if (skip.test(r)) return;
    if (statSync(p).isDirectory()) return walk(p);
    if (![".html", ".js", ".json", ".xml", ".txt", ".css"].includes(extname(p))) return;
    let c = readFileSync(p, "utf8");
    if (r === "site.json") { const s = JSON.parse(c); delete s.thanh_toan; c = JSON.stringify(s); }
    if (r.startsWith("bai/")) c = (c.match(/<!--seo:dau-->[\s\S]*?<!--seo:cuoi-->/) || [""])[0];
    // Bỏ qua tệp luật chặn giá và tệp kiểm tra dữ liệu (chỉ chứa tên trường để chặn).
    if (/^admin\/(khong-gia|kiem-tra)\.js$/.test(r)) return;
    timGia(c).forEach(x => hits.push(r + ": " + x));
    if (/vietqr|so_tien|gia_niem_yet/i.test(c)) hits.push(r + ": còn luồng VietQR hoặc trường giá");
  });
  walk(ROOT);
  assert.deepEqual(hits, []);
});
