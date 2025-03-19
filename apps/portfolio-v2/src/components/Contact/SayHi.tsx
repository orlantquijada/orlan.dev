import ContactDialog from "./ContactDialog";

export default function SayHi() {
	return (
		<ContactDialog>
			<button
				type="button"
				className="-mx-2 h-8 rounded-full px-2 text-base underline decoration-gray9 decoration-1 underline-offset-4 transition-colors hover:bg-accent hover:text-selectionColor hover:no-underline"
			>
				Say hi
			</button>
		</ContactDialog>
	);
}
