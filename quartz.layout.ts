import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/WhoIsFishie/ResortBoizz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false,
        centerForce: 0,
        repelForce: 5.83,
        linkDistance: 30,
        colorGroups: [
          { query: "tag:#Resort", color: "#D336A1" },
          { query: "tag:#ResortCompany", color: "#FBFF00" },
          { query: "tag:#ResortOwner", color: "#FA0000" },
          { query: "tag:#ResortCompanyConnection", color: "#683FD9" },
          { query: "tag:#ResortPeopleConnection", color: "#18DC40" },
          { query: "tag:#ResortForeigner", color: "#00FFD5" },
          { query: "tag:#ResortForeign", color: "#ECA541" },
          { query: "tag:#ResortNew", color: "#FFFFFF" },
        ],
      },
      globalGraph: {
        showTags: false,
        centerForce: 0,
        repelForce: 5.83,
        linkDistance: 30,
        colorGroups: [
          { query: "tag:#Resort", color: "#D336A1" },
          { query: "tag:#ResortCompany", color: "#FBFF00" },
          { query: "tag:#ResortOwner", color: "#FA0000" },
          { query: "tag:#ResortCompanyConnection", color: "#683FD9" },
          { query: "tag:#ResortPeopleConnection", color: "#18DC40" },
          { query: "tag:#ResortForeigner", color: "#00FFD5" },
          { query: "tag:#ResortForeign", color: "#ECA541" },
          { query: "tag:#ResortNew", color: "#FFFFFF" },
        ],
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
