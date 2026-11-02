import { permanentRedirect } from "next/navigation";

/**
 * The old address stays reachable so indexed visitors do not hit a 404.
 * Content and canonical target now live at the Al Ahsa service landing page.
 * Changing geographic targets may still affect rankings.
 */
export default function LegacyRiyadhPage() {
  permanentRedirect("/al-ahsa-interior-design");
}
