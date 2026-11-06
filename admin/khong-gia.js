/* D-045: web SONA không hiện giá ở bất kỳ đâu. Mua hàng chỉ qua nút Liên hệ (Zalo).
   Dùng chung cho Admin (chặn trước khi lưu), scripts/kiem-tra-du-lieu.js, scripts/tao-trang-seo.js và kiểm thử. */

// Số tiền có đơn vị: một số theo sau là đ, ₫, VNĐ, đồng, k, nghìn, ngàn, triệu, tr
// (?![\p{L}]) để không bắt nhầm chữ thường như "3 điều", "300 khách".
export const GIA_RE = /\d[\d.,]*\s?(?:đ|₫|vnđ|vnd|đồng|dong|k|nghìn|ngàn|triệu|tr)(?![\p{L}\d])/giu;
// Số có dấu phân cách hàng nghìn đứng riêng (ba chữ số sau mỗi dấu chấm hoặc phẩy)
export const SO_TIEN_RE = /(?<![\d.,])\d{1,3}(?:[.,]\d{3}){1,}(?![\d.,]*\d)(?![\p{L}%])/gu;
// Trường dữ liệu chỉ dùng cho giá và luồng chuyển khoản có số tiền
export const TRUONG_GIA = ["goi", "gia", "so_tien", "gia_niem_yet", "gia_ban", "gia_goc"];

/** Tìm chuỗi giống giá trong một đoạn chữ. Trả về danh sách chuỗi tìm thấy. */
export function timGia(text) {
  const s = String(text ?? "");
  return [...(s.match(GIA_RE) || []), ...(s.match(SO_TIEN_RE) || [])];
}

/** Duyệt mọi giá trị chữ trong một đối tượng JSON. Trả về [{duong_dan, chuoi}] cho mỗi chuỗi giống giá
    và mỗi trường giá còn sót (goi, so_tien…). bo_qua: tên trường không xét (ví dụ thanh_toan). */
export function timGiaTrongDuLieu(x, { bo_qua = [] } = {}, path = "") {
  const out = [];
  if (Array.isArray(x)) x.forEach((v, i) => out.push(...timGiaTrongDuLieu(v, { bo_qua }, path + "[" + i + "]")));
  else if (x && typeof x === "object") {
    for (const [k, v] of Object.entries(x)) {
      if (bo_qua.includes(k)) continue;
      const p = path ? path + "." + k : k;
      if (TRUONG_GIA.includes(k)) out.push({ duong_dan: p, chuoi: "trường " + k });
      else out.push(...timGiaTrongDuLieu(v, { bo_qua }, p));
    }
  } else if (typeof x === "string") timGia(x).forEach(c => out.push({ duong_dan: path, chuoi: c }));
  return out;
}

/** Bỏ chuỗi giống giá khỏi một đoạn chữ (dùng cho tiêu đề, mô tả SEO). */
export const boGia = s => String(s ?? "").replace(GIA_RE, "").replace(SO_TIEN_RE, "").replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
