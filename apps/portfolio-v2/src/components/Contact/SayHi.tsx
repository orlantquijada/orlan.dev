import ContactDialog from "./ContactDialog";

export default function SayHi() {
	return (
		<ContactDialog>
			<button
				class="-mx-2 h-8 rounded-full px-2 text-base underline decoration-1 decoration-gray9 underline-offset-4 transition-colors hover:bg-accent hover:text-selectionColor hover:no-underline"
				type="button"
			>
				Say hi
			</button>
		</ContactDialog>
	);
}
