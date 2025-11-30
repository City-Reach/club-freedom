import { Heading, Link } from "@react-email/components";
import { BaseEmail, styles } from "./base-email";

interface InvitationEmailProps {
  url: string;
  brandName?: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export default function InvitationEmail({
  url,
  brandName,
  brandLogoUrl,
  brandTagline,
}: InvitationEmailProps) {
  return (
    <BaseEmail
      previewText="You're invited"
      brandName={brandName}
      brandLogoUrl={brandLogoUrl}
      brandTagline={brandTagline}
    >
      <Heading style={styles.h1}>You're invited</Heading>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "block",
          marginBottom: "16px",
        }}
      >
        Accept invitation
      </Link>
    </BaseEmail>
  );
}
