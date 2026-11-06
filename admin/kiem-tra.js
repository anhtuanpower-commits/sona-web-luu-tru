/* Luật kiểm tra dữ liệu web SONA.
   Dùng chung cho trang Admin (chặn trước khi lưu) và GitHub Actions (scripts/kiem-tra-du-lieu.js).
   Mỗi vấn đề: {file, slug, ten, truong, loi, msg}. loi=true là lỗi phải sửa, loi=false là cảnh báo. */

import { timGiaTrongDuLieu } from "./khong-gia.js";

export const RESERVED = ["sp", "bai", "hoc", "trang", "thong-tin", "gioi-thieu", "lien-he", "san-pham", "dich-vu", "tai-lieu", "doi-tac", "hoc-mien-phi", "admin", "img", "app", "scripts", "tests"];
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SEO_TITLE_MAX = 65;
export const SEO_DESC_MAX = 160;
export const IMG_EXT = /\.(jpe?g|png|webp)$/i;
const SECRET_RE = /github_pat_|ghp_[A-Za-z0-9]{20}|"(mat_khau|password|otp|token|secret|api_key)"\s*:/i;

export const slugify = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60).replace(/-$/, "");
export const isDraft = x => x && x.trang_thai === "nhap";
export const isHidden = p => !!(p && p.an);

const okUrl = u => /^https:\/\/[^\s"'<>]+$/.test(u || "");
const okImg = u => !u || /^img\/[\w./-]+$/.test(u) && !u.includes("..") || okUrl(u);
export const okLink = u => !u || /^#[\w/-]*$/.test(u) || okUrl(u);

function push(out, file, item, truong, loi, msg) {
  out.push({ file, slug: item?.slug || "", ten: item?.ten || item?.tieu_de || "", truong, loi, msg });
}

function seoChecks(out, file, x) {
  if ((x.seo_tieu_de || "").length > SEO_TITLE_MAX) push(out, file, x, "seo_tieu_de", false, `Tiêu đề SEO dài hơn ${SEO_TITLE_MAX} ký tự, Google sẽ cắt bớt.`);
  if ((x.seo_mo_ta || "").length > SEO_DESC_MAX) push(out, file, x, "seo_mo_ta", false, `Mô tả SEO dài hơn ${SEO_DESC_MAX} ký tự, Google sẽ cắt bớt.`);
}

function slugChecks(out, file, x, list, extraReserved = ["moi"]) {
  if (!x.slug) push(out, file, x, "slug", true, "Chưa có đường dẫn.");
  else if (!SLUG_RE.test(x.slug)) push(out, file, x, "slug", true, "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
  else if (list.filter(y => y.slug === x.slug).length > 1) push(out, file, x, "slug", true, `Đường dẫn "${x.slug}" bị trùng.`);
  else if (extraReserved.includes(x.slug)) push(out, file, x, "slug", true, `Đường dẫn "${x.slug}" là tên hệ thống, chọn tên khác.`);
}

export function checkProduct(p, all = {}, images = null) {
  const out = [], list = all.products || [p];
  if (!p || typeof p !== "object") return [{ file: "products", slug: "", ten: "", truong: "", loi: true, msg: "Sản phẩm không đúng dạng." }];
  if (!String(p.ten || "").trim()) push(out, "products", p, "ten", true, "Chưa có tên sản phẩm.");
  slugChecks(out, "products", p, list);
  // D-045: không có giá trên web. Mọi trường giá và chuỗi giống giá đều bị chặn.
  timGiaTrongDuLieu(p).forEach(g => push(out, "products", p, g.duong_dan.split(/[.[]/)[0], true,
    `Web không đăng giá (D-045). Bỏ "${g.chuoi}" ở mục ${g.duong_dan}; khách hỏi giá qua nút Liên hệ.`));
  if (p.ma_zalo && !/^[A-Z0-9-]{2,20}$/.test(p.ma_zalo)) push(out, "products", p, "ma_zalo", true, "Mã tin nhắn Zalo chỉ gồm chữ in hoa không dấu, số, dấu gạch ngang.");
  if (p.anh_minh_hoa != null && !Array.isArray(p.anh_minh_hoa)) push(out, "products", p, "anh_minh_hoa", true, "Ảnh màn hình phải là danh sách.");
  if (!p.anh_bia) push(out, "products", p, "anh_bia", false, "Chưa có ảnh bìa, web dùng biểu tượng thay thế.");
  if (!(Array.isArray(p.loi_ich) && p.loi_ich.length)) push(out, "products", p, "loi_ich", false, "Chưa có tính năng chính.");
  [p.anh_bia, ...(p.anh_minh_hoa || [])].forEach(u => {
    if (!okImg(u)) push(out, "products", p, "anh_bia", true, "Đường dẫn ảnh không hợp lệ.");
    else if (u && images && !/^https:/.test(u) && !images.has(u)) push(out, "products", p, "anh_bia", false, `Không thấy ảnh ${u} trong kho.`);
  });
  if (!String(p.phu_de || "").trim()) push(out, "products", p, "phu_de", false, "Chưa có mô tả ngắn.");
  seoChecks(out, "products", p);
  return out;
}

export function checkPost(a, all = {}, images = null) {
  const out = [], list = all.posts || [a];
  if (!a || typeof a !== "object") return [{ file: "posts", slug: "", ten: "", truong: "", loi: true, msg: "Bài viết không đúng dạng." }];
  if (!String(a.tieu_de || "").trim()) push(out, "posts", a, "tieu_de", true, "Chưa có tiêu đề.");
  slugChecks(out, "posts", a, list);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.ngay || "")) push(out, "posts", a, "ngay", true, "Ngày đăng chưa đúng dạng năm-tháng-ngày.");
  if (a.trang_thai != null && !["nhap", "xuat_ban"].includes(a.trang_thai)) push(out, "posts", a, "trang_thai", true, "Trạng thái không hợp lệ.");
  if (!okImg(a.anh)) push(out, "posts", a, "anh", true, "Đường dẫn ảnh không hợp lệ.");
  else if (a.anh && images && !/^https:/.test(a.anh) && !images.has(a.anh)) push(out, "posts", a, "anh", false, `Không thấy ảnh ${a.anh} trong kho.`);
  if (!String(a.tom_tat || "").trim()) push(out, "posts", a, "tom_tat", false, "Chưa có tóm tắt, danh sách bài và Google sẽ thiếu mô tả.");
  if (!String(a.noi_dung || "").trim() && !isDraft(a)) push(out, "posts", a, "noi_dung", true, "Bài đã xuất bản nhưng chưa có nội dung.");
  timGiaTrongDuLieu({ tieu_de: a.tieu_de, tom_tat: a.tom_tat, seo_tieu_de: a.seo_tieu_de, seo_mo_ta: a.seo_mo_ta }).forEach(g => push(out, "posts", a, g.duong_dan, false, `Có chuỗi giống giá "${g.chuoi}" ở ${g.duong_dan}. Web không đăng giá sản phẩm (D-045).`));
  if (a.sp && all.products && !all.products.some(p => p.slug === a.sp)) push(out, "posts", a, "sp", false, `Sản phẩm gợi ý "${a.sp}" không còn trên web.`);
  seoChecks(out, "posts", a);
  return out;
}

export function checkPage(pg, all = {}, images = null) {
  const out = [], list = all.pages || [pg];
  if (!pg || typeof pg !== "object") return [{ file: "pages", slug: "", ten: "", truong: "", loi: true, msg: "Trang không đúng dạng." }];
  if (!String(pg.tieu_de || "").trim()) push(out, "pages", pg, "tieu_de", true, "Chưa có tiêu đề trang.");
  slugChecks(out, "pages", pg, list, [...RESERVED, "moi"]);
  if (pg.trang_thai != null && !["nhap", "xuat_ban"].includes(pg.trang_thai)) push(out, "pages", pg, "trang_thai", true, "Trạng thái không hợp lệ.");
  if (!okImg(pg.anh)) push(out, "pages", pg, "anh", true, "Đường dẫn ảnh không hợp lệ.");
  else if (pg.anh && images && !/^https:/.test(pg.anh) && !images.has(pg.anh)) push(out, "pages", pg, "anh", false, `Không thấy ảnh ${pg.anh} trong kho.`);
  if (!String(pg.noi_dung || "").trim() && !isDraft(pg)) push(out, "pages", pg, "noi_dung", true, "Trang đã xuất bản nhưng chưa có nội dung.");
  timGiaTrongDuLieu(pg).forEach(g => push(out, "pages", pg, g.duong_dan.split(/[.[]/)[0], true, `Web không đăng giá (D-045). Bỏ "${g.chuoi}" ở mục ${g.duong_dan}.`));
  seoChecks(out, "pages", pg);
  return out;
}

export function checkSite(s, images = null) {
  const out = [], f = "site", it = { ten: "Cấu hình web" };
  if (!s || typeof s !== "object" || Array.isArray(s)) return [{ file: f, slug: "", ten: "", truong: "", loi: true, msg: "Thông tin web không đúng dạng." }];
  if (SECRET_RE.test(JSON.stringify(s))) push(out, f, it, "", true, "Thông tin web có vẻ chứa mật khẩu, mã OTP hoặc mã truy cập. Không được lưu những thứ này lên web.");
  if (!String(s.ten_web || "").trim()) push(out, f, it, "ten_web", true, "Chưa có tên web.");
  // Web không đăng thông tin thanh toán (D-045; Chủ tịch duyệt gỡ 06/11). Mua hàng chỉ qua Liên hệ.
  if (s.thanh_toan) push(out, f, it, "thanh_toan", true, "Web không đăng thông tin thanh toán, tài khoản ngân hàng. Bỏ mục thanh_toan khỏi site.json.");
  timGiaTrongDuLieu(s, { bo_qua: ["thanh_toan", "zalo", "hotline"] }).forEach(g => push(out, f, it, g.duong_dan.split(/[.[]/)[0], true, `Web không đăng giá (D-045). Bỏ "${g.chuoi}" ở mục ${g.duong_dan}.`));
  if (s.slogan && s.khau_hieu && s.slogan !== s.khau_hieu) push(out, f, it, "slogan", false, "Web chỉ dùng một khẩu hiệu. Ô \"slogan\" cũ khác \"khau_hieu\"; web chỉ hiện khau_hieu.");
  if (s.zalo && !/^[\d\s.+]{8,15}$/.test(s.zalo)) push(out, f, it, "zalo", true, "Số Zalo chỉ gồm chữ số.");
  if (s.hotline && !/^[\d\s.+()-]{6,20}$/.test(s.hotline)) push(out, f, it, "hotline", true, "Hotline chỉ gồm chữ số.");
  if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) push(out, f, it, "email", true, "Email chưa đúng dạng.");
  Object.entries(s.mang_xa_hoi || {}).forEach(([k, u]) => { if (u && !okUrl(u)) push(out, f, it, "mang_xa_hoi." + k, true, `Link ${k} phải bắt đầu bằng https://`); });
  const t = s.thanh_toan || {};
  if (t.ngan_hang && !/^\d{6}$/.test(t.ngan_hang)) push(out, f, it, "thanh_toan.ngan_hang", true, "Mã ngân hàng gồm 6 chữ số.");
  if (t.so_tai_khoan && !/^\d{4,20}$/.test(t.so_tai_khoan)) push(out, f, it, "thanh_toan.so_tai_khoan", true, "Số tài khoản chỉ gồm chữ số.");
  const seo = s.seo || {};
  if (seo.dia_chi_web && !/^https:\/\/[^\s]+\/$/.test(seo.dia_chi_web)) push(out, f, it, "seo.dia_chi_web", true, "Địa chỉ web phải bắt đầu bằng https:// và kết thúc bằng dấu /");
  if ((seo.tieu_de || "").length > SEO_TITLE_MAX) push(out, f, it, "seo.tieu_de", false, `Tiêu đề SEO dài hơn ${SEO_TITLE_MAX} ký tự.`);
  if ((seo.mo_ta || "").length > SEO_DESC_MAX) push(out, f, it, "seo.mo_ta", false, `Mô tả SEO dài hơn ${SEO_DESC_MAX} ký tự.`);
  [["logo", s.logo], ["favicon", s.favicon], ["seo.anh", seo.anh], ["trang_chu.anh_banner", s.trang_chu?.anh_banner]].forEach(([k, u]) => {
    if (!okImg(u)) push(out, f, it, k, true, "Đường dẫn ảnh không hợp lệ.");
    else if (u && images && !/^https:/.test(u) && !images.has(u)) push(out, f, it, k, false, `Không thấy ảnh ${u} trong kho.`);
  });
  // Link Google Form đăng ký đối tác: để trống thì web ẩn nút; có thì phải là https://
  if (s.doi_tac?.link_form && !okUrl(s.doi_tac.link_form)) push(out, f, it, "doi_tac.link_form", true, "Link form đăng ký đối tác phải bắt đầu bằng https://");
  if (!okLink(s.trang_chu?.nut_link)) push(out, f, it, "trang_chu.nut_link", true, "Link của nút phải bắt đầu bằng # hoặc https://");
  return out;
}

/** Kiểm tra toàn bộ dữ liệu. images: Set đường dẫn ảnh có trong kho, hoặc null nếu không biết. */
export function kiemTra(data, images = null) {
  const out = [];
  out.push(...checkSite(data.site, images));
  for (const [key, fn] of [["products", checkProduct], ["posts", checkPost], ["pages", checkPage]]) {
    const list = data[key];
    if (list == null) continue;
    if (!Array.isArray(list)) { out.push({ file: key, slug: "", ten: "", truong: "", loi: true, msg: `${key}.json phải là một danh sách.` }); continue; }
    list.forEach(x => out.push(...fn(x, data, images)));
  }
  // Tiêu đề SEO trùng nhau giữa các trang
  const seen = new Map();
  [...(data.products || []).filter(p => !isHidden(p)).map(p => ["products", p, p.seo_tieu_de || p.ten]),
   ...(data.posts || []).filter(a => !isDraft(a)).map(a => ["posts", a, a.seo_tieu_de || a.tieu_de]),
   ...(data.pages || []).filter(p => !isDraft(p)).map(p => ["pages", p, p.seo_tieu_de || p.tieu_de])].forEach(([f, x, t]) => {
    const k = String(t || "").trim().toLowerCase(); if (!k) return;
    if (seen.has(k)) push(out, f, x, "seo_tieu_de", false, `Tiêu đề trùng với "${seen.get(k)}". Google dễ nhầm hai trang.`);
    else seen.set(k, x.ten || x.tieu_de);
  });
  return out;
}
