import Unicode from "../../Unicode.astro";
import Blockquote from "./Blockquote.astro";
import Code from "./Code.astro";
import H1 from "./H1.astro";
import H2 from "./H2.astro";
import Ol from "./Ol.astro";
import Pre from "./Pre.astro";
import Ul from "./Ul.astro";

export const components = {
	blockquote: Blockquote,
	code: Code,
	h1: H1,
	h2: H2,
	ol: Ol,
	pre: Pre,
	Unicode,
	ul: Ul,
};
