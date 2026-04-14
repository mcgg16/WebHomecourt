import type { ReactNode } from "react"
import Button from "../button.tsx"

type ChatTab = "community" | "private"

type ChatPanelFrameProps = {
  title?: string
  activeTab: ChatTab
  onOpenCommunity?: () => void
  onOpenPrivate?: () => void
  children: ReactNode
  footer?: ReactNode
}

function ChatPanelFrame({
  title = "Real-Time Chat",
  activeTab,
  onOpenCommunity,
  onOpenPrivate,
  children,
  footer,
}: ChatPanelFrameProps) {
  return (
    <section className="w-full h-full max-h-[500px] lg:max-h-[700px] p-6 bg-white rounded-2xl outline outline-1 outline-black/25 flex flex-col gap-4 overflow-hidden">
      <div className="self-stretch inline-flex justify-between items-center">
        <h2 className="text-2xl font-bold text-violet-950">{title}</h2>
      </div>

      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <Button
          type={activeTab === "community" ? "primary" : "secondary"}
          text="Community"
          onClick={onOpenCommunity ?? (() => {})}
          className="flex-1 !py-1"
        />
        <Button
          type={activeTab === "private" ? "primary" : "secondary"}
          text="Private"
          onClick={onOpenPrivate ?? (() => {})}
          className="flex-1 !py-1"
        />
      </div>

      <div className="self-stretch h-0.5 bg-zinc-500"></div>

      <div className="flex-1 min-h-0 w-full overflow-y-auto pr-2">
        {children}
      </div>

      {footer ? (
        <>
          <div className="self-stretch h-0.5 bg-zinc-500"></div>
          <div className="w-full">{footer}</div>
        </>
      ) : null}
    </section>
  )
}

export default ChatPanelFrame
