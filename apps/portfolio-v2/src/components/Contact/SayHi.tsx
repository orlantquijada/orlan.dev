import ContactDialog from './ContactDialog'

export default function SayHi() {
  return (
    <ContactDialog>
      <button className="transition-colors underline hover:no-underline rounded-full text-2xl px-3 -mx-3 h-10 hover:bg-accent hover:text-selectionColor">
        Say hi
      </button>
    </ContactDialog>
  )
}
