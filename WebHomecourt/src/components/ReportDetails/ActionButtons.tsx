interface ActionButtonsProps {
  onDismiss: () => void
  onWarning: () => void
  onSuspend: () => void
  onBan: () => void

  dismissText?: string
  warningText?: string
  suspendText?: string
  banText?: string
}

const ActionButtons = ({
  onDismiss,
  onWarning,
  onSuspend,
  onBan,
  dismissText = 'Dismiss',
  warningText = 'Send Warning',
  suspendText = 'Suspend User',
  banText = 'Ban User',
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-10 pt-5 mt-2 justify-center">
      <button
        onClick={onDismiss}
        className="w-49 px-5 py-2 rounded-lg bg-[#E7E6E8] text-black font-medium hover:brightness-75 transition-colors"
      >
        {dismissText}
      </button>

      <button
        onClick={onWarning}
        className="w-48 px-5 py-2 rounded-lg bg-[#FFD796] text-black font-medium hover:brightness-90 transition-colors"
      >
        {warningText}
      </button>

      <button
        onClick={onSuspend}
        className="w-48 px-5 py-2 rounded-lg bg-[#D38B43] text-white font-medium hover:brightness-90 transition-colors"
      >
        {suspendText}
      </button>

      <button
        onClick={onBan}
        className="w-48 px-5 py-2 rounded-lg bg-[#BC3737] text-white font-medium hover:brightness-75 transition-colors"
      >
        {banText}
      </button>
    </div>
  )
}

export default ActionButtons