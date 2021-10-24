import path from "path";

export const HOMEPAGE_URL = "https://koka831.github.io";
export const HOMEPAGE_TITLE = "/var/log/koka";
export const HOMEPAGE_DESCRIPTION = "cat /var/log/koka > /dev/null";

export const HOMEPAGE_THEME_COLOR = "#ddd4bb";

export const PUBLIC_IMAGE_DIR = `${HOMEPAGE_URL}/img`;
export const DEFAULT_OGP_IMAGE = `${PUBLIC_IMAGE_DIR}/icon.png`;

export const POSTS_DIR = path.join(process.cwd(), "_posts");
export const POST_EXT = ".md";
