import "./AdminDashboard.css";
import AppNavbar from "../../components/layout/AppNavbar";
import useAdminUsers from "../../hooks/useAdminUsers";

/* ── Icons ── */
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPrev   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconNext   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

/* ── Helper: lấy 2 chữ cái đầu ── */
const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

export default function AdminDashboard() {
  const {
    users, totalPages, totalItems, page, search,
    loadingList, setPage, handleSearch,
    viewUser, loadingView, openView, closeView,
    deleteTarget, loadingDelete, openDelete, closeDelete, confirmDelete,
  } = useAdminUsers();

  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="admin">
      <AppNavbar />

      <div className="admin__layout">

        {/* ── SIDEBAR ── */}
        <aside className="admin__sidebar">
          <div className="admin__sidebar-title">Quản Trị</div>
          <button className="admin__sidebar-item admin__sidebar-item--active">
            👥 Quản Lý User
          </button>
        </aside>

        {/* ── CONTENT ── */}
        <main className="admin__content">

          {/* Header */}
          <div className="admin__page-header">
            <div>
              <div className="admin__page-title">Quản Lý Người Dùng</div>
              <div className="admin__page-sub">Xem, tìm kiếm và quản lý tài khoản người dùng</div>
            </div>
          </div>

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
              <input
                className="admin__search"
                placeholder="Tìm theo username, email..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            <span className="admin__total">{totalItems} người dùng</span>
          </div>

          {/* Table */}
          <div className="admin__table-wrap">
            {loadingList ? (
              <div className="admin__loading">⏳ Đang tải dữ liệu...</div>
            ) : users.length === 0 ? (
              <div className="admin__empty">
                <div className="admin__empty-icon">🔍</div>
                Không tìm thấy người dùng nào
              </div>
            ) : (
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Người Dùng</th>
                    <th>Username</th>
                    <th>Số Điện Thoại</th>
                    <th>Vai Trò</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-user-name-wrap">
                          <div className="admin-user-avatar">
                            {getInitials(u.fullName || u.username)}
                          </div>
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
                          <button className="admin__btn-view" onClick={() => openView(u.id)}>
                            Chi Tiết
                          </button>
                          <button className="admin__btn-delete" onClick={() => openDelete({ id: u.id, username: u.username })}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin__pagination">
                <button className="admin__page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                  <IconPrev />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`admin__page-btn ${i === page ? "admin__page-btn--active" : ""}`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="admin__page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages - 1}>
                  <IconNext />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL Chi tiết ── */}
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
                <div className="admin__modal-avatar">
                  {getInitials(viewUser.fullName || viewUser.username)}
                </div>
                <div className="admin__modal-rows">
                  {[
                    { label: "ID",            value: viewUser.id },
                    { label: "Username",       value: viewUser.username },
                    { label: "Họ & Tên",       value: viewUser.fullName || "—" },
                    { label: "Email",          value: viewUser.email },
                    { label: "Số Điện Thoại", value: viewUser.phoneNumber || "—" },
                    { label: "Vai Trò",
                      value: (
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

      {/* ── MODAL Xác nhận xóa ── */}
      {deleteTarget && (
        <div className="admin__modal-overlay" onClick={closeDelete}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__confirm-icon">🗑️</div>
            <div className="admin__confirm-title">Xác Nhận Xóa</div>
            <p className="admin__confirm-desc">
              Bạn có chắc muốn xóa tài khoản{" "}
              <strong>@{deleteTarget.username}</strong>?{" "}
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
    </div>
  );
}