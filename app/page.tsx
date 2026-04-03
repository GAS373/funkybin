import { GameExperience } from "@/components/game/GameExperience";
import { districtScenes } from "@/lib/game/data";
import { GAME_NAME, SEO_DESCRIPTION, SITE_NAME, SITE_URL, seoFaqs } from "@/lib/seo";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SEO_DESCRIPTION,
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: GAME_NAME,
    url: SITE_URL,
    description: SEO_DESCRIPTION,
    genre: ["Educational", "Puzzle", "Developer Learning"],
    gamePlatform: "Web Browser",
    playMode: "SinglePlayer",
    operatingSystem: "Any",
    applicationCategory: "EducationalApplication",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    educationalUse: [
      "AI literacy",
      "Prompt validation",
      "Debugging verification",
      "SQL review",
      "Regex testing",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI validation districts",
    itemListElement: districtScenes.map((scene, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: scene.title,
      description: scene.focus,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GameExperience />
    </>
  );
}