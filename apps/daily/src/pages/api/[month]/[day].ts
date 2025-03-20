import { capitalize } from "@/lib/utils";
import { allDailies } from "contentlayer/generated";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDailies } from "src/lib/api";
import { type Month, Months } from "src/lib/contentlayer";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
	const { month, day, fields } = _req.query;
	console.log("dailies", allDailies.length);

	const parsedDay = Number.parseInt(day as string, 10);
	if (Number.isNaN(parsedDay)) res.status(400).json("Invalid day value");

	const capitalizedMonth = month
		? capitalize(month as Lowercase<Month>)
		: undefined;

	if (capitalizedMonth && Months.indexOf(capitalizedMonth) === -1)
		res.status(400).json("Invalid month value");

	let select: Record<string, boolean> | undefined = undefined;
	if (fields && typeof fields === "string") {
		select = {};
		for (const key of fields.split(",")) select[key] = true;
	}

	const daily = getDailies({
		filter: {
			month: capitalizedMonth,
			day: parsedDay,
		},
	});

	if (daily.length) {
		res.setHeader(
			"Cache-Control",
			"public, s-maxage=604800, stale-while-revalidate=86400",
		);
		res.status(200).json(daily[0]);
	} else
		res
			.status(404)
			.json(`No entry found for ${capitalizedMonth}, ${parsedDay}.`);
}
