import ContactDialog from './ContactDialog'

export default function SayHi() {
  return (
    <ContactDialog>
      <button className="-mx-3 h-10 rounded-full px-3 text-2xl underline transition-colors hover:bg-accent hover:text-selectionColor hover:no-underline">
        Say hi
      </button>
    </ContactDialog>
  )
}
