import { useState } from "react";
import "./AdminDashboard.css";
import AppNavbar from "../../components/layout/Appnavbar";
import useAdminUsers from "../../hooks/useAdminUsers";
import useAdminCategories from "../../hooks/useAdminCategories";

// Thêm import hook sản phẩm vào danh sách import hiện có
import useAdminProducts from "../../hooks/useAdminProducts";
import useAdminOrders from "../../hooks/useAdminOrders";


/* ── Icons ── */
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconPrev = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
const IconNext = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

/* ══════════════════════════════════════════════
   SECTION: Quản lý User
══════════════════════════════════════════════ */
function UserSection() {
  const {
    users, totalPages, totalItems, page, search,
    loadingList, setPage, handleSearch,
    viewUser, loadingView, openView, closeView,
    deleteTarget, loadingDelete, openDelete, closeDelete, confirmDelete,
  } = useAdminUsers();

  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <>
      {/* Stat cards */}
      <div className="admin__stats">
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#eef2ff" }}>👥</div>
          <div>
            <div className="admin-stat__num">{totalItems}</div>
            <div className="admin-stat__label">Tổng Người Dùng</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#f0fdf4" }}>✅</div>
          <div>
            <div className="admin-stat__num">{totalItems - totalAdmins}</div>
            <div className="admin-stat__label">User Thường</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#fdf4ff" }}>🛡️</div>
          <div>
            <div className="admin-stat__num">{totalAdmins}</div>
            <div className="admin-stat__label">Quản Trị Viên</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin__toolbar">
        <div className="admin__search-wrap">
          <span className="admin__search-icon"><IconSearch /></span>
          <input className="admin__search" placeholder="Tìm theo username, email..." value={search} onChange={handleSearch} />
        </div>
        <span className="admin__total">{totalItems} người dùng</span>
      </div>

      {/* Table */}
      <div className="admin__table-wrap">
        {loadingList ? (
          <div className="admin__loading">⏳ Đang tải dữ liệu...</div>
        ) : users.length === 0 ? (
          <div className="admin__empty"><div className="admin__empty-icon">🔍</div>Không tìm thấy người dùng nào</div>
        ) : (
          <table className="admin__table">
            <thead>
              <tr>
                <th>Người Dùng</th><th>Username</th><th>Số Điện Thoại</th><th>Vai Trò</th><th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-name-wrap">
                      <div className="admin-user-avatar">{getInitials(u.fullName || u.username)}</div>
                      <div>
                        <div className="admin-user-name">{u.fullName || "—"}</div>
                        <div className="admin-user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.username}</td>
                  <td>{u.phoneNumber || "—"}</td>
                  <td>
                    <span className={`admin-badge ${u.role === "ADMIN" ? "admin-badge--admin" : "admin-badge--user"}`}>
                      {u.role === "ADMIN" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>
                    <div className="admin__action-btns">
                      <button className="admin__btn-view" onClick={() => openView(u.id)}>Chi Tiết</button>
                      <button className="admin__btn-delete" onClick={() => openDelete({ id: u.id, username: u.username })}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="admin__pagination">
            <button className="admin__page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 0}><IconPrev /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`admin__page-btn ${i === page ? "admin__page-btn--active" : ""}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="admin__page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages - 1}><IconNext /></button>
          </div>
        )}
      </div>

      {/* Modal chi tiết user */}
      {viewUser && (
        <div className="admin__modal-overlay" onClick={closeView}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__modal-header">
              <div className="admin__modal-title">Chi Tiết Người Dùng</div>
              <button className="admin__modal-close" onClick={closeView}>✕</button>
            </div>
            {viewUser === "loading" || loadingView ? (
              <div className="admin__loading">⏳ Đang tải...</div>
            ) : (
              <>
                <div className="admin__modal-avatar">{getInitials(viewUser.fullName || viewUser.username)}</div>
                <div className="admin__modal-rows">
                  {[
                    { label: "ID", value: viewUser.id },
                    { label: "Username", value: viewUser.username },
                    { label: "Họ & Tên", value: viewUser.fullName || "—" },
                    { label: "Email", value: viewUser.email },
                    { label: "Số Điện Thoại", value: viewUser.phoneNumber || "—" },
                    {
                      label: "Vai Trò", value: (
                        <span className={`admin-badge ${viewUser.role === "ADMIN" ? "admin-badge--admin" : "admin-badge--user"}`}>
                          {viewUser.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      )
                    },
                  ].map((row) => (
                    <div key={row.label} className="admin__modal-row">
                      <span className="admin__modal-row-label">{row.label}</span>
                      <span className="admin__modal-row-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa user */}
      {deleteTarget && (
        <div className="admin__modal-overlay" onClick={closeDelete}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__confirm-icon">🗑️</div>
            <div className="admin__confirm-title">Xác Nhận Xóa</div>
            <p className="admin__confirm-desc">
              Bạn có chắc muốn xóa tài khoản <strong>@{deleteTarget.username}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="admin__confirm-actions">
              <button className="admin__confirm-cancel" onClick={closeDelete}>Hủy</button>
              <button className="admin__confirm-delete" onClick={confirmDelete} disabled={loadingDelete}>
                {loadingDelete ? "Đang Xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   SECTION: Quản lý Category
══════════════════════════════════════════════ */
function CategorySection() {
  const {
    categories, loadingList,
    isFormOpen, editTarget, form, loadingSave, formError,
    openCreate, openEdit, closeForm, handleFormChange, handleSubmit,
    deleteTarget, loadingDelete,
    openDelete, closeDelete, confirmDelete,
  } = useAdminCategories();

  return (
    <>
      {/* Stat + nút Thêm mới */}
      <div className="admin__stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#fff7ed" }}>🗂️</div>
          <div>
            <div className="admin-stat__num">{categories.length}</div>
            <div className="admin-stat__label">Tổng Danh Mục</div>
          </div>
        </div>
        <div className="admin-stat" style={{ justifyContent: "flex-end" }}>
          <button className="admin__btn-create" onClick={openCreate}>
            + Thêm Danh Mục
          </button>
        </div>
      </div>

      {/* Table danh sách */}
      <div className="admin__table-wrap">
        {loadingList ? (
          <div className="admin__loading">⏳ Đang tải dữ liệu...</div>
        ) : categories.length === 0 ? (
          <div className="admin__empty">
            <div className="admin__empty-icon">🗂️</div>
            Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!
          </div>
        ) : (
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Mô Tả</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>#{cat.id}</td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{cat.name}</td>
                  <td style={{ color: "#64748b" }}>{cat.description || "—"}</td>
                  <td>
                    <div className="admin__action-btns">
                      {/* Mở form chỉnh sửa, điền sẵn data của category này */}
                      <button className="admin__btn-view" onClick={() => openEdit(cat)}>
                        Sửa
                      </button>
                      <button className="admin__btn-delete" onClick={() => openDelete({ id: cat.id, name: cat.name })}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL Form tạo mới / chỉnh sửa ── */}
      {isFormOpen && (
        <div className="admin__modal-overlay" onClick={closeForm}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__modal-header">
              {/* Tiêu đề thay đổi tùy đang tạo mới hay chỉnh sửa */}
              <div className="admin__modal-title">
                {editTarget ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </div>
              <button className="admin__modal-close" onClick={closeForm}>✕</button>
            </div>

            {formError && (
              <div className="admin__form-error">⚠️ {formError}</div>
            )}

            <form onSubmit={handleSubmit} className="admin__form">
              <div className="admin__form-field">
                <label className="admin__form-label">Tên Danh Mục *</label>
                <input
                  className="admin__form-input"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>

              <div className="admin__form-field">
                <label className="admin__form-label">Mô Tả</label>
                <textarea
                  className="admin__form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Nhập mô tả (không bắt buộc)"
                  rows={3}
                />
              </div>

              <div className="admin__form-actions">
                <button type="button" className="admin__confirm-cancel" onClick={closeForm}>
                  Hủy
                </button>
                <button type="submit" className="admin__form-submit" disabled={loadingSave}>
                  {loadingSave ? "Đang Lưu..." : editTarget ? "Cập Nhật" : "Tạo Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL Xác nhận xóa ── */}
      {deleteTarget && (
        <div className="admin__modal-overlay" onClick={closeDelete}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__confirm-icon">🗑️</div>
            <div className="admin__confirm-title">Xác Nhận Xóa</div>
            <p className="admin__confirm-desc">
              Bạn có chắc muốn xóa danh mục <strong>{deleteTarget.name}</strong>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="admin__confirm-actions">
              <button className="admin__confirm-cancel" onClick={closeDelete}>Hủy</button>
              <button className="admin__confirm-delete" onClick={confirmDelete} disabled={loadingDelete}>
                {loadingDelete ? "Đang Xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   SECTION: Quản lý Sản Phẩm
   Giao diện CRUD sản phẩm cho admin:
     - Bảng danh sách có phân trang
     - Modal form tạo mới / chỉnh sửa
     - Modal xác nhận xóa
     - Preview ảnh từ imageUrl
══════════════════════════════════════════════ */
function ProductSection() {
  const {
    products, totalPages, totalItems, page,
    loadingList, setPage,
    isFormOpen, editTarget, form, loadingSave, formError,
    openCreate, openEdit, closeForm, handleFormChange, handleSubmit,
    deleteTarget, loadingDelete,
    openDelete, closeDelete, confirmDelete,
    categories,
    selectedCategory, handleCategoryFilter,
    selectedImageFile, imagePreviewUrl, handleImageChange,
  } = useAdminProducts();

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageChange(file);
    e.target.value = "";
  };

  /* Định dạng giá tiền Việt Nam: 150000 → "150.000 ₫" */
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(price);

  return (
    <>
      {/* ── Stat cards + nút tạo mới ── */}
      <div className="admin__stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Tổng sản phẩm */}
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#f0f9ff" }}>📦</div>
          <div>
            <div className="admin-stat__num">{totalItems}</div>
            <div className="admin-stat__label">Tổng Sản Phẩm</div>
          </div>
        </div>

        {/* Số sản phẩm đang hiển thị trên trang này */}
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#f0fdf4" }}>✅</div>
          <div>
            <div className="admin-stat__num">{products.length}</div>
            <div className="admin-stat__label">Trên Trang Này</div>
          </div>
        </div>

        {/* Nút tạo mới — căn phải */}
        <div className="admin-stat" style={{ justifyContent: "flex-end" }}>
          <button className="admin__btn-create" onClick={openCreate}>
            + Thêm Sản Phẩm
          </button>
        </div>
      </div>

      {/* ── Toolbar: lọc theo category ── */}
      <div className="admin__toolbar">
        {/* Select box chọn category để lọc */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>
            Danh mục:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            style={{
              padding: "8px 36px 8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#0f172a",
              background: "#fff",
              cursor: "pointer",
              outline: "none",
              appearance: "none",          /* bỏ arrow mặc định của browser */
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 180,
            }}
          >
            {/* Option đầu tiên = hiển thị tất cả */}
            <option value="">— Tất Cả Danh Mục —</option>
            {/* Render từng category từ hook */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Hiển thị số lượng kết quả */}
          <span className="admin__total">
            {totalItems} sản phẩm
            {/* Nếu đang lọc → hiển thị tên category đang lọc */}
            {selectedCategory && (
              <span style={{ color: "#6366f1", marginLeft: 4 }}>
                trong "{categories.find(c => String(c.id) === selectedCategory)?.name}"
              </span>
            )}
          </span>
        </div>

        {/* Nút xóa bộ lọc — chỉ hiện khi đang lọc */}
        {selectedCategory && (
          <button
            onClick={() => handleCategoryFilter("")}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#64748b",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ✕ Xóa lọc
          </button>
        )}
      </div>


      {/* ── Bảng danh sách sản phẩm ── */}
      <div className="admin__table-wrap">
        {loadingList ? (
          <div className="admin__loading">⏳ Đang tải dữ liệu...</div>
        ) : products.length === 0 ? (
          <div className="admin__empty">
            <div className="admin__empty-icon">📦</div>
            Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
          </div>
        ) : (
          <table className="admin__table">
            <thead>
              <tr>
                <th>Sản Phẩm</th>  {/* Ảnh + tên + mô tả */}
                <th>Danh Mục</th>
                <th>Giá</th>
                <th>Tồn Kho</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  {/* Cột: ảnh thumbnail + tên + id */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Thumbnail ảnh sản phẩm */}
                      <div className="admin-product-thumb">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                            /* Nếu ảnh lỗi → hiện icon */
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          /* Placeholder khi không có ảnh */
                          <div style={{
                            width: 44, height: 44, background: "#f1f5f9",
                            borderRadius: 8, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: "1.2rem",
                          }}>📦</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{p.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>#{p.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Cột: tên danh mục */}
                  <td>
                    <span style={{
                      padding: "3px 10px", borderRadius: 999,
                      background: "#eef2ff", color: "#4338ca",
                      fontSize: "0.8rem", fontWeight: 500,
                    }}>
                      {p.categoryName}
                    </span>
                  </td>

                  {/* Cột: giá tiền */}
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>
                    {formatPrice(p.price)}
                  </td>

                  {/* Cột: tồn kho — đổi màu theo ngưỡng */}
                  <td>
                    <span style={{
                      fontWeight: 600,
                      /* Đỏ nếu hết hàng, cam nếu sắp hết (<= 5), xanh nếu còn nhiều */
                      color: p.stock === 0 ? "#ef4444" : p.stock <= 5 ? "#f59e0b" : "#22c55e",
                    }}>
                      {p.stock === 0 ? "Hết hàng" : p.stock}
                    </span>
                  </td>

                  {/* Cột: nút hành động */}
                  <td>
                    <div className="admin__action-btns">
                      <button
                        className="admin__btn-view"
                        onClick={() => openEdit(p)} /* mở form điền sẵn data */
                      >
                        Sửa
                      </button>
                      <button
                        className="admin__btn-delete"
                        onClick={() => openDelete({ id: p.id, name: p.name })}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Phân trang — chỉ hiện khi có > 1 trang ── */}
        {totalPages > 1 && (
          <div className="admin__pagination">
            {/* Nút Previous */}
            <button
              className="admin__page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              <IconPrev /> {/* dùng lại component IconPrev đã có trong file */}
            </button>

            {/* Các số trang */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`admin__page-btn ${i === page ? "admin__page-btn--active" : ""}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}

            {/* Nút Next */}
            <button
              className="admin__page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
            >
              <IconNext /> {/* dùng lại component IconNext đã có trong file */}
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          MODAL: Form tạo mới / chỉnh sửa sản phẩm
          isFormOpen điều khiển hiển thị/ẩn
      ══════════════════════════════════════════════ */}
      {isFormOpen && (
        <div className="admin__modal-overlay" onClick={closeForm}>
          {/* stopPropagation: click bên trong modal không đóng overlay */}
          <div className="admin__modal admin__modal--wide" onClick={(e) => e.stopPropagation()}>

            {/* Header modal */}
            <div className="admin__modal-header">
              <div className="admin__modal-title">
                {editTarget ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
              </div>
              <button className="admin__modal-close" onClick={closeForm}>✕</button>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {formError && (
              <div className="admin__form-error">⚠️ {formError}</div>
            )}

            <form onSubmit={handleSubmit} className="admin__form">

              {/* ── Row 1: Tên + Danh mục ── */}
              <div className="admin__form-row">
                <div className="admin__form-field">
                  <label className="admin__form-label">Tên Sản Phẩm *</label>
                  <input
                    className="admin__form-input"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="VD: Tai nghe Sony WH-1000XM5"
                    required
                  />
                </div>

                <div className="admin__form-field">
                  <label className="admin__form-label">Danh Mục *</label>
                  {/* Select để chọn category — data lấy từ categories state */}
                  <select
                    className="admin__form-input"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Row 2: Giá + Tồn kho ── */}
              <div className="admin__form-row">
                <div className="admin__form-field">
                  <label className="admin__form-label">Giá (VNĐ) *</label>
                  <input
                    className="admin__form-input"
                    name="price"
                    type="number"
                    min="0"
                    step="1000"              /* bước nhảy 1000đ */
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="VD: 2500000"
                  />
                </div>

                <div className="admin__form-field">
                  <label className="admin__form-label">Tồn Kho *</label>
                  <input
                    className="admin__form-input"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleFormChange}
                    placeholder="VD: 100"
                  />
                </div>
              </div>

              {/* ── Row 3: File ảnh + preview ── */}
              <div className="admin__form-field">
                <label className="admin__form-label">Ảnh Sản Phẩm</label>
                <input
                  className="admin__form-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPickImage}
                />

                {selectedImageFile && (
                  <div style={{ marginTop: 6, fontSize: "0.8rem", color: "#64748b" }}>
                    Đã chọn: {selectedImageFile.name}
                  </div>
                )}

                {imagePreviewUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "2px solid #e2e8f0",
                      }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}
              </div>


              {/* ── Mô tả ── */}
              <div className="admin__form-field">
                <label className="admin__form-label">Mô Tả</label>
                <textarea
                  className="admin__form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={3}
                />
              </div>

              {/* ── Nút hành động ── */}
              <div className="admin__form-actions">
                <button type="button" className="admin__confirm-cancel" onClick={closeForm}>
                  Hủy
                </button>
                <button type="submit" className="admin__form-submit" disabled={loadingSave}>
                  {loadingSave ? "Đang Lưu..." : editTarget ? "Cập Nhật" : "Tạo Mới"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MODAL: Xác nhận xóa sản phẩm
      ══════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="admin__modal-overlay" onClick={closeDelete}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__confirm-icon">🗑️</div>
            <div className="admin__confirm-title">Xác Nhận Xóa</div>
            <p className="admin__confirm-desc">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <strong>{deleteTarget.name}</strong>?{" "}
              Hành động này không thể hoàn tác.
            </p>
            <div className="admin__confirm-actions">
              <button className="admin__confirm-cancel" onClick={closeDelete}>Hủy</button>
              <button
                className="admin__confirm-delete"
                onClick={confirmDelete}
                disabled={loadingDelete}
              >
                {loadingDelete ? "Đang Xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   SECTION: Quản lý Đơn Hàng
══════════════════════════════════════════════ */

/* Mapping trạng thái → label + CSS class */
const STATUS_MAP = {
  PENDING: { label: "Chờ xác nhận", cls: "admin-badge--pending" },
  CONFIRMED: { label: "Đã xác nhận", cls: "admin-badge--confirmed" },
  SHIPPING: { label: "Đang giao", cls: "admin-badge--shipping" },
  DELIVERED: { label: "Đã giao", cls: "admin-badge--delivered" },
  CANCELLED: { label: "Đã hủy", cls: "admin-badge--cancelled" },
};

/* Trạng thái tiếp theo có thể chuyển sang */
const NEXT_STATUSES = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

function OrderSection() {
  const {
    orders, totalPages, totalItems, page, statusFilter,
    loadingList, setPage, handleStatusFilter,
    viewOrder, loadingView, openView, closeView,
    statusTarget, newStatus, loadingStatus, statusError,
    setNewStatus, openStatusModal, closeStatusModal, confirmUpdateStatus,
  } = useAdminOrders();

  const STATUS_OPTIONS = ["", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];

  return (
    <>
      {/* ── Stat cards ── */}
      <div className="admin__stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#fff7ed" }}>📋</div>
          <div>
            <div className="admin-stat__num">{totalItems}</div>
            <div className="admin-stat__label">Tổng Đơn Hàng</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon" style={{ background: "#eef2ff" }}>📦</div>
          <div>
            <div className="admin-stat__num">{orders.length}</div>
            <div className="admin-stat__label">Trên Trang Này</div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: lọc theo trạng thái ── */}
      <div className="admin__toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>
            Trạng thái:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            style={{
              padding: "8px 36px 8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#0f172a",
              background: "#fff",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              minWidth: 180,
            }}
          >
            <option value="">— Tất Cả —</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>
            ))}
          </select>

          <span className="admin__total">{totalItems} đơn hàng</span>
        </div>

        {statusFilter && (
          <button
            onClick={() => handleStatusFilter("")}
            style={{
              padding: "7px 16px", borderRadius: 8,
              border: "1.5px solid #e2e8f0", background: "#fff",
              fontSize: "0.8rem", fontWeight: 600, color: "#64748b", cursor: "pointer",
            }}
          >
            ✕ Xóa lọc
          </button>
        )}
      </div>

      {/* ── Bảng danh sách đơn hàng ── */}
      <div className="admin__table-wrap">
        {loadingList ? (
          <div className="admin__loading">⏳ Đang tải dữ liệu...</div>
        ) : orders.length === 0 ? (
          <div className="admin__empty">
            <div className="admin__empty-icon">📋</div>
            Không có đơn hàng nào
          </div>
        ) : (
          <table className="admin__table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách Hàng</th>
                <th>Ngày Đặt</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const st = STATUS_MAP[order.status] || { label: order.status, cls: "" };
                return (
                  <tr key={order.id}>
                    <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>#{order.id}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{order.username}</td>
                    <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{formatDate(order.orderDate)}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`admin-badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td>
                      <div className="admin__action-btns">
                        <button className="admin__btn-view" onClick={() => openView(order.id)}>Chi Tiết</button>
                        {NEXT_STATUSES[order.status]?.length > 0 && (
                          <button className="admin__btn-status" onClick={() => openStatusModal(order)}>
                            Cập Nhật
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin__pagination">
            <button className="admin__page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 0}><IconPrev /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`admin__page-btn ${i === page ? "admin__page-btn--active" : ""}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="admin__page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages - 1}><IconNext /></button>
          </div>
        )}
      </div>

      {/* ── Modal chi tiết đơn hàng ── */}
      {viewOrder && (
        <div className="admin__modal-overlay" onClick={closeView}>
          <div className="admin__modal admin__modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin__modal-header">
              <div className="admin__modal-title">Chi Tiết Đơn Hàng</div>
              <button className="admin__modal-close" onClick={closeView}>✕</button>
            </div>
            {viewOrder === "loading" || loadingView ? (
              <div className="admin__loading">⏳ Đang tải...</div>
            ) : (
              <>
                {/* Thông tin chung */}
                <div className="admin__modal-rows">
                  {[
                    { label: "Mã ĐH", value: `#${viewOrder.id}` },
                    { label: "Khách hàng", value: viewOrder.username },
                    { label: "Ngày đặt", value: formatDate(viewOrder.orderDate) },
                    { label: "Địa chỉ", value: viewOrder.shippingAddress },
                    { label: "SĐT", value: viewOrder.phone },
                    { label: "Ghi chú", value: viewOrder.note || "—" },
                    {
                      label: "Trạng thái",
                      value: (
                        <span className={`admin-badge ${(STATUS_MAP[viewOrder.status] || {}).cls}`}>
                          {(STATUS_MAP[viewOrder.status] || {}).label || viewOrder.status}
                        </span>
                      ),
                    },
                    { label: "Tổng tiền", value: formatPrice(viewOrder.totalPrice) },
                  ].map((row) => (
                    <div key={row.label} className="admin__modal-row">
                      <span className="admin__modal-row-label">{row.label}</span>
                      <span className="admin__modal-row-value">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Danh sách sản phẩm */}
                {viewOrder.items && viewOrder.items.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                      Sản phẩm ({viewOrder.items.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {viewOrder.items.map((item) => (
                        <div key={item.id} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 14px", background: "#f8fafc", borderRadius: 10,
                        }}>
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName}
                              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div style={{
                              width: 40, height: 40, background: "#e2e8f0", borderRadius: 8,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                            }}>📦</div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>{item.productName}</div>
                            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>x{item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Modal cập nhật trạng thái ── */}
      {statusTarget && (
        <div className="admin__modal-overlay" onClick={closeStatusModal}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__modal-header">
              <div className="admin__modal-title">Cập Nhật Trạng Thái</div>
              <button className="admin__modal-close" onClick={closeStatusModal}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 6 }}>Trạng thái hiện tại:</div>
              <span className={`admin-badge ${(STATUS_MAP[statusTarget.currentStatus] || {}).cls}`}>
                {(STATUS_MAP[statusTarget.currentStatus] || {}).label || statusTarget.currentStatus}
              </span>
            </div>

            {statusError && (
              <div className="admin__form-error">⚠️ {statusError}</div>
            )}

            <div className="admin__form">
              <div className="admin__form-field">
                <label className="admin__form-label">Chuyển sang trạng thái:</label>
                <select
                  className="admin__form-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">— Chọn trạng thái —</option>
                  {(NEXT_STATUSES[statusTarget.currentStatus] || []).map((s) => (
                    <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>
                  ))}
                </select>
              </div>

              <div className="admin__form-actions">
                <button className="admin__confirm-cancel" onClick={closeStatusModal}>Hủy</button>
                <button
                  className="admin__form-submit"
                  onClick={confirmUpdateStatus}
                  disabled={!newStatus || loadingStatus}
                >
                  {loadingStatus ? "Đang cập nhật..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



/* ══════════════════════════════════════════════
   MAIN: AdminDashboard
   Quản lý tab active (user | category)
   Render đúng section tương ứng
══════════════════════════════════════════════ */
export default function AdminDashboard() {
  // Tab đang active: "users" hoặc "categories"
  const [activeTab, setActiveTab] = useState("users");

  const TABS = [
    { key: "users", label: "👥 Quản Lý User" },
    { key: "categories", label: "🗂️ Quản Lý Danh Mục" },
    { key: "products", label: "📦 Quản Lý Sản Phẩm" },
    { key: "orders", label: "📋 Quản Lý Đơn Hàng" },
  ];

  return (
    <div className="admin">
      <AppNavbar />

      <div className="admin__layout">

        {/* ── SIDEBAR ── */}
        <aside className="admin__sidebar">
          <div className="admin__sidebar-title">Quản Trị</div>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin__sidebar-item ${activeTab === tab.key ? "admin__sidebar-item--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* ── CONTENT ── */}
        <main className="admin__content">

          {/* Header — tiêu đề thay đổi theo tab */}
          <div className="admin__page-header">
            <div>
              <div className="admin__page-title">
                {activeTab === "users" ? "Quản Lý Người Dùng"
                  : activeTab === "categories" ? "Quản Lý Danh Mục"
                    : activeTab === "products" ? "Quản Lý Sản Phẩm"
                      : "Quản Lý Đơn Hàng"}
              </div>
              <div className="admin__page-sub">
                {activeTab === "users" ? "Xem, tìm kiếm và quản lý tài khoản người dùng"
                  : activeTab === "categories" ? "Tạo mới, chỉnh sửa và xóa danh mục sản phẩm"
                    : activeTab === "products" ? "Tạo mới, chỉnh sửa và xóa sản phẩm"
                      : "Xem, cập nhật trạng thái và quản lý đơn hàng"}
              </div>
            </div>
          </div>

          {/* Render section tương ứng với tab đang chọn */}
          {activeTab === "users" && <UserSection />}
          {activeTab === "categories" && <CategorySection />}
          {activeTab === "products" && <ProductSection />}
          {activeTab === "orders" && <OrderSection />}

        </main>
      </div>
    </div>
  );
}