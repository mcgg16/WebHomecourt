type StatusAlertProps = {
  tone: "success" | "error" | "warning" | "info"
  title: string
  message?: string
}

const toneStyles: Record<StatusAlertProps["tone"], { card: string; title: string; iconText: string; icon: string }> = {
  success: {
    card: "bg-green-100 border-green-100",
    title: "text-green-700",
    iconText: "text-green-700",
    icon: "check_small",
  },
  error: {
    card: "bg-red-100 border-red-100",
    title: "text-red-700",
    iconText: "text-red-700",
    icon: "exclamation",
  },
  warning: {
    card: "bg-orange-100 border-orange-100",
    title: "text-orange-500",
    iconText: "text-orange-500",
    icon: "warning",
  },
  info: {
    card: "bg-sky-100 border-sky-100",
    title: "text-sky-600",
    iconText: "text-sky-600",
    icon: "info",
  },
}

function StatusAlert({ title, message, tone }: StatusAlertProps) {
  const style = toneStyles[tone]
  const hasMessage = Boolean(message)

  return (
    <div className={`w-full rounded-2xl border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.32)] px-3 py-2 ${style.card}`}>
      <div className={`flex gap-2.5 ${hasMessage ? "items-start" : "items-center"}`}>
        <span className={`material-symbols-outlined text-sm ${style.iconText}`}>{style.icon}</span>

        <div className="min-w-0">
          <p className={`text-xs font-medium font-['Graphik'] ${style.title}`}>{title}</p>
          {message ? <p className="text-[10px] text-stone-500 font-medium font-['Graphik']">{message}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default StatusAlert
