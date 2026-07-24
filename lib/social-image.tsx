import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import {
  SITE_DESCRIPTION,
  SITE_HOME_TITLE,
  SITE_NAME,
} from "@/lib/site";

type SocialImageOptions = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

export async function createSocialImage({
  eyebrow = SITE_NAME,
  title = SITE_HOME_TITLE,
  description = SITE_DESCRIPTION,
}: SocialImageOptions = {}) {
  const logo = await readFile(
    path.join(
      process.cwd(),
      "public",
      "brand",
      "godocs-wordmark-on-dark.svg",
    ),
    "utf8",
  );
  const logoSource = `data:image/svg+xml;base64,${Buffer.from(logo).toString(
    "base64",
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "68px 78px",
          background: "#1b1b1b",
          color: "#f6f6f6",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ImageResponse renders images through Satori, not next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height={60}
            src={logoSource}
            style={{ display: "block" }}
            width={242}
          />
          <span
            style={{
              color: "#929292",
              fontSize: 22,
              letterSpacing: "-0.01em",
            }}
          >
            godocs-docs.vercel.app
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#ff7900",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.09em",
            }}
          >
            <span
              style={{
                display: "flex",
                width: 34,
                height: 3,
                background: "#ff7900",
              }}
            />
            {eyebrow.toLocaleUpperCase("pt-BR")}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 980,
              marginTop: 22,
              fontSize: title.length > 42 ? 58 : 68,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 940,
              marginTop: 22,
              color: "#b2b2b2",
              fontSize: 27,
              lineHeight: 1.42,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 2,
            background: "#353535",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 184,
              height: 2,
              background: "#ff7900",
            }}
          />
        </div>
      </div>
    ),
    socialImageSize,
  );
}
