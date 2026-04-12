interface ActionButtonsProps {
  onDismiss: () => void
  onWarning: () => void
  onSuspend: () => void
  onBan: () => void
}

const ActionButtons = ({ onDismiss, onWarning, onSuspend, onBan }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-10 pt-5 mt-2 justify-center">
      <button
        onClick={onDismiss}
        className="w-49 px-5 py-2 rounded-lg bg-[#E7E6E8] text-black font-medium hover:brightness-75 transition-colors">
        Dismiss
      </button>
      <button
        onClick={onWarning}
        className="w-48 px-5 py-2 rounded-lg bg-[#FFD796] text-black font-medium hover:brightness-90 transition-colors">
        Send Warning
      </button>
      <button
        onClick={onSuspend}
        className="w-48 px-5 py-2 rounded-lg bg-[#D38B43] text-white font-medium hover:brightness-90 transition-colors">
        Suspend User
      </button>
      <button
        onClick={onBan}
        className="w-48 px-5 py-2 rounded-lg bg-[#BC3737] text-white font-medium hover:brightness-75 transition-colors">
        Ban User
      </button>
    </div>
  )
}

export default ActionButtons