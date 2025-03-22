import "./App.css";
import { Box, Text } from "components";
import { css, cx } from "styled/css";
import { text } from "styled/recipes";

function App() {
	return (
		<Box
			css={{
				backgroundColor: "olive.5",
			}}
		>
			<Text size="7xl" css={{ backgroundColor: "blue" }}>
				Hqwe
			</Text>
			<h1
				className={cx(
					text({ size: "7xl" }),
					css({ backgroundColor: "olive.5" }),
				)}
			>
				Hello
			</h1>
		</Box>
	);
}

export default App;
