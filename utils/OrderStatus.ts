export function getOrderStatusText(status?: string) {
  switch (status) {
    case "Pending":
      return "Đang xử lý";
    case "Completed":
      return "Hoàn thành";
    case "Cancelled":
      return "Đã huỷ";
    default:
      return status || "Không rõ";
  }
}

export function getOrderStatusEmoji(status?: string) {
  switch (status) {
    case "Pending":
      return "🟡";
    case "Completed":
      return "🟢";
    case "Cancelled":
      return "🔴";
    default:
      return "⚪";
  }
}

export function getOrderStatusColor(status?: string) {
  switch (status) {
    case "Pending":
      return "#d97706";
    case "Completed":
      return "#15803d";
    case "Cancelled":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}