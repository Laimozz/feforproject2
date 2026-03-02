import { useState } from "react";
import "./AdminDashboard.css";
import AppNavbar      from "../../components/layout/AppNavbar";
import useAdminUsers       from "../../hooks/useAdminUsers";
import useAdminCategories  from "../../hooks/useAdminCategories";

/* ── Icons ── */
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPrev   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconNext   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

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
                    { label: "ID",            value: viewUser.id },
                    { label: "Username",       value: viewUser.username },
                    { label: "Họ & Tên",       value: viewUser.fullName || "—" },
                    { label: "Email",          value: viewUser.email },
                    { label: "Số Điện Thoại", value: viewUser.phoneNumber || "—" },
                    { label: "Vai Trò", value: (
                      <span className={`admin-badge ${viewUser.role === "ADMIN" ? "admin-badge--admin" : "admin-badge--user"}`}>
                        {viewUser.role === "ADMIN" ? "Admin" : "User"}
                      </span>
                    )},
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
   MAIN: AdminDashboard
   Quản lý tab active (user | category)
   Render đúng section tương ứng
══════════════════════════════════════════════ */
export default function AdminDashboard() {
  // Tab đang active: "users" hoặc "categories"
  const [activeTab, setActiveTab] = useState("users");

  const TABS = [
    { key: "users",      label: "👥 Quản Lý User" },
    { key: "categories", label: "🗂️ Quản Lý Danh Mục" },
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
                {activeTab === "users" ? "Quản Lý Người Dùng" : "Quản Lý Danh Mục"}
              </div>
              <div className="admin__page-sub">
                {activeTab === "users"
                  ? "Xem, tìm kiếm và quản lý tài khoản người dùng"
                  : "Tạo mới, chỉnh sửa và xóa danh mục sản phẩm"}
              </div>
            </div>
          </div>

          {/* Render section tương ứng với tab đang chọn */}
          {activeTab === "users"      && <UserSection />}
          {activeTab === "categories" && <CategorySection />}

        </main>
      </div>
    </div>
  );
}