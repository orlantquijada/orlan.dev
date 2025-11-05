import { format } from "date-fns";
import { type MDXComponents, MDXRemote } from "next-mdx-remote-client/rsc";
import Actions from "@/components/Actions";
import LikeWrapper from "@/components/LikeWrapper";
import { LikedContentProvider } from "@/hooks/useLikedContext";
import { CONTENT_ID } from "@/hooks/useShowActions";
import type { Daily, DailyDate } from "@/lib/like";
import { bodyComponents, quoteComponents } from "./DailyDetail.components";
import styles from "./DailyDetail.module.css";

function toDateFormat({ day, month }: DailyDate) {
  const year = new Date().getFullYear();
  // Convert month name to month index
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  return format(new Date(year, monthIndex, Number(day)), "LLLL do");
}

type DailyDetailProps = {
  date: DailyDate;
  // biome-ignore lint/suspicious/noExplicitAny: mdx content
  Body: any;
  frontmatter: Daily;
};

export default function DailyDetail({
  Body,
  date,
  frontmatter,
}: DailyDetailProps) {
  const { day, month } = date;
  const dateFormat = toDateFormat({ day, month });

  return (
    <LikedContentProvider daily={{ month, day }}>
      <LikeWrapper>
        <div
          className={`${styles.container} min-h-screen animate-[fade-in_1s_both]`}
        >
          <HiddenHeader data={frontmatter} dateFormat={dateFormat} />

          <main
            className="mx-auto flex max-w-(--content-max-width) flex-col items-center px-(--content-px) pt-(--header-height) pb-[calc(2.5rem+var(--icon-button-size))]"
            id={CONTENT_ID}
          >
            <div className="mb-8 flex flex-col items-center self-center">
              <span className="text-base">{dateFormat}</span>
              <MDXRemote
                components={
                  {
                    p: (props) => (
                      <h1
                        {...props}
                        className="text-center font-bold text-2xl"
                      />
                    ),
                  } satisfies MDXComponents
                }
                source={frontmatter.title}
              />
            </div>

            <q className={styles.quote}>
              <MDXRemote
                components={quoteComponents}
                source={frontmatter.quote}
              />
            </q>

            <address className="mt-2 self-end text-base not-italic">
              — {frontmatter.author}, <em>{frontmatter.book}</em>,{" "}
              {frontmatter.section}
            </address>

            <article className={`${styles.body} mt-10 w-full`}>
              <Body components={bodyComponents} />
            </article>
          </main>

          <Actions day={day} month={month} />
        </div>
      </LikeWrapper>
    </LikedContentProvider>
  );
}

function HiddenHeader({
  data,
  dateFormat,
}: {
  data: Daily;
  dateFormat: string;
}) {
  return (
    <header>
      <div className="fixed inset-x-0 top-0 flex h-12 items-center border-b border-b-olive-6 bg-background">
        <div className="mx-auto flex w-full max-w-(--content-max-width) justify-between gap-4 px-(--content-px)">
          <MDXRemote
            components={
              {
                p: (props) => <p {...props} className="truncate" />,
              } satisfies MDXComponents
            }
            source={data.title}
          />

          <span className="shrink-0 text-base">{dateFormat}</span>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-(--header-height) bg-background" />
    </header>
  );
}
