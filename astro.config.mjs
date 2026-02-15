// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://opensocial.community",
  integrations: [
    starlight({
      title: "Open Social",
      description:
        "Community management infrastructure for ATProto applications",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/collectivesocial",
        },
        {
          icon: "blueSky",
          label: "Bluesky",
          href: "https://bsky.app/profile/opensocial.community",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "/og-image.png",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Overview", slug: "getting-started/overview" },
            { label: "Authentication", slug: "getting-started/authentication" },
          ],
        },
        {
          label: "App Management",
          items: [
            { label: "Register an App", slug: "apps/register" },
            { label: "Manage Your Apps", slug: "apps/manage" },
          ],
        },
        {
          label: "Community Management",
          items: [
            {
              label: "Create a Community",
              slug: "communities/create",
            },
            {
              label: "Community Types",
              slug: "communities/types",
            },
            {
              label: "Manage Members",
              slug: "communities/members",
            },
            {
              label: "Manage Records",
              slug: "communities/records",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "API Endpoints", slug: "reference/api-endpoints" },
            { label: "Lexicons", slug: "reference/lexicons" },
          ],
        },
        {
          label: "Contact",
          items: [{ label: "Get in Touch", slug: "contact" }],
        },
      ],
    }),
  ],
});
